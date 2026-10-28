import type { RefObject } from "react";
import styles from "../pos.module.scss";

export function ScanInput({
  inputRef,
  value,
  onChange,
  onSubmit,
}: {
  inputRef: RefObject<HTMLInputElement>;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <input
      ref={inputRef}
      className={styles.scanInput}
      data-scan-input="true"
      value={value}
      autoFocus
      placeholder="Շտրիխ-կոդ, ներքին կոդ կամ անուն"
      aria-label="Շտրիխ-կոդ, ներքին կոդ կամ անուն"
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          onSubmit();
        }
      }}
    />
  );
}
