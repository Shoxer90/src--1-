import { useMemo } from "react";
import { usePos } from "../PosContext";
import { parseAmdInput } from "../money";
import { paymentStatus, validatePayment } from "../payment";

export function usePayment() {
  const pos = usePos();
  const payment = pos.state.payment;
  const total = pos.totals.payable;
  const result = useMemo(
    () =>
      validatePayment({
        total,
        cash: payment.cash,
        nonCash: payment.nonCash,
        method: payment.method,
        otherName: payment.otherName,
        mode: payment.mode,
      }),
    [total, payment.cash, payment.nonCash, payment.method, payment.otherName, payment.mode]
  );
  const status = paymentStatus(result, payment.mode);

  const open = (mode: "sale" | "prepay") => {
    if (!pos.state.cart.lines.length) return;
    pos.dispatch({
      type: "payment",
      payment: {
        open: true,
        mode,
        cash: "",
        nonCash: "",
        otherName: "",
        formError: "",
        activeField: "cash",
        method: pos.state.ui.methods[0]?.id || "card",
      },
    });
  };

  const appendDigit = (digit: string) => {
    const field = payment.activeField;
    const current = field === "cash" ? payment.cash : payment.nonCash;
    const next = `${current}${digit}`.replace(/^0+(\d)/, "$1");
    pos.dispatch({
      type: "payment",
      payment: field === "cash" ? { cash: next, formError: "" } : { nonCash: next, formError: "" },
    });
  };

  const backspace = () => {
    const field = payment.activeField;
    const current = field === "cash" ? payment.cash : payment.nonCash;
    const next = current.slice(0, -1);
    pos.dispatch({
      type: "payment",
      payment: field === "cash" ? { cash: next } : { nonCash: next },
    });
  };

  const fillRemainder = (field: "cash" | "nonCash") => {
    const cash = field === "cash" ? 0 : parseAmdInput(payment.cash);
    const nonCash = field === "nonCash" ? 0 : parseAmdInput(payment.nonCash);
    const rest = Math.max(0, total - (field === "cash" ? nonCash : cash));
    const capped = field === "nonCash" ? Math.min(rest, total) : rest;
    const value = capped ? String(capped) : "";
    pos.dispatch({
      type: "payment",
      payment: field === "cash"
        ? { cash: value, activeField: field, formError: "" }
        : { nonCash: value, activeField: field, formError: "" },
    });
  };

  return {
    payment,
    result,
    status,
    methods: pos.state.ui.methods,
    total,
    open,
    close: () => pos.dispatch({ type: "payment", payment: { open: false, formError: "" } }),
    setCash: (cash: string) => pos.dispatch({ type: "payment", payment: { cash, activeField: "cash" } }),
    setNonCash: (nonCash: string) =>
      pos.dispatch({ type: "payment", payment: { nonCash, activeField: "nonCash" } }),
    setMethod: (method: string) => pos.dispatch({ type: "payment", payment: { method } }),
    setOtherName: (otherName: string) => pos.dispatch({ type: "payment", payment: { otherName } }),
    setActiveField: (activeField: "cash" | "nonCash") =>
      pos.dispatch({ type: "payment", payment: { activeField } }),
    appendDigit,
    backspace,
    fillRemainder,
    setQuick: (amount: number) =>
      pos.dispatch({ type: "payment", payment: { cash: String(amount), activeField: "cash" } }),
    setSubmitting: (submitting: boolean) => pos.dispatch({ type: "payment", payment: { submitting } }),
    setFormError: (formError: string) => pos.dispatch({ type: "payment", payment: { formError } }),
  };
}
