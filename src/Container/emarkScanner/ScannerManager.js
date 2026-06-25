import store from "../../store";
import { setSearchBarCodeSlice } from "../../store/searchbarcode/barcodeSlice";

const SCANNER_ENABLED_KEY = "scannerEnabled";

let reader = null;
let activeInput = null;
let loop = false;
let readLoopPromise = null;
let setStatusCallback = null;
let port = null;
let fromWhere = null;
let connecting = false;

export const getInputChangeFunction = (from) => {
  fromWhere = from;
};

export function setActiveInput(inputElement, onChangeHandler) {
  activeInput = { inputElement, onChangeHandler };
}

export function isScannerEnabled() {
  return localStorage.getItem(SCANNER_ENABLED_KEY) === "true";
}

function setScannerEnabled(enabled) {
  if (enabled) {
    localStorage.setItem(SCANNER_ENABLED_KEY, "true");
  } else {
    localStorage.removeItem(SCANNER_ENABLED_KEY);
  }
}

async function startReadLoop() {
  if (!port?.readable) return;

  const decoder = new TextDecoder();
  let buffer = "";
  reader = port.readable.getReader();
  loop = true;

  try {
    while (loop) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;
      if (buffer.includes("\n") || buffer.includes("\r")) {
        const cleaned = buffer.trim();
        const activeElement = document.activeElement;
        if (activeElement && activeElement.tagName === "INPUT") {
          activeElement.value = cleaned;
          const event = new Event("input", { bubbles: true });
          activeElement.dispatchEvent(event);
          activeElement.setSelectionRange(cleaned.length, cleaned.length);
        }
        buffer = "";
        store.dispatch(
          setSearchBarCodeSlice({
            name: fromWhere,
            value: activeElement?.value,
          })
        );
      }
    }
  } catch (error) {
    if (loop) {
      console.error("Ошибка чтения со сканера:", error);
      if (setStatusCallback) setStatusCallback(false);
    }
  } finally {
    try {
      if (reader) {
        reader.releaseLock();
        reader = null;
      }
    } catch (_) {}
  }
}

async function openPort(selectedPort) {
  port = selectedPort;
  if (!port.readable) {
    await port.open({ baudRate: 9600 });
  }
  readLoopPromise = startReadLoop();
}

export async function connectScanner({ silent = false } = {}) {
  if (!("serial" in navigator)) {
    if (!silent) alert("Браузер не поддерживает Web Serial API");
    return;
  }

  if (connecting || (port && loop)) return;
  connecting = true;

  try {
    const grantedPorts = await navigator.serial.getPorts();
    let selectedPort = grantedPorts[0];

    if (!selectedPort && !silent) {
      selectedPort = await navigator.serial.requestPort();
    }

    if (!selectedPort) return;

    await openPort(selectedPort);
    setScannerEnabled(true);
    if (setStatusCallback) setStatusCallback(true);
  } catch (error) {
    setScannerEnabled(false);
    if (setStatusCallback) setStatusCallback(false);
    if (!silent) {
      alert("Ошибка подключения сканера: " + error);
    }
  } finally {
    connecting = false;
  }
}

export async function restoreScannerIfEnabled() {
  if (!isScannerEnabled()) return;
  if (port && loop) return;
  await connectScanner({ silent: true });
}

export async function disconnectScanner() {
  loop = false;
  setScannerEnabled(false);

  try {
    if (reader) {
      await reader.cancel();
      await reader.releaseLock();
      reader = null;
    }
    if (readLoopPromise) {
      await readLoopPromise.catch(() => {});
      readLoopPromise = null;
    }
    if (port) {
      await port.close();
      port = null;
    }
    if (setStatusCallback) setStatusCallback(false);
  } catch (err) {
    if (setStatusCallback) setStatusCallback(false);
    console.error("Ошибка отключения сканера:", err);
  }
}
