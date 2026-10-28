import styles from "../pos.module.scss";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "⌫"];

export function Numpad({
  caption,
  onDigit,
  onBackspace,
}: {
  caption: string;
  onDigit: (digit: string) => void;
  onBackspace: () => void;
}) {
  return (
    <div>
      <div className={styles.numpadCaption}>{caption}</div>
      <div className={styles.numpad}>
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => (key === "⌫" ? onBackspace() : onDigit(key))}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
