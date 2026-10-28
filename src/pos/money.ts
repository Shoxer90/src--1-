/** Whole AMD (dram). Never use binary floats for money. */
export function toAmd(value: unknown): number {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return 0;
    return Math.round(value);
  }
  const raw = String(value ?? "").replace(/\s/g, "").replace(",", ".");
  if (!raw) return 0;
  const n = Number(raw);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n);
}

export function parseAmdInput(raw: string): number {
  const digits = String(raw ?? "").replace(/[^\d]/g, "");
  if (!digits) return 0;
  const n = Number(digits);
  return Number.isFinite(n) ? n : 0;
}

/** 28001 → "28 001 դր" */
export function formatAmd(amount: number): string {
  const n = Math.round(Number.isFinite(amount) ? amount : 0);
  const sign = n < 0 ? "-" : "";
  const body = Math.abs(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${sign}${body} դր`;
}

/** Line total in AMD. Quantity may have up to 3 decimals. */
export function roundLineTotal(unitPriceAmd: number, qty: number): number {
  const unit = Math.round(unitPriceAmd);
  const milli = Math.round(qty * 1000);
  return Math.round((unit * milli) / 1000);
}

export function roundQty(qty: number): number {
  if (!Number.isFinite(qty)) return 0;
  return Math.round(qty * 1000) / 1000;
}

export function formatQty(qty: number): string {
  const rounded = roundQty(qty);
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}
