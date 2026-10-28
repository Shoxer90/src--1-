import styles from "../pos.module.scss";
import { formatAmd } from "../money";
import type { CartTotals } from "../cartMath";

export function Totals({ totals }: { totals: CartTotals }) {
  return (
    <div className={styles.totals}>
      <div className={styles.totalRow}>
        <span>Միջանկյալ գումար</span>
        <span className={styles.nums}>{formatAmd(totals.subtotal)}</span>
      </div>
      <div className={styles.totalRow}>
        <span>Զեղչ</span>
        <span className={styles.nums}>{formatAmd(totals.discount)}</span>
      </div>
      <div className={styles.totalRow}>
        <span>որից ԱԱՀ (20%)</span>
        <span className={styles.nums}>{formatAmd(totals.vat)}</span>
      </div>
      <div className={styles.totalRow}>
        <span>Վճարման ենթակա</span>
        <span className={`${styles.payable} ${styles.nums}`}>{formatAmd(totals.payable)}</span>
      </div>
    </div>
  );
}
