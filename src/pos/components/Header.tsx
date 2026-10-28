import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../pos.module.scss";
import { loadOpenPrepaymentCount } from "../api";
import { updateMethods, usePos } from "../PosContext";
import { DEFAULT_NON_CASH_METHODS, type NonCashMethod } from "../methods";

function shiftLabel() {
  const key = "storex.pos.shiftStart";
  const today = new Date().toISOString().slice(0, 10);
  const saved = localStorage.getItem(key);
  let date = saved ? new Date(saved) : null;
  if (!date || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== today) {
    date = new Date();
    localStorage.setItem(key, date.toISOString());
  }
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function Header({
  user,
  isAdmin,
  onLogout,
  page,
}: {
  user: any;
  isAdmin: boolean;
  onLogout: () => void;
  page: "sale" | "returns" | "prepay" | "receipts";
}) {
  const navigate = useNavigate();
  const pos = usePos();
  const [count, setCount] = useState(0);
  const [menu, setMenu] = useState(false);
  const [draft, setDraft] = useState<NonCashMethod[]>(pos.state.ui.methods);
  const org = user?.legalName || user?.name || "";
  const cashier = [user?.firstname, user?.lastname].filter(Boolean).join(" ") || user?.userName || "";
  const ehdm = Boolean(user?.isEhdmStatus ?? user?.ehdmStatus);

  useEffect(() => {
    loadOpenPrepaymentCount().then(setCount).catch(() => setCount(0));
  }, [page]);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/0001.jpg" alt="StoreX" />
      </div>
      <nav className={styles.nav} aria-label="Հիմնական">
        <button type="button" className={`${styles.navBtn} ${page === "sale" ? styles.navBtnActive : ""}`} onClick={() => navigate("/")}>
          Վաճառք
        </button>
        <button type="button" className={`${styles.navBtn} ${page === "returns" ? styles.navBtnActive : ""}`} onClick={() => navigate("/returns")}>
          Վերադարձ
        </button>
        <button type="button" className={`${styles.navBtn} ${page === "prepay" ? styles.navBtnActive : ""}`} onClick={() => navigate("/prepayment?page=1")}>
          Կանխավճարներ
          {count > 0 && <span className={styles.badge}>{count}</span>}
        </button>
        <button type="button" className={`${styles.navBtn} ${page === "receipts" ? styles.navBtnActive : ""}`} onClick={() => navigate("/history?status=Paid&page=1")}>
          Կտրոններ
        </button>
      </nav>
      <div className={styles.headerRight}>
        <div className={styles.shift}>Հերթափոխը բաց է՝ {shiftLabel()}-ից</div>
        <div className={styles.org}>
          <span>{org}</span>
          {ehdm && <span className={styles.ehdm}>ԷՀԴՄ</span>}
        </div>
        <button type="button" className={styles.cashierBtn} aria-expanded={menu} onClick={() => setMenu((v) => !v)}>
          {cashier}
        </button>
      </div>
      {menu && (
        <div className={styles.menu} role="menu">
          {isAdmin && (
            <button type="button" onClick={() => navigate("/prods")}>Ապրանքի կառավարում</button>
          )}
          {isAdmin && (
            <button type="button" onClick={() => { setDraft(pos.state.ui.methods); pos.dispatch({ type: "ui", ui: { methodsOpen: true } }); setMenu(false); }}>
              Վճարման միջոցներ
            </button>
          )}
          <button type="button" onClick={onLogout}>Ելք</button>
        </div>
      )}
      {pos.state.ui.methodsOpen && isAdmin && (
        <div className={styles.backdrop} role="presentation">
          <div className={`${styles.dialog} ${styles.dialogNarrow}`} role="dialog" aria-modal="true" aria-labelledby="methods-title">
            <h2 id="methods-title" className={styles.h2}>Վճարման միջոցներ</h2>
            {draft.filter((item) => item.id !== "other").map((item, index) => (
              <input
                key={item.id}
                className={styles.textInput}
                aria-label={item.label}
                value={item.label}
                onChange={(event) => {
                  const next = draft.slice();
                  next[index] = { ...item, label: event.target.value };
                  setDraft(next);
                }}
              />
            ))}
            <div className={styles.headActions} style={{ marginTop: 10 }}>
              <button type="button" className={styles.ghost} onClick={() => setDraft(DEFAULT_NON_CASH_METHODS)}>Վերականգնել</button>
              <button type="button" className={styles.primary} onClick={() => updateMethods(pos.dispatch, draft)}>Պահպանել</button>
              <button type="button" className={styles.ghost} onClick={() => pos.dispatch({ type: "ui", ui: { methodsOpen: false } })}>Փակել</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
