import { roundLineTotal, roundQty, toAmd } from "./money";

export type PricedLine = {
  price: number;
  discountedPrice: number;
  qty: number;
};

export type LineAmounts = {
  listTotal: number;
  payTotal: number;
  discount: number;
};

export type CartTotals = {
  subtotal: number;
  discount: number;
  vat: number;
  payable: number;
  itemCount: number;
};

export function lineAmounts(line: PricedLine): LineAmounts {
  const listUnit = toAmd(line.price);
  const payUnit = toAmd(
    line.discountedPrice == null ? line.price : line.discountedPrice
  );
  const qty = roundQty(line.qty);
  const listTotal = roundLineTotal(listUnit, qty);
  const payTotal = roundLineTotal(payUnit, qty);
  return {
    listTotal,
    payTotal,
    discount: Math.max(0, listTotal - payTotal),
  };
}

/** VAT is included in the payable total: total / 6. */
export function includedVat(payableAmd: number): number {
  return Math.round(toAmd(payableAmd) / 6);
}

export function summarizeCart(lines: PricedLine[]): CartTotals {
  let subtotal = 0;
  let discount = 0;
  let payable = 0;
  let itemCount = 0;
  for (const line of lines) {
    const amounts = lineAmounts(line);
    subtotal += amounts.listTotal;
    discount += amounts.discount;
    payable += amounts.payTotal;
    itemCount += roundQty(line.qty);
  }
  return {
    subtotal,
    discount,
    vat: includedVat(payable),
    payable,
    itemCount: roundQty(itemCount),
  };
}

export function isWeightedMeasure(measure: unknown): boolean {
  const value = String(measure ?? "").trim().toLowerCase();
  return value === "2" || value === "կգ" || value === "kg" || value === "кг";
}

export function qtyStep(measure: unknown): number {
  return isWeightedMeasure(measure) ? 0.1 : 1;
}

const UNIT_LABELS: Record<string, string> = {
  "1": "հատ",
  "2": "կգ",
  "3": "գրամ",
  "4": "լիտր",
  "5": "մետր",
  "6": "ք/մ",
  "7": "խ/մ",
  "8": "մլ",
  "9": "այլ",
  pcs: "հատ",
  հատ: "հատ",
  kg: "կգ",
  կգ: "կգ",
  кг: "կգ",
  шт: "հատ",
};

export function unitLabel(measure: unknown): string {
  const key = String(measure ?? "").trim();
  return UNIT_LABELS[key] || UNIT_LABELS[key.toLowerCase()] || key || "հատ";
}
