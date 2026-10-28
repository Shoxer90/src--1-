export type NonCashMethod = {
  id: string;
  label: string;
};

export const METHODS_STORAGE_KEY = "storex.pos.nonCashMethods";

export const DEFAULT_NON_CASH_METHODS: NonCashMethod[] = [
  { id: "card", label: "Քարտ (POS)" },
  { id: "qr", label: "QR" },
  { id: "idram", label: "Idram" },
  { id: "telcell", label: "Telcell" },
  { id: "bank", label: "Բանկային փոխանցում" },
  { id: "other", label: "Այլ" },
];

export function normalizeMethods(value: unknown): NonCashMethod[] {
  const list = Array.isArray(value) ? value : [];
  const cleaned = list
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const id = String((item as NonCashMethod).id || "").trim();
      const label = String((item as NonCashMethod).label || "").trim();
      if (!id || !label) return null;
      return { id, label };
    })
    .filter((item): item is NonCashMethod => Boolean(item));

  const withoutOther = cleaned.filter((item) => item.id !== "other");
  const other = cleaned.find((item) => item.id === "other") || { id: "other", label: "Այլ" };
  const unique: NonCashMethod[] = [];
  const seen = new Set<string>();
  for (const item of withoutOther) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    unique.push(item);
  }
  unique.push(other);
  return unique.length > 1 ? unique : DEFAULT_NON_CASH_METHODS;
}

export function loadNonCashMethods(): NonCashMethod[] {
  try {
    const raw = localStorage.getItem(METHODS_STORAGE_KEY);
    if (!raw) return DEFAULT_NON_CASH_METHODS;
    return normalizeMethods(JSON.parse(raw));
  } catch {
    return DEFAULT_NON_CASH_METHODS;
  }
}

export function saveNonCashMethods(methods: NonCashMethod[]): NonCashMethod[] {
  const next = normalizeMethods(methods);
  localStorage.setItem(METHODS_STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function methodLabel(methods: NonCashMethod[], id: string, otherName: string): string {
  if (id === "other") return otherName.trim();
  return methods.find((item) => item.id === id)?.label || id;
}
