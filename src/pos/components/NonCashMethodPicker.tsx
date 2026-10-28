import styles from "../pos.module.scss";
import type { NonCashMethod } from "../methods";

export function NonCashMethodPicker({
  methods,
  value,
  otherName,
  onChange,
  onOtherName,
}: {
  methods: NonCashMethod[];
  value: string;
  otherName: string;
  onChange: (id: string) => void;
  onOtherName: (value: string) => void;
}) {
  return (
    <div>
      <div className={styles.meta}>Ինչո՞վ է ստացվել վճարումը</div>
      <div className={styles.methods} role="radiogroup" aria-label="Ինչո՞վ է ստացվել վճարումը">
        {methods.map((method) => (
          <button
            key={method.id}
            type="button"
            role="radio"
            aria-checked={value === method.id}
            className={`${styles.methodBtn} ${value === method.id ? styles.methodActive : ""}`}
            onClick={() => onChange(method.id)}
          >
            {method.label}
          </button>
        ))}
      </div>
      {value === "other" && (
        <input
          className={styles.textInput}
          data-payment-field="true"
          aria-label="Նշեք վճարման միջոցը"
          placeholder="Նշեք վճարման միջոցը"
          value={otherName}
          onChange={(event) => onOtherName(event.target.value)}
        />
      )}
    </div>
  );
}
