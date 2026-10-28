import { useRef, useState } from "react";
import styles from "../pos.module.scss";
import { formatAmd } from "../money";
import { sendReceiptSms } from "../api";
import { useFocusTrap } from "../hooks/useFocusTrap";
import type { SuccessPayload } from "../types";

export function SaleSuccessModal({
  success,
  onNewSale,
}: {
  success: SuccessPayload | null;
  onNewSale: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [phone, setPhone] = useState("");
  const [smsOpen, setSmsOpen] = useState(false);
  const [smsNote, setSmsNote] = useState("");
  useFocusTrap(Boolean(success), ref);
  if (!success) return null;

  const title = success.mode === "prepay" ? "Կանխավճարը ձևակերպված է" : "Վաճառքը կատարված է";

  return (
    <div className={styles.backdrop}>
      <div ref={ref} className={`${styles.dialog} ${styles.dialogNarrow}`} role="dialog" aria-modal="true" aria-labelledby="success-title">
        <div className={styles.successIcon} aria-hidden="true">✓</div>
        <h2 id="success-title" className={styles.h2}>{title}</h2>
        <div className={styles.meta}>Կտրոն № {success.receiptNo}</div>
        <div className={`${styles.payable} ${styles.nums}`}>{formatAmd(success.total)}</div>
        <div>{success.cash > 0 && <div>Կանխիկ {formatAmd(success.cash)}</div>}</div>
        <div>
          {success.nonCash > 0 && (
            <div>Անկանխիկ ({success.methodLabel}) {formatAmd(success.nonCash)}</div>
          )}
        </div>
        {success.debt > 0 && <div>Պարտք {formatAmd(success.debt)}</div>}
        {success.change > 0 && (
          <div className={`${styles.changeBox} ${styles.nums}`}>Մանր՝ {formatAmd(success.change)}</div>
        )}
        {smsOpen && (
          <label>
            Հեռախոս
            <input
              className={styles.textInput}
              value={phone}
              inputMode="tel"
              onChange={(event) => setPhone(event.target.value)}
            />
          </label>
        )}
        {smsNote && <div className={styles.meta}>{smsNote}</div>}
        <div className={styles.headActions} style={{ marginTop: 12 }}>
          <button
            type="button"
            className={styles.ghost}
            onClick={async () => {
              if (!smsOpen) {
                setSmsOpen(true);
                return;
              }
              const ok = await sendReceiptSms(success.receiptNo, phone);
              setSmsNote(ok ? "SMS-ը ուղարկված է" : "SMS-ը չուղարկվեց");
            }}
          >
            Ուղարկել SMS-ով
          </button>
          <button type="button" className={styles.primary} onClick={onNewSale}>
            Նոր վաճառք · Enter
          </button>
        </div>
      </div>
    </div>
  );
}
