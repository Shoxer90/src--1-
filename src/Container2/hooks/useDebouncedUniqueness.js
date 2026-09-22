import { useEffect, useRef } from "react";
import useDebonce from "./useDebonce";

const useDebouncedUniqueness = (value, checkFn, { delay = 500, skip, onResult } = {}) => {
  const trimmed = String(value ?? "").trim();
  const debounced = useDebonce(trimmed, delay);
  const onResultRef = useRef(onResult);
  const skipRef = useRef(skip);
  onResultRef.current = onResult;
  skipRef.current = skip;

  useEffect(() => {
    if (!debounced) return;
    if (skipRef.current?.(debounced)) {
      onResultRef.current?.(true);
      return;
    }

    let cancelled = false;
    checkFn(debounced).then((res) => {
      if (cancelled) return;
      onResultRef.current?.(res);
    });

    return () => {
      cancelled = true;
    };
  }, [debounced, checkFn]);
};

export default useDebouncedUniqueness;
