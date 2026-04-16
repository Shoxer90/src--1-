/**
 * Суммы для заказа: группы по 3 через пробел (1 236 564), дробь через запятую (1 234,56).
 */
export function formatOrderNumber(val) {
  if (val === null || val === undefined || val === "") return "";
  const normalized = String(val).trim().replace(/\s/g, "").replace(",", ".");
  const n = Number(normalized);
  if (Number.isNaN(n)) return String(val);

  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  const rounded = Math.round(abs * 100) / 100;
  const [intRaw, decRaw = ""] = rounded.toFixed(2).split(".");
  const intStr = intRaw.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const decTrim = decRaw.replace(/0+$/, "");
  if (!decTrim) return sign + intStr;
  return `${sign}${intStr},${decTrim}`;
}
