import styles from "../pos.module.scss";
import { formatQty } from "../money";
import { ReceiptLine } from "./ReceiptLine";
import { Totals } from "./Totals";
import { useCart } from "../hooks/useCart";
import { usePayment } from "../hooks/usePayment";

export function ReceiptPanel() {
  const cart = useCart();
  const pay = usePayment();
  const empty = cart.lines.length === 0;

  return (
    <aside className={styles.receipt} aria-label="Ընթացիկ վաճառք">
      <div className={styles.receiptHead}>
        <div className={styles.headTop}>
          <strong>Ընթացիկ վաճառք</strong>
          <span className={styles.nums}>№ {cart.draftNo}</span>
        </div>
        <div className={styles.headTop}>
          <span className={styles.muted}>{formatQty(cart.totals.itemCount)}</span>
          <div className={styles.headActions}>
            <button type="button" className={styles.ghost} onClick={cart.parkCart} disabled={empty}>Պահել</button>
            <button type="button" className={styles.ghost} onClick={cart.clearCart} disabled={empty}>Մաքրել</button>
          </div>
        </div>
        {!!cart.parked.length && empty && (
          <div className={styles.parked}>
            {cart.parked.map((sale) => (
              <button key={sale.id} type="button" onClick={() => cart.resumeParked(sale.id)}>
                Պահված № {sale.draftNo}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className={styles.lines}>
        {cart.lines.map((line, index) => (
          <ReceiptLine
            key={line.product.id}
            line={line}
            selected={index === cart.selected}
            onSelect={() => cart.selectLine(index)}
            onQty={(qty) => cart.setQty(line.product.id, qty)}
            onRemove={() => cart.removeLine(line.product.id)}
          />
        ))}
      </div>
      <Totals totals={cart.totals} />
      <div className={styles.receiptFoot}>
        <button type="button" className={styles.orangeBtn} disabled={empty} onClick={() => pay.open("prepay")}>
          Կանխավճար
        </button>
        <button type="button" className={styles.primary} disabled={empty} onClick={() => pay.open("sale")}>
          Վաճառք · F9
        </button>
      </div>
    </aside>
  );
}
