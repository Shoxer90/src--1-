import styles from "../pos.module.scss";
import { formatAmd } from "../money";

export function AmountField({
  id,
  label,
  value,
  active,
  onFocus,
  onChange,
  onRemainder,
  quick,
  onQuick,
}: {
  id: string;
  label: string;
  value: string;
  active: boolean;
  onFocus: () => void;
  onChange: (value: string) => void;
  onRemainder: () => void;
  quick?: number[];
  onQuick?: (amount: number) => void;
}) {
  return (
    <div className={`${styles.payBox} ${active ? styles.payBoxActive : ""}`}>
      <div className={styles.fieldHead}>
        <label htmlFor={id}>{label}</label>
        <button type="button" className={styles.ghost} onClick={onRemainder}>Մնացորդը</button>
      </div>
      <input
        id={id}
        className={`${styles.amountInput} ${styles.nums}`}
        data-payment-field="true"
        inputMode="numeric"
        value={value}
        onFocus={onFocus}
        onChange={(event) => onChange(event.target.value.replace(/[^\d]/g, ""))}
      />
      {!!quick?.length && onQuick && (
        <div className={styles.quick}>
          {quick.map((amount) => (
            <button key={amount} type="button" onClick={() => onQuick(amount)}>
              {formatAmd(amount).replace(" դր", "")}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
