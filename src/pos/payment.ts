import { parseAmdInput, toAmd } from "./money";

export type PaymentMode = "sale" | "prepay";

export type PaymentInput = {
  total: number;
  cash: number | string;
  nonCash: number | string;
  method: string | null;
  otherName: string;
  mode: PaymentMode;
};

export type PaymentResult = {
  cash: number;
  nonCash: number;
  paid: number;
  change: number;
  remaining: number;
  debt: number;
  errors: string[];
  canConfirm: boolean;
};

export const PAYMENT_ERRORS = {
  nonCashOver:
    "Անկանխիկ գումարը չի կարող գերազանցել ընդհանուր գումարը։",
  paidOver: "Ստացված գումարը գերազանցում է ընդհանուրը։",
  otherRequired: "Նշեք, թե որ միջոցով է ստացվել անկանխիկ վճարումը։",
} as const;

/**
 * paid = cash + nonCash
 * change = max(0, min(cash, paid - total))   // change comes ONLY from cash
 */
export function validatePayment(input: PaymentInput): PaymentResult {
  const total = Math.max(0, toAmd(input.total));
  const cash = Math.max(
    0,
    typeof input.cash === "string" ? parseAmdInput(input.cash) : toAmd(input.cash)
  );
  const nonCash = Math.max(
    0,
    typeof input.nonCash === "string" ? parseAmdInput(input.nonCash) : toAmd(input.nonCash)
  );
  const paid = cash + nonCash;
  const change = Math.max(0, Math.min(cash, paid - total));
  const errors: string[] = [];

  if (nonCash > total) errors.push(PAYMENT_ERRORS.nonCashOver);
  if (paid > total && change === 0) errors.push(PAYMENT_ERRORS.paidOver);
  if (nonCash > 0 && input.method === "other" && !String(input.otherName || "").trim()) {
    errors.push(PAYMENT_ERRORS.otherRequired);
  }

  const canConfirm =
    input.mode === "prepay"
      ? errors.length === 0 && paid > 0
      : errors.length === 0 && paid >= total;

  return {
    cash,
    nonCash,
    paid,
    change,
    remaining: Math.max(0, total - paid),
    debt: input.mode === "prepay" ? Math.max(0, total - paid) : 0,
    errors,
    canConfirm,
  };
}

export type PaymentStatusKind = "due" | "change" | "paid" | "debt";

export function paymentStatus(
  result: PaymentResult,
  mode: PaymentMode
): { kind: PaymentStatusKind; amount: number } {
  if (mode === "prepay" && result.debt > 0) {
    return { kind: "debt", amount: result.debt };
  }
  if (result.remaining > 0) return { kind: "due", amount: result.remaining };
  if (result.change > 0) return { kind: "change", amount: result.change };
  return { kind: "paid", amount: 0 };
}
