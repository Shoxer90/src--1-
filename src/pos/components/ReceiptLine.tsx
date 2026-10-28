import styles from "../pos.module.scss";
import { formatAmd, formatQty, roundQty } from "../money";
import { lineAmounts, qtyStep, unitLabel } from "../cartMath";
import type { CartLine } from "../types";
import { Photo } from "./Photo";

export function ReceiptLine({
  line,
  selected,
  onSelect,
  onQty,
  onRemove,
}: {
  line: CartLine;
  selected: boolean;
  onSelect: () => void;
  onQty: (qty: number) => void;
  onRemove: () => void;
}) {
  const amounts = lineAmounts({
    price: line.product.price,
    discountedPrice: line.product.discountedPrice,
    qty: line.qty,
  });
  const step = qtyStep(line.product.measure);
  return (
    <div
      className={`${styles.line} ${selected ? styles.lineSelected : ""}`}
      onClick={onSelect}
    >
      <Photo src={line.product.photo} className={styles.lineImg} alt="" />
      <div>
        <div className={styles.lineTop}>
          <span className={styles.lineName}>{line.product.name}</span>
          <span className={`${styles.nums} ${styles.price}`}>{formatAmd(amounts.payTotal)}</span>
        </div>
        <div className={styles.meta}>
          {formatAmd(line.product.discountedPrice)} / {unitLabel(line.product.measure)} · Կոդ {line.product.innerCode || line.product.barCode || "—"}
        </div>
        {line.product.isEmark && (
          <div className={styles.meta}>e-Mark՝ սկանավորված {line.emarks.length} / {formatQty(line.qty)}</div>
        )}
        <div className={styles.lineActions}>
          <div className={styles.qty}>
            <button type="button" aria-label="Պակասեցնել" onClick={() => onQty(roundQty(line.qty - step))}>−</button>
            <input
              aria-label="Քանակ"
              value={formatQty(line.qty)}
              onChange={(event) => {
                const next = Number(event.target.value.replace(",", "."));
                if (Number.isFinite(next)) onQty(next);
              }}
            />
            <button type="button" aria-label="Ավելացնել" onClick={() => onQty(roundQty(line.qty + step))}>+</button>
          </div>
          <button type="button" className={styles.iconBtn} aria-label="Ջնջել" onClick={onRemove}>✕</button>
        </div>
      </div>
    </div>
  );
}
