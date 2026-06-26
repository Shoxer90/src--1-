# Термопринтер AXIOM S10 (USB)

Локальный сервис печати чеков через ESC/POS для режима **ehdmMode === 2** (физический HDM).

## Архитектура

```
React (продажа) → responseTreatment → printSaleReceipt()
                                    → HTTP POST http://127.0.0.1:3001/print-receipt
                                    → Node.js сервис → USB (WinUSB/Zadig) → AXIOM S10
```

## Подготовка принтера (Windows)

1. Подключите AXIOM S10 по USB.
2. Установите [Zadig](https://zadig.akeo.ie/) и выберите принтер (Printer-80 / AXIOM S10).
3. Установите драйвер **WinUSB** (VID `1FC9`, PID `2016`).
4. Переподключите USB-кабель.

## Запуск

В отдельном терминале (оставьте открытым):

```powershell
cd D:\shoxer\src--1-
npm run printer
```

Проверка: откройте http://127.0.0.1:3001/health — должно быть `"printerFound": true`.

## Альтернатива: Windows-принтер

Если USB через libusb не работает, используйте стандартный драйвер Windows:

```powershell
set WINDOWS_PRINTER_NAME=Printer-80
npm run printer
```

Имя принтера возьмите из «Устройства и принтеры».

## Устранение неполадок

- **ERR_CONNECTION_REFUSED** — сервис не запущен. Выполните `npm run printer`.
- **LIBUSB_ERROR_NOT_SUPPORTED** — переустановите WinUSB в Zadig и переподключите USB.
- **LIBUSB_ERROR_ACCESS** — запустите терминал от имени администратора.

## Порт 3001

HTTP-порт сервиса — **3001**. «80» в названии Printer-80 — ширина ленты **80 мм**, не HTTP-порт.
