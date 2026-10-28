import styles from "../pos.module.scss";
import type { PosView } from "../types";

const OPTIONS: { id: PosView; label: string }[] = [
  { id: "cards", label: "Քարտեր" },
  { id: "list", label: "Ցանկ" },
  { id: "scanner", label: "Սկաներ" },
];

export function ViewToggle({ value, onChange }: { value: PosView; onChange: (view: PosView) => void }) {
  return (
    <div className={styles.toggle} role="group" aria-label="Տեսք">
      {OPTIONS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={value === item.id ? styles.toggleActive : undefined}
          aria-pressed={value === item.id}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
