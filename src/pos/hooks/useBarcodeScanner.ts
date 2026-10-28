import { useEffect, useRef } from "react";
import { SCAN_GAP_MS } from "../parseScan";

function isPaymentField(target: EventTarget | null) {
  return target instanceof HTMLElement && target.dataset.paymentField === "true";
}

function isScanInput(target: EventTarget | null) {
  return target instanceof HTMLElement && target.dataset.scanInput === "true";
}

/**
 * Keyboard-wedge scanners type a burst faster than 30ms per key and finish with Enter.
 * Ignored while a payment field is focused, and ignored when the scan input itself
 * already owns the keystrokes.
 */
export function useBarcodeScanner(onScan: (code: string) => void, enabled = true) {
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  useEffect(() => {
    if (!enabled) return;
    let buffer = "";
    let last = 0;
    const gaps: number[] = [];

    const reset = () => {
      buffer = "";
      gaps.length = 0;
      last = 0;
    };

    const onKey = (event: KeyboardEvent) => {
      if (isPaymentField(event.target) || isScanInput(event.target)) {
        reset();
        return;
      }
      if (event.key === "Enter") {
        const fast = buffer.length >= 4 && gaps.length > 0 && gaps.every((gap) => gap < SCAN_GAP_MS);
        const enterGap = last ? Date.now() - last : 999;
        if (fast && enterGap < SCAN_GAP_MS) {
          event.preventDefault();
          event.stopPropagation();
          const code = buffer;
          reset();
          onScanRef.current(code);
        } else {
          reset();
        }
        return;
      }
      if (event.key.length !== 1 || event.ctrlKey || event.altKey || event.metaKey) return;
      const now = Date.now();
      if (buffer && now - last >= SCAN_GAP_MS) {
        buffer = "";
        gaps.length = 0;
      }
      if (buffer) gaps.push(now - last);
      buffer += event.key;
      last = now;
      if (buffer.length > 1 && gaps.every((gap) => gap < SCAN_GAP_MS)) {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [enabled]);
}
