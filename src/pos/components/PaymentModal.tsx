import { useRef } from "react";
import styles from "../pos.module.scss";
import { formatAmd } from "../money";
import { usePayment } from "../hooks/usePayment";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { AmountField } from "./AmountField";
import { NonCashMethodPicker } from "./NonCashMethodPicker";
import { Numpad } from "./Numpad";
import { PaymentStatus } from "./PaymentStatus";

const QUICK = [1000, 5000, 10000, 20000];

export function PaymentModal({ onConfirm }: { onConfirm: () => void }) {
  const pay = usePayment();
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(pay.payment.open, ref);
  if (!pay.payment.open) return null;

  const quick = QUICK.filter((amount) => amount > pay.result.remaining);
  const caption =
    pay.payment.activeField === "cash"
      ? "Ստեղնաշարը լրացնում է՝ Կանխիկ"
      : "Ստեղնաշարը լրացնում է՝ Անկանխիկ";

  return (
    <div className={styles.backdrop}>
      <div
        ref={ref}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pay-title"
      >
        <h2 id="pay-title" className={styles.h2}>
          {pay.payment.mode === "prepay" ? "Կանխավճար" : "Վաճառք"}
        </h2>
        <div className={styles.payGrid}>
          <div>
            <div className={styles.dueLabel}>
              {pay.payment.mode === "prepay" ? "Պատվերի գումար" : "Վճարման ենթակա"}
            </div>
            <div className={`${styles.dueValue} ${styles.nums}`}>{formatAmd(pay.total)}</div>
            <AmountField
              id="cash-amount"
              label="Կանխիկ"
              value={pay.payment.cash}
              active={pay.payment.activeField === "cash"}
              onFocus={() => pay.setActiveField("cash")}
              onChange={pay.setCash}
              onRemainder={() => pay.fillRemainder("cash")}
              quick={quick}
              onQuick={pay.setQuick}
            />
            <AmountField
              id="card-amount"
              label="Անկանխիկ"
              value={pay.payment.nonCash}
              active={pay.payment.activeField === "nonCash"}
              onFocus={() => pay.setActiveField("nonCash")}
              onChange={pay.setNonCash}
              onRemainder={() => pay.fillRemainder("nonCash")}
            />
            <NonCashMethodPicker
              methods={pay.methods}
              value={pay.payment.method}
              otherName={pay.payment.otherName}
              onChange={pay.setMethod}
              onOtherName={pay.setOtherName}
            />
            <PaymentStatus kind={pay.status.kind} amount={pay.status.amount} />
            {pay.result.errors.map((error) => (
              <div key={error} className={styles.formError}>{error}</div>
            ))}
            {pay.payment.formError && <div className={styles.formError}>{pay.payment.formError}</div>}
          </div>
          <div>
            <Numpad caption={caption} onDigit={pay.appendDigit} onBackspace={pay.backspace} />
            <button
              type="button"
              className={`${pay.payment.mode === "prepay" ? styles.orangeBtn : styles.primary} ${styles.confirm}`}
              disabled={!pay.result.canConfirm || pay.payment.submitting}
              onClick={onConfirm}
            >
              {pay.payment.mode === "prepay" ? "Ձևակերպել կանխավճար · Enter" : "Վաճառք · Enter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
