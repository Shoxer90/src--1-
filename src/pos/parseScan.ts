import { replaceGS } from "../services/baseUrl";
import { roundQty } from "./money";

export type ScanResult =
  | { kind: "empty" }
  | { kind: "code"; code: string }
  | { kind: "qty"; qty: number; code: string }
  | { kind: "emark"; code: string; barcodes: string[] };

const QTY_CODE = /^(\d+(?:[.,]\d{1,3})?)\*(.+)$/;

export function isEmarkCode(input: string): boolean {
  const raw = String(input ?? "").split("\u001d").join("");
  return raw.substring(0, 2) === "01" && raw.substring(16, 18) === "21" && raw.length > 18;
}

/** GTIN candidates: 14-digit AI(01), 13-digit without the leading zero, and trimmed. */
export function emarkBarcodes(input: string): string[] {
  const raw = String(input ?? "").split("\u001d").join("");
  if (!isEmarkCode(raw)) return [];
  const gtin14 = raw.substring(2, 16);
  const gtin13 = raw.substring(3, 16);
  const trimmed = gtin14.replace(/^0+/, "");
  return Array.from(new Set([gtin13, gtin14, trimmed].filter(Boolean)));
}

export function parseScan(raw: string): ScanResult {
  const text = String(raw ?? "").trim();
  if (!text) return { kind: "empty" };

  const normalized = replaceGS(text) || text;
  if (isEmarkCode(normalized)) {
    return { kind: "emark", code: normalized, barcodes: emarkBarcodes(normalized) };
  }

  const match = text.match(QTY_CODE);
  if (match) {
    const qty = roundQty(Number(match[1].replace(",", ".")));
    const code = match[2].trim();
    if (qty > 0 && code) return { kind: "qty", qty, code };
  }

  return { kind: "code", code: text };
}

/** Keyboard-wedge burst: gaps under 30ms, ended by Enter. */
export const SCAN_GAP_MS = 30;

export function isScanBurst(gapsMs: number[]): boolean {
  if (!gapsMs.length) return false;
  return gapsMs.every((gap) => gap >= 0 && gap < SCAN_GAP_MS);
}
