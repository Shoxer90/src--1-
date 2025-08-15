import store from "../../store";
import { setSearchBarCodeSlice } from "../../store/searchbarcode/barcodeSlice";

let reader = null;
let activeInput = null;
let loop = true;
let setStatusCallback =null;
let port = null;
let fromWhere = null;
export const getInputChangeFunction = (from) => {
  fromWhere = from
}

export function setActiveInput(inputElement, onChangeHandler) {activeInput = {inputElement, onChangeHandler}}

export async function connectScanner() {
  //  const devices = await navigator.usb.getDevices();

  try {

    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    reader = port.readable.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    loop = true;

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
          activeElement.dispatchEvent(event)
          activeElement.setSelectionRange(cleaned.length, cleaned.length);
        }
        buffer = "";
        store.dispatch(setSearchBarCodeSlice({
          name: fromWhere,
          value: activeElement?.value
        }))
      }
    }

    reader.releaseLock();
  } catch (error) {
    if (setStatusCallback) setStatusCallback(false);
    alert("Ошибка подключения сканера: " + error);
  }
}

export async function disconnectScanner() {


  loop = false;
  try {
    if (reader) {
      await reader.cancel();
      await reader.releaseLock();
    }
    if (port) {
      await port.close();
    }
  } catch (err) {
    if (setStatusCallback) setStatusCallback(false);
    console.error("Ошибка отключения сканера:", err);
  }
}
