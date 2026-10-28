import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(active: boolean, ref: RefObject<HTMLElement>) {
  const previous = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    previous.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const root = ref.current;
    if (!root) return;

    const items = () =>
      Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1
      );

    const timer = window.setTimeout(() => items()[0]?.focus(), 0);

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const list = items();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    root.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      root.removeEventListener("keydown", onKey);
      previous.current?.focus?.();
    };
  }, [active, ref]);
}
