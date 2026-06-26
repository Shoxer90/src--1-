const usb = require('usb');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');

// AXIOM S10 / Printer-80 (80mm thermal, ESC/POS)
const VENDOR_ID = 0x1FC9;
const PRODUCT_ID = 0x2016;
const PORT = 3001;
const WINDOWS_PRINTER_NAME = process.env.WINDOWS_PRINTER_NAME || '';

const IS_WINDOWS = process.platform === 'win32';
const ESC = 0x1B;
const GS = 0x1D;

const app = express();
app.use(cors());
app.use(express.json());

function getPrinterDevice() {
  return usb.findByIds(VENDOR_ID, PRODUCT_ID);
}

function describeUsbError(err) {
  const code = err?.message || String(err);

  if (code.includes('LIBUSB_ERROR_NOT_SUPPORTED')) {
    return (
      'USB-драйвер не поддерживается. В Zadig выберите AXIOM S10 и установите WinUSB, ' +
      'затем переподключите USB и перезапустите: npm run printer'
    );
  }
  if (code.includes('LIBUSB_ERROR_ACCESS')) {
    return (
      'Нет доступа к принтеру. Закройте другие программы печати и запустите терминал ' +
      'от имени администратора: npm run printer'
    );
  }

  return code;
}

function detachKernelDriverIfNeeded(iface) {
  if (IS_WINDOWS) {
    return;
  }

  try {
    if (iface.isKernelDriverActive && iface.isKernelDriverActive()) {
      iface.detachKernelDriver();
    }
  } catch (_) {}
}

function findPrinterOutEndpoint() {
  const device = getPrinterDevice();
  if (!device) {
    throw new Error(
      `Принтер AXIOM не найден (VID=${VENDOR_ID.toString(16)}, PID=${PRODUCT_ID.toString(16)}). ` +
      'Проверьте USB-кабель и драйвер WinUSB в Zadig.'
    );
  }

  device.open();

  for (const iface of device.interfaces) {
    try {
      detachKernelDriverIfNeeded(iface);
      iface.claim();

      const outEndpoint = iface.endpoints.find((ep) => ep.direction === 'out');
      if (!outEndpoint) {
        iface.release();
        continue;
      }

      return { device, iface, outEndpoint };
    } catch (err) {
      console.error(`Interface ${iface.interfaceNumber} error:`, err.message);
      try {
        iface.release();
      } catch (_) {}
    }
  }

  try {
    device.close();
  } catch (_) {}

  throw new Error('Не найден OUT endpoint у принтера.');
}

function transferChunked(outEndpoint, buffer) {
  const chunkSize = outEndpoint.descriptor?.wMaxPacketSize || 64;

  return new Promise((resolve, reject) => {
    let offset = 0;

    const sendNext = () => {
      if (offset >= buffer.length) {
        return resolve();
      }

      const chunk = buffer.subarray(offset, offset + chunkSize);
      offset += chunk.length;

      outEndpoint.transfer(chunk, (err) => {
        if (err) {
          return reject(err);
        }
        sendNext();
      });
    };

    sendNext();
  });
}

function releasePrinterHandle(handle) {
  if (!handle) {
    return;
  }

  try {
    handle.iface.release(IS_WINDOWS ? false : true, () => {
      try {
        handle.device.close();
      } catch (_) {}
    });
  } catch (_) {
    try {
      handle.device.close();
    } catch (_) {}
  }
}

function sendToPrinterUsb(buffer) {
  return new Promise((resolve, reject) => {
    let handle;

    try {
      handle = findPrinterOutEndpoint();
    } catch (err) {
      return reject(err);
    }

    transferChunked(handle.outEndpoint, buffer)
      .then(() => {
        releasePrinterHandle(handle);
        resolve();
      })
      .catch((err) => {
        releasePrinterHandle(handle);
        reject(err);
      });
  });
}

function sendToPrinterWindows(buffer, printerName) {
  const tmpFile = path.join(os.tmpdir(), `receipt-${Date.now()}.prn`);
  fs.writeFileSync(tmpFile, buffer);

  const scriptPath = path.join(__dirname, 'print-raw.ps1');

  return new Promise((resolve, reject) => {
    execFile(
      'powershell',
      [
        '-NoProfile',
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        scriptPath,
        '-PrinterName',
        printerName,
        '-FilePath',
        tmpFile,
      ],
      (err, stdout, stderr) => {
        try {
          fs.unlinkSync(tmpFile);
        } catch (_) {}

        if (err) {
          return reject(new Error(stderr?.trim() || err.message));
        }

        resolve(stdout?.trim());
      }
    );
  });
}

async function sendToPrinter(buffer) {
  if (WINDOWS_PRINTER_NAME) {
    return sendToPrinterWindows(buffer, WINDOWS_PRINTER_NAME);
  }

  return sendToPrinterUsb(buffer);
}

