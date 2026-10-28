import { useCallback } from "react";
import { PosProvider, usePos } from "./PosContext";
import { PosLayout } from "./components/PosLayout";
import { usePayment } from "./hooks/usePayment";
import { parseScan } from "./parseScan";
import { findExactProduct, submitSale } from "./api";
import { methodLabel } from "./methods";
import { CASH_LIMIT } from "../services/baseUrl";
import { useSuccessSound } from "../modules/PlaySound";

function PosScreen({
  user,
  isAdmin,
  canReverse,
  onLogout,
  measure,
}: {
  user: any;
  isAdmin: boolean;
  canReverse: boolean;
  onLogout: () => void;
  measure?: unknown[];
}) {
  const pos = usePos();
  const pay = usePayment();
  const playSuccess = useSuccessSound();

  const resolve = useCallback(async (code: string, barcodes: string[] = []) => {
    const candidates = barcodes.length ? barcodes : [code];
    for (const candidate of candidates) {
      const cached = pos.findCached(candidate);
      if (cached) return cached;
    }
    for (const candidate of candidates) {
      const found = await findExactProduct(candidate, pos.state.ui.categoryId);
      if (found) {
        pos.rememberProducts([found]);
        return found;
      }
    }
    return null;
  }, [pos]);

  const onScan = useCallback(async (raw: string) => {
    const parsed = parseScan(raw);
    pos.dispatch({ type: "ui", ui: { query: "" } });
    if (parsed.kind === "empty") return;
    const lookup = parsed.kind === "emark" ? parsed.barcodes : [parsed.kind === "qty" ? parsed.code : parsed.code];
    const shown = parsed.kind === "code" ? parsed.code : parsed.kind === "qty" ? parsed.code : raw.trim();
    const product = await resolve(shown, lookup);
    if (!product) {
      pos.dispatch({ type: "cart", cart: { alert: `Կոդը «${shown}» չի գտնվել` } });
      return;
    }
    const qty = parsed.kind === "qty" ? parsed.qty : 1;
    const emark = parsed.kind === "emark" ? parsed.code : undefined;
    pos.addProduct(product, qty, emark);
  }, [pos, resolve]);

  const onConfirm = useCallback(async () => {
    if (!pay.result.canConfirm || pay.payment.submitting) return;
    if (pay.result.cash > CASH_LIMIT) {
      pay.setFormError("Կանխիկ գործարքը չի կարող գերազանցել 300 000 ՀՀ դրամը");
      return;
    }
    pay.setSubmitting(true);
    const lines = pos.state.cart.lines;
    const label = methodLabel(pos.state.ui.methods, pay.payment.method, pay.payment.otherName);
    const response = await submitSale({
      cashAmount: pay.result.cash,
      cardAmount: pay.result.nonCash,
      nonCashMethod: pay.payment.method,
      nonCashMethodName: label,
      sales: lines.map((line) => ({ id: line.product.id, count: line.qty })),
      emarks: lines.flatMap((line) => line.emarks),
      isPrepayment: pay.payment.mode === "prepay",
      partialAmount: pay.payment.mode === "prepay" ? pay.result.debt : 0,
    });
    pay.setSubmitting(false);
    if (!response.ok) {
      pay.setFormError(response.message);
      return;
    }
    playSuccess();
    const receiptNo = String(response.data?.res?.recieptId || pos.state.cart.draftNo);
    pos.clearCart();
    pos.dispatch({ type: "payment", payment: { open: false, submitting: false, formError: "" } });
    pos.dispatch({
      type: "ui",
      ui: {
        fiscalSale: response.data,
        success: {
          mode: pay.payment.mode,
          receiptNo,
          total: pos.totals.payable,
          cash: pay.result.cash,
          nonCash: pay.result.nonCash,
          methodLabel: label,
          change: pay.result.change,
          debt: pay.result.debt,
          saleData: response.data,
        },
      },
    });
  }, [pay, playSuccess, pos]);

  return (
    <PosLayout
      user={user}
      isAdmin={isAdmin}
      canReverse={canReverse}
      onLogout={onLogout}
      onScan={onScan}
      onConfirm={onConfirm}
      measure={measure}
    />
  );
}

export default function PosPage({
  user,
  isAdmin,
  canReverse,
  onLogout,
  measure,
}: {
  user: any;
  isAdmin: boolean;
  canReverse: boolean;
  onLogout: () => void;
  measure?: unknown[];
}) {
  const cashierKey = String(user?.id || user?.userName || user?.email || "cashier");
  return (
    <PosProvider cashierKey={cashierKey}>
      <PosScreen user={user} isAdmin={isAdmin} canReverse={canReverse} onLogout={onLogout} measure={measure} />
    </PosProvider>
  );
}
