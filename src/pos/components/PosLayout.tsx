import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment";
import styles from "../pos.module.scss";
import { qtyStep } from "../cartMath";
import { useCart } from "../hooks/useCart";
import { usePayment } from "../hooks/usePayment";
import { useHotkeys } from "../hooks/useHotkeys";
import { useBarcodeScanner } from "../hooks/useBarcodeScanner";
import { usePos, bumpDraft } from "../PosContext";
import { ProductPanel } from "./ProductPanel";
import { ReceiptPanel } from "./ReceiptPanel";
import { PaymentModal } from "./PaymentModal";
import { SaleSuccessModal } from "./SaleSuccessModal";
import { ReturnsPage } from "./ReturnsPage";
import Receipt from "../../Container2/historyPage/newHdm/receipt";
import { taxCounting } from "../../modules/modules";
import type { PosProduct } from "../types";

export function PosLayout({
  user,
  isAdmin,
  canReverse,
  onScan,
  onConfirm,
  measure,
}: {
  user: any;
  isAdmin?: boolean;
  canReverse: boolean;
  onLogout?: () => void;
  onScan: (raw: string) => void;
  onConfirm: () => void;
  measure?: unknown[];
}) {
  const location = useLocation();
  const page = location.pathname.startsWith("/returns")
    ? "returns"
    : location.pathname.startsWith("/prepayment")
      ? "prepay"
      : location.pathname.startsWith("/history")
        ? "receipts"
        : "sale";
  const scanRef = useRef<HTMLInputElement>(null);
  const cart = useCart();
  const pay = usePayment();
  const pos = usePos();

  useEffect(() => {
    document.documentElement.classList.add("pos-lock");
    return () => document.documentElement.classList.remove("pos-lock");
  }, []);

  useEffect(() => {
    if (page === "sale") scanRef.current?.focus();
  }, [page]);

  useBarcodeScanner((code) => {
    onScan(code);
    scanRef.current?.focus();
  }, page === "sale" && !pay.payment.open && !pos.state.ui.success);

  useHotkeys(
    {
      modalOpen: pay.payment.open || Boolean(pos.state.ui.success),
      onSearch: () => scanRef.current?.focus(),
      onSale: () => pay.open("sale"),
      onConfirm: () => {
        if (pay.payment.open) onConfirm();
        else if (pos.state.ui.success) {
          pos.finishSale();
          scanRef.current?.focus();
        }
      },
      onEsc: () => {
        if (pay.payment.open) pay.close();
        else if (pos.state.ui.success) {
          const saleData = pos.state.ui.success.saleData;
          pos.clearCart();
          pos.dispatch({ type: "cart", cart: { draftNo: bumpDraft() } });
          pos.dispatch({
            type: "ui",
            ui: { success: null, fiscalOpen: true, fiscalSale: saleData },
          });
        } else if (pos.state.ui.fiscalOpen) {
          pos.dispatch({ type: "ui", ui: { fiscalOpen: false } });
        } else if (pos.state.ui.methodsOpen) {
          pos.dispatch({ type: "ui", ui: { methodsOpen: false } });
        }
      },
      onPrevLine: () => cart.moveSelected(-1),
      onNextLine: () => cart.moveSelected(1),
      onInc: () => cart.stepSelected(1),
      onDec: () => cart.stepSelected(-1),
      onDelete: () => {
        const line = cart.lines[cart.selected];
        if (line) cart.removeLine(line.product.id);
      },
    },
    page === "sale"
  );

  const addOne = (product: PosProduct) => {
    pos.addProduct(product, qtyStep(product.measure) === 0.1 ? 1 : 1);
    pos.dispatch({ type: "ui", ui: { query: "" } });
    scanRef.current?.focus();
  };

  const fiscal = pos.state.ui.fiscalSale as any;
  const tax = fiscal?.res?.printResponseInfo?.items
    ? taxCounting(fiscal.res.printResponseInfo.items)
    : 0;

  return (
    <div className={styles.pos}>
      {page === "returns" ? (
        <ReturnsPage canReverse={canReverse} />
      ) : (
        <div className={styles.main}>
          <ProductPanel
            scanRef={scanRef}
            onAdd={addOne}
            onScan={onScan}
            isAdmin={isAdmin}
            measure={measure}
          />
          <ReceiptPanel />
        </div>
      )}
      <PaymentModal onConfirm={onConfirm} />
      <SaleSuccessModal
        success={pos.state.ui.success}
        onNewSale={() => {
          pos.finishSale();
          scanRef.current?.focus();
        }}
      />
      {pos.state.ui.fiscalOpen && fiscal && (
        <Receipt
          openHDM
          setOpenHDM={() => pos.dispatch({ type: "ui", ui: { fiscalOpen: false } })}
          saleData={fiscal}
          taxCount={tax}
          date={moment(fiscal?.res?.printResponse?.time).format()}
          totalPrice={pos.totals.payable}
          userName={[user?.firstname, user?.lastname].filter(Boolean).join(" ")}
        />
      )}
    </div>
  );
}