function line(text = '') {
  return Buffer.from(`${text}\n`, 'utf8');
}

const cmd = {
  init: Buffer.from([ESC, 0x40]),
  alignLeft: Buffer.from([ESC, 0x61, 0x00]),
  alignCenter: Buffer.from([ESC, 0x61, 0x01]),
  boldOn: Buffer.from([ESC, 0x45, 0x01]),
  boldOff: Buffer.from([ESC, 0x45, 0x00]),
  doubleHeightOn: Buffer.from([GS, 0x21, 0x01]),
  doubleHeightOff: Buffer.from([GS, 0x21, 0x00]),
  feed: (n = 1) => Buffer.from([ESC, 0x64, n]),
  cut: Buffer.from([GS, 0x56, 0x00]),
};

function buildReceipt(order) {
  const WIDTH = 42;
  const chunks = [];

  chunks.push(cmd.init);
  chunks.push(cmd.alignCenter);
  chunks.push(cmd.boldOn);
  chunks.push(line(order.shopName || 'ՄԱԳԱԶԻՆ'));
  chunks.push(cmd.boldOff);

  if (order.address) {
    chunks.push(line(String(order.address).slice(0, WIDTH)));
  }
  if (order.tin) {
    chunks.push(line(`ՀՎՀՀ: ${order.tin}`));
  }
  if (order.sn) {
    chunks.push(line(`ՍՀ: ${order.sn}`));
  }
  if (order.crn) {
    chunks.push(line(`Գ/Հ: ${order.crn}`));
  }

  chunks.push(line(new Date().toLocaleString('hy-AM')));
  chunks.push(line('-'.repeat(WIDTH)));
  chunks.push(cmd.alignLeft);

  for (const item of order.items) {
    chunks.push(line(String(item.name).slice(0, WIDTH)));
    const qtyPrice = `${item.qty} x ${Number(item.price).toFixed(2)}${item.unit ? ' ' + item.unit : ''}`;
    const sum = Number(item.total ?? item.qty * item.price).toFixed(2);
    const spaces = Math.max(1, WIDTH - qtyPrice.length - sum.length);
    chunks.push(line(qtyPrice + ' '.repeat(spaces) + sum));
  }

  chunks.push(line('-'.repeat(WIDTH)));
  chunks.push(cmd.boldOn);
  chunks.push(cmd.doubleHeightOn);
  const totalLabel = 'ԸՆԴԱՄԵՆԸ:';
  const totalValue = Number(order.total).toFixed(2);
  chunks.push(
    line(totalLabel + ' '.repeat(Math.max(1, WIDTH - totalLabel.length - totalValue.length)) + totalValue)
  );
  chunks.push(cmd.doubleHeightOff);
  chunks.push(cmd.boldOff);

  if (order.paymentMethod) {
    chunks.push(line(order.paymentMethod));
  }

  if (order.fiscal) {
    chunks.push(line(`Ֆիսկալ ${order.fiscal}`));
  }
  if (order.qr) {
    chunks.push(line(`QR: ${order.qr}`));
  }

  chunks.push(cmd.alignCenter);
  chunks.push(line(''));
  chunks.push(line('Շնորհակալություն!'));
  chunks.push(cmd.feed(3));
  chunks.push(cmd.cut);

  return Buffer.concat(chunks);
}

app.get('/health', (req, res) => {
  const device = getPrinterDevice();

  res.json({
    status: 'ok',
    printerFound: Boolean(device),
    vendorId: `0x${VENDOR_ID.toString(16)}`,
    productId: `0x${PRODUCT_ID.toString(16)}`,
    mode: WINDOWS_PRINTER_NAME ? 'windows-spooler' : 'usb',
    windowsPrinterName: WINDOWS_PRINTER_NAME || null,
  });
});

app.post('/print-receipt', async (req, res) => {
  try {
    const order = req.body;

    if (!order || !Array.isArray(order.items) || typeof order.total !== 'number') {
      return res.status(400).json({ error: 'Нужны поля: items (массив), total (число)' });
    }

    const receiptBuffer = buildReceipt(order);
    await sendToPrinter(receiptBuffer);

    res.json({ success: true });
  } catch (err) {
    const message = describeUsbError(err);
    console.error('Ошибка печати:', message);
    res.status(500).json({ success: false, error: message });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Printer service running on http://127.0.0.1:${PORT}`);
  console.log(`Looking for AXIOM printer VID=0x${VENDOR_ID.toString(16)} PID=0x${PRODUCT_ID.toString(16)}`);

  if (WINDOWS_PRINTER_NAME) {
    console.log(`Windows spooler mode: ${WINDOWS_PRINTER_NAME}`);
  } else if (IS_WINDOWS) {
    console.log('USB mode (WinUSB via Zadig). Fallback: set WINDOWS_PRINTER_NAME env var');
  }
});
