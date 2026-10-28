import { useEffect, useMemo, useState } from "react";
import styles from "../pos.module.scss";
import { formatAmd, formatQty, roundQty, toAmd } from "../money";
import { roundLineTotal } from "../money";
import {
  findReceipt,
  loadReceiptForReturn,
  loadRecentReceipts,
  submitReturn,
  verifyAdminCredentials,
} from "../api";

type ReceiptRow = {
  id: number | string;
  number: string;
  when: string;
  method: string;
  total: number;
  cash: number;
  card: number;
  raw: any;
};

type ReturnLine = {
  recieptId: number | string;
  name: string;
  purchased: number;
  qty: number;
  price: number;
  checked: boolean;
};

const REASONS = [
  "Հաճախորդը հրաժարվեց",
  "Խոտան / վնասված ապրանք",
  "Սխալ ապրանք էր խփված",
  "Այլ",
];

function methodName(cash: number, card: number) {
  if (cash > 0 && card > 0) return "Կանխիկ + Անկանխիկ";
  if (card > 0) return "Անկանխիկ";
  return "Կանխիկ";
}

function toRow(item: any): ReceiptRow | null {
  if (!item) return null;
  const id = item.id ?? item.saleDetailId;
  if (id == null) return null;
  const cash = toAmd(item.cashAmount);
  const card = toAmd(item.cardAmount);
  const date = item.date ? new Date(item.date) : null;
  const when = date && !Number.isNaN(date.getTime())
    ? `${date.toLocaleDateString("hy-AM")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
    : "";
  return {
    id,
    number: String(item.recieptId || item.receiptId || id),
    when,
    method: methodName(cash, card),
    total: toAmd(item.total ?? item.totalAmount),
    cash,
    card,
    raw: item,
  };
}

function linesFrom(data: any): ReturnLine[] {
  const products = data?.products || data?.items || [];
  if (!Array.isArray(products)) return [];
  return products.map((item: any) => ({
    recieptId: item.recieptId ?? item.receiptId ?? item.id,
    name: item.name || item.goodName || "",
    purchased: Number(item.count ?? item.quantity ?? 0),
    qty: Number(item.count ?? item.quantity ?? 0),
    price: toAmd(item.discountedPrice ?? item.price),
    checked: false,
  }));
}

export function ReturnsPage({ canReverse }: { canReverse: boolean }) {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<ReceiptRow[]>([]);
  const [selected, setSelected] = useState<ReceiptRow | null>(null);
  const [lines, setLines] = useState<ReturnLine[]>([]);
  const [reason, setReason] = useState("");
  const [refundTo, setRefundTo] = useState<"cash" | "card">("cash");
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [pinOpen, setPinOpen] = useState(false);
  const [pinUser, setPinUser] = useState("");
  const [pin, setPin] = useState("");

  useEffect(() => {
    loadRecentReceipts().then((rows: any[]) => {
      const mapped: Array<ReceiptRow | null> = rows.map((row: any) => toRow(row));
      setRecent(mapped.filter((row): row is ReceiptRow => row != null));
    }).catch(() => setRecent([]));
  }, []);

  const refund = useMemo(
    () => lines.reduce((sum, line) => (line.checked ? sum + roundLineTotal(line.price, line.qty) : sum), 0),
    [lines]
  );

  const choose = async (row: ReceiptRow) => {
    setSelected(row);
    setDone("");
    setError("");
    setRefundTo(row.card > 0 && row.cash === 0 ? "card" : "cash");
    const detail = await loadReceiptForReturn(row.id);
    setLines(linesFrom(detail || row.raw));
  };

  const search = async () => {
    const found = await findReceipt(query.trim());
    const row = toRow(found);
    if (!row) {
      setError(`Կոդը «${query.trim()}» չի գտնվել`);
      return;
    }
    setRecent((prev) => [row, ...prev.filter((item) => item.id !== row.id)]);
    choose(row);
  };

  const setLine = (index: number, patch: Partial<ReturnLine>) => {
    setLines((prev) => prev.map((line, i) => (i === index ? { ...line, ...patch } : line)));
  };

  const perform = async () => {
    if (!selected || refund <= 0) return;
    if (!reason) {
      setError("Ընտրեք վերադարձի պատճառը");
      return;
    }
    const products = lines
      .filter((line) => line.checked && line.qty > 0)
      .map((line) => ({ recieptId: line.recieptId, quantity: line.qty }));
    const res = await submitReturn({
      saleDetailId: selected.id,
      products,
      cashAmount: refundTo === "cash" ? refund : 0,
      cardAmount: refundTo === "card" ? refund : 0,
      emarks: [],
    });
    if (!res.ok) {
      setError(res.message);
      return;
    }
    setDone("Վերադարձը կատարված է");
    setLines([]);
    setSelected(null);
  };

  const ask = () => {
    if (!canReverse) {
      setPinOpen(true);
      return;
    }
    perform();
  };

  return (
    <div className={styles.returns}>
      <section className={styles.returnCol} aria-label="Գտնել կտրոնը">
        <h2 className={styles.h2}>Գտնել կտրոնը</h2>
        <input
          className={styles.scanInput}
          placeholder="Կտրոնի համար կամ QR"
          aria-label="Կտրոնի համար կամ QR"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") search();
          }}
        />
        <div className={styles.returnList}>
          {recent.map((row) => (
            <button
              key={String(row.id)}
              type="button"
              className={`${styles.receiptBtn} ${selected?.id === row.id ? styles.receiptBtnActive : ""}`}
              onClick={() => choose(row)}
            >
              <strong>№ {row.number}</strong>
              <div className={styles.meta}>{row.when} · {row.method}</div>
              <div className={styles.nums}>{formatAmd(row.total)}</div>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.returnCol} aria-label="Ընտրել վերադարձվող ապրանքները">
        <h2 className={styles.h2}>Ընտրել վերադարձվող ապրանքները</h2>
        {selected && (
          <div className={styles.meta}>Կտրոն № {selected.number} · {selected.when} · {formatAmd(selected.total)}</div>
        )}
        <button
          type="button"
          className={styles.ghost}
          onClick={() => setLines((prev) => prev.map((line) => ({ ...line, checked: true, qty: line.purchased })))}
        >
          Ընտրել բոլորը
        </button>
        <div className={styles.returnItems}>
          {lines.map((line, index) => (
            <div key={String(line.recieptId)} className={styles.checkRow}>
              <input
                type="checkbox"
                aria-label={line.name}
                checked={line.checked}
                onChange={(event) => setLine(index, { checked: event.target.checked })}
              />
              <div>
                <div>{line.name}</div>
                <div className={styles.meta}>{formatAmd(line.price)} · գնված {formatQty(line.purchased)}</div>
              </div>
              <div className={styles.qty}>
                <button
                  type="button"
                  aria-label="Պակասեցնել"
                  onClick={() => setLine(index, { qty: roundQty(Math.max(0, line.qty - 1)) })}
                >−</button>
                <input
                  aria-label="Քանակ"
                  value={formatQty(line.qty)}
                  onChange={(event) => {
                    const next = Number(event.target.value.replace(",", "."));
                    if (!Number.isFinite(next)) return;
                    setLine(index, { qty: Math.min(line.purchased, Math.max(0, next)) });
                  }}
                />
                <button
                  type="button"
                  aria-label="Ավելացնել"
                  onClick={() => setLine(index, { qty: Math.min(line.purchased, roundQty(line.qty + 1)) })}
                >+</button>
              </div>
            </div>
          ))}
        </div>
        <label htmlFor="return-reason">Վերադարձի պատճառը</label>
        <select id="return-reason" className={styles.select} value={reason} onChange={(event) => setReason(event.target.value)}>
          <option value="">—</option>
          {REASONS.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </section>

      <section className={styles.returnCol} aria-label="Հաստատել գումարը">
        <h2 className={styles.h2}>Հաստատել գումարը</h2>
        <div className={`${styles.payable} ${styles.nums}`}>{formatAmd(refund)}</div>
        <div className={styles.meta}>Գումարը հաշվարկվում է ընտրված ապրանքներից</div>
        <div className={styles.methods}>
          <button type="button" className={`${styles.methodBtn} ${refundTo === "cash" ? styles.methodActive : ""}`} onClick={() => setRefundTo("cash")}>Կանխիկ</button>
          <button type="button" className={`${styles.methodBtn} ${refundTo === "card" ? styles.methodActive : ""}`} onClick={() => setRefundTo("card")}>Քարտին</button>
        </div>
        {error && <div className={styles.formError} role="alert">{error}</div>}
        {done && <div className={styles.statusPaid}>{done}</div>}
        <button type="button" className={styles.primary} disabled={refund <= 0} onClick={ask}>
          Կատարել վերադարձը · {formatAmd(refund)}
        </button>
      </section>

      {pinOpen && (
        <div className={styles.backdrop}>
          <div className={`${styles.dialog} ${styles.dialogNarrow}`} role="dialog" aria-modal="true" aria-labelledby="pin-title">
            <h2 id="pin-title" className={styles.h2}>ԷՀԴՄ վերադարձի թույլտվություն</h2>
            <p className={styles.meta}>Ադմինիստրատորի PIN</p>
            <input className={styles.textInput} aria-label="Ադմինիստրատոր" placeholder="Ադմինիստրատոր" value={pinUser} onChange={(event) => setPinUser(event.target.value)} />
            <input className={styles.textInput} aria-label="PIN" placeholder="PIN" type="password" value={pin} onChange={(event) => setPin(event.target.value)} />
            <div className={styles.headActions} style={{ marginTop: 10 }}>
              <button type="button" className={styles.ghost} onClick={() => setPinOpen(false)}>Փակել</button>
              <button
                type="button"
                className={styles.primary}
                onClick={async () => {
                  const ok = await verifyAdminCredentials(pinUser, pin);
                  if (!ok) {
                    setError("Սխալ PIN");
                    return;
                  }
                  setPinOpen(false);
                  perform();
                }}
              >
                Հաստատել
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
