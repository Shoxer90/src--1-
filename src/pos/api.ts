import { byBarCode, getPrepayment, productQuery, searchByName } from "../services/products/productsRequests";
import { saleProductFromBasket } from "../services/pay/pay";
import { cheackProductCount } from "../services/products/productsRequests";
import { getHistoryById, getHistoryByIdForReverse, getSaleProducts, reverseProductNew, sendSmsPDF } from "../services/user/userHistoryQuery";
import { getCategories, flattenCategories } from "../services/categories/categoriesRequests";
import { toAmd } from "./money";
import type { PosProduct } from "./types";

export function toProduct(raw: any): PosProduct | null {
  if (!raw || typeof raw !== "object") return null;
  const id = Number(raw.id ?? raw.productId);
  if (!Number.isFinite(id)) return null;
  const price = toAmd(raw.price);
  const discountedPrice = raw.discountedPrice == null ? price : toAmd(raw.discountedPrice);
  return {
    id,
    name: String(raw.name || raw.nameHy || ""),
    price,
    discountedPrice,
    barCode: String(raw.barCode || raw.barcode || ""),
    innerCode: String(raw.innerCode || ""),
    remainder: Number(raw.remainder ?? 0),
    measure: raw.measure == null ? "" : String(raw.measure),
    photo: String(raw.photo || ""),
    isEmark: Boolean(raw.isEmark),
    category: String(raw.type || raw.categoryName || raw.category || ""),
  };
}

function asList(value: any): any[] {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  return [];
}

export async function loadProductPage(page: number, categoryId: number | null) {
  const res: any = await productQuery("GetAvailableProducts", page, categoryId ?? undefined);
  if (!res || typeof res === "number" || !res.data) return { items: [] as PosProduct[], total: 0 };
  const items = asList(res.data).map(toProduct).filter((item): item is PosProduct => Boolean(item));
  const headerCount = res.headers?.count ?? res.headers?.Count;
  const total = Number(Array.isArray(headerCount) ? headerCount[0] : headerCount);
  return { items, total: Number.isFinite(total) ? total : items.length };
}

export async function searchCatalog(query: string, categoryId: number | null): Promise<PosProduct[]> {
  const text = query.trim();
  if (!text) return [];
  const [named, coded] = await Promise.all([
    searchByName(text, categoryId ?? undefined).catch(() => []),
    /^\d/.test(text) ? byBarCode("GetAvailableProducts", text, categoryId ?? undefined) : Promise.resolve([]),
  ]);
  const merged = [...asList(named), ...asList(coded)];
  const map = new Map<number, PosProduct>();
  merged.forEach((item) => {
    const product = toProduct(item);
    if (product) map.set(product.id, product);
  });
  const q = text.toLowerCase();
  return Array.from(map.values()).filter((product) => {
    return (
      product.name.toLowerCase().includes(q) ||
      product.barCode.toLowerCase() === q ||
      product.barCode.toLowerCase().includes(q) ||
      product.innerCode.toLowerCase() === q ||
      product.innerCode.toLowerCase().includes(q)
    );
  });
}

export async function findExactProduct(code: string, categoryId: number | null): Promise<PosProduct | null> {
  const needle = code.trim();
  if (!needle) return null;
  const res: any = await byBarCode("GetAvailableProducts", needle, categoryId ?? undefined);
  const fromCode = asList(res)
    .map(toProduct)
    .filter((item): item is PosProduct => Boolean(item))
    .find((item) => item.barCode === needle || item.innerCode === needle);
  if (fromCode) return fromCode;

  const named: any = await searchByName(needle, categoryId ?? undefined);
  return (
    asList(named)
      .map(toProduct)
      .filter((item): item is PosProduct => Boolean(item))
      .find((item) => item.barCode === needle || item.innerCode === needle) || null
  );
}

export async function loadCategories(): Promise<{ id: number; title: string }[]> {
  const tree = await getCategories();
  return flattenCategories(tree || []).map((item: any) => ({
    id: Number(item.id),
    title: String(item.title || item.titleHy || ""),
  })).filter((item) => item.title);
}

export async function loadOpenPrepaymentCount(): Promise<number> {
  const res: any = await getPrepayment({ page: 1, count: 1, searchString: "", isPayd: false });
  const count = Number(res?.count);
  return Number.isFinite(count) ? count : 0;
}

export type SaleRequest = {
  cashAmount: number;
  cardAmount: number;
  nonCashMethod: string;
  nonCashMethodName: string;
  sales: { id: number; count: number }[];
  emarks: string[];
  isPrepayment: boolean;
  partialAmount: number;
};

export async function submitSale(body: SaleRequest) {
  const payload = {
    discount: 0,
    discountType: 0,
    cashAmount: body.cashAmount,
    cardAmount: body.cardAmount,
    nonCashMethod: body.nonCashMethod,
    nonCashMethodName: body.nonCashMethodName,
    prePaymentAmount: 0,
    partialAmount: body.partialAmount,
    partnerTin: "",
    sales: body.sales,
    emarks: body.emarks,
    isPrepayment: body.isPrepayment,
    customer_Name: "",
    customer_Phone: "",
  };
  const check: any = await cheackProductCount(payload.sales);
  if (Array.isArray(check)) {
    const missing = check.filter((item) => item?.status === false);
    if (missing.length) {
      return { ok: false as const, message: "Անբավարար մնացորդ" };
    }
  }
  const response: any = await saleProductFromBasket(payload);
  if (response?.res?.printResponseInfo || response?.res) {
    return { ok: true as const, data: response };
  }
  const message = response?.data?.message || response?.message || "Վաճառքը չհաջողվեց";
  return { ok: false as const, message: String(message) };
}

export async function loadRecentReceipts() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 14);
  const res: any = await getSaleProducts("GetSaleProductsByPage", {
    page: 1,
    count: 20,
    byDate: { startDate: start.toISOString(), endDate: end.toISOString() },
  });
  return Array.isArray(res?.data) ? res.data : [];
}

export async function findReceipt(code: string) {
  const data = await getHistoryById(code.trim());
  if (!data || typeof data === "number") return null;
  return data;
}

export async function loadReceiptForReturn(saleDetailId: number | string) {
  const data = await getHistoryByIdForReverse(saleDetailId);
  if (!data || typeof data === "number") return null;
  return data;
}

export async function submitReturn(body: {
  saleDetailId: number | string;
  products: { recieptId: number | string; quantity: number }[];
  cashAmount: number;
  cardAmount: number;
  emarks: string[];
}) {
  const res: any = await reverseProductNew(body);
  if (res?.status === 200) return { ok: true as const, data: res.data };
  const message = res?.data?.message || "Վերադարձը չհաջողվեց";
  return { ok: false as const, message: String(message) };
}

export async function sendReceiptSms(receiptId: string, phone: string) {
  const res: any = await sendSmsPDF("phone", { receptId: receiptId, phone });
  return res?.status === 200;
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const axios = (await import("axios")).default;
  const { baseUrl } = await import("../services/baseUrl");
  try {
    const res = await axios.post(baseUrl + "Login/Login ", {
      username: username.trim(),
      password,
      isLastVersion: true,
    });
    return res?.data?.role === "Director";
  } catch {
    return false;
  }
}
