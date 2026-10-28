export type PosProduct = {
  id: number;
  name: string;
  price: number;
  discountedPrice: number;
  barCode: string;
  innerCode: string;
  remainder: number;
  measure: string;
  photo: string;
  isEmark: boolean;
  category: string;
};

export type CartLine = {
  product: PosProduct;
  qty: number;
  emarks: string[];
};

export type PosView = "cards" | "list" | "scanner";

export type PaymentMode = "sale" | "prepay";

export type SuccessPayload = {
  mode: PaymentMode;
  receiptNo: string;
  total: number;
  cash: number;
  nonCash: number;
  methodLabel: string;
  change: number;
  debt: number;
  saleData: unknown;
};
