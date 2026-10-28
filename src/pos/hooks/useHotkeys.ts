import { useEffect, useRef } from "react";

export type HotkeyHandlers = {
  onSearch: () => void;
  onSale: () => void;
  onConfirm: () => void;
  onEsc: () => void;
  onPrevLine: () => void;
  onNextLine: () => void;
  onInc: () => void;
  onDec: () => void;
  onDelete: () => void;
  modalOpen: boolean;
};

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

export function useHotkeys(handlers: HotkeyHandlers, enabled = true) {
  const ref = useRef(handlers);
  ref.current = handlers;

  useEffect(() => {
    if (!enabled) return;
    const onKey = (event: KeyboardEvent) => {
      const h = ref.current;
      const typing = isTypingTarget(event.target);
      if (event.key === "Escape") {
        h.onEsc();
        return;
      }
      if (event.key === "Enter" && h.modalOpen) {
        event.preventDefault();
        h.onConfirm();
        return;
      }
      if (typing) return;
      if (event.key === "F2") {
        event.preventDefault();
        h.onSearch();
        return;
      }
      if (event.key === "F9") {
        event.preventDefault();
        h.onSale();
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        h.onPrevLine();
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        h.onNextLine();
        return;
      }
      if (event.key === "+" || event.key === "=" || event.key === "Add") {
        event.preventDefault();
        h.onInc();
        return;
      }
      if (event.key === "-" || event.key === "Subtract") {
        event.preventDefault();
        h.onDec();
        return;
      }
      if (event.key === "Delete") {
        event.preventDefault();
        h.onDelete();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled]);
}
