import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type Dispatch,
  type ReactNode,
} from "react";
import { isWeightedMeasure, qtyStep, summarizeCart } from "./cartMath";
import { roundQty } from "./money";
import { loadNonCashMethods, saveNonCashMethods, type NonCashMethod } from "./methods";
import type { CartLine, PaymentMode, PosProduct, PosView, SuccessPayload } from "./types";

type CartState = {
  lines: CartLine[];
  draftNo: number;
  alert: string;
  lastAdded: { productId: number; qty: number } | null;
};

type PaymentState = {
  open: boolean;
  mode: PaymentMode;
  cash: string;
  nonCash: string;
  method: string;
  otherName: string;
  activeField: "cash" | "nonCash";
  submitting: boolean;
  formError: string;
};

type UiState = {
  view: PosView;
  categoryId: number | null;
  query: string;
  selectedLine: number;
  success: SuccessPayload | null;
  fiscalOpen: boolean;
  fiscalSale: unknown;
  methods: NonCashMethod[];
  methodsOpen: boolean;
  parked: ParkedSale[];
};

export type ParkedSale = {
  id: string;
  draftNo: number;
  lines: CartLine[];
  at: string;
};

type State = { cart: CartState; payment: PaymentState; ui: UiState };

type Action =
  | { type: "cart"; cart: Partial<CartState> }
  | { type: "payment"; payment: Partial<PaymentState> }
  | { type: "ui"; ui: Partial<UiState> }
  | { type: "resetSale"; draftNo: number };

const PARK_KEY = "storex.pos.parked";

function readParked(): ParkedSale[] {
  try {
    const raw = JSON.parse(localStorage.getItem(PARK_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function writeParked(list: ParkedSale[]) {
  localStorage.setItem(PARK_KEY, JSON.stringify(list));
}

function readDraft() {
  const n = Number(localStorage.getItem("storex.pos.draftNo") || "1001");
  return Number.isFinite(n) && n > 0 ? n : 1001;
}

function bumpDraft() {
  const next = readDraft() + 1;
  localStorage.setItem("storex.pos.draftNo", String(next));
  return next;
}

function readView(cashierKey: string): PosView {
  const saved = localStorage.getItem(`storex.pos.view.${cashierKey}`);
  if (saved === "cards" || saved === "list" || saved === "scanner") return saved;
  return "cards";
}

function reducer(state: State, action: Action): State {
  if (action.type === "cart") return { ...state, cart: { ...state.cart, ...action.cart } };
  if (action.type === "payment") return { ...state, payment: { ...state.payment, ...action.payment } };
  if (action.type === "ui") return { ...state, ui: { ...state.ui, ...action.ui } };
  if (action.type === "resetSale") {
    return {
      ...state,
      cart: { lines: [], draftNo: action.draftNo, alert: "", lastAdded: null },
      payment: {
        ...state.payment,
        open: false,
        cash: "",
        nonCash: "",
        otherName: "",
        submitting: false,
        formError: "",
        activeField: "cash",
      },
      ui: { ...state.ui, selectedLine: 0, success: null, fiscalOpen: false, fiscalSale: null },
    };
  }
  return state;
}

type PosApi = {
  state: State;
  dispatch: Dispatch<Action>;
  cashierKey: string;
  rememberProducts: (products: PosProduct[]) => void;
  findCached: (code: string) => PosProduct | null;
  addProduct: (product: PosProduct, qty: number, emark?: string) => string;
  setQty: (productId: number, qty: number) => void;
  removeLine: (productId: number) => void;
  clearCart: () => void;
  parkCart: () => void;
  resumeParked: (id: string) => void;
  finishSale: () => void;
  totals: ReturnType<typeof summarizeCart>;
};

const PosContext = createContext<PosApi | null>(null);

function limitQty(product: PosProduct, qty: number): { qty: number; limited: boolean } {
  const next = roundQty(qty);
  if (next <= 0) return { qty: 0, limited: false };
  const stock = Number(product.remainder);
  if (Number.isFinite(stock) && next > stock) {
    return { qty: roundQty(Math.max(stock, 0)), limited: true };
  }
  return { qty: next, limited: false };
}

export function PosProvider({
  cashierKey,
  children,
}: {
  cashierKey: string;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, undefined, (): State => ({
    cart: { lines: [], draftNo: readDraft(), alert: "", lastAdded: null },
    payment: {
      open: false,
      mode: "sale",
      cash: "",
      nonCash: "",
      method: loadNonCashMethods()[0]?.id || "card",
      otherName: "",
      activeField: "cash",
      submitting: false,
      formError: "",
    },
    ui: {
      view: readView(cashierKey),
      categoryId: null,
      query: "",
      selectedLine: 0,
      success: null,
      fiscalOpen: false,
      fiscalSale: null,
      methods: loadNonCashMethods(),
      methodsOpen: false,
      parked: readParked(),
    },
  }));

  const byCode = useRef(new Map<string, PosProduct>());
  const linesRef = useRef(state.cart.lines);
  useEffect(() => {
    linesRef.current = state.cart.lines;
  }, [state.cart.lines]);

  const rememberProducts = useCallback((products: PosProduct[]) => {
    products.forEach((product) => {
      if (product.barCode) byCode.current.set(product.barCode, product);
      if (product.innerCode) byCode.current.set(`inner:${product.innerCode}`, product);
    });
  }, []);

  const findCached = useCallback((code: string) => {
    return byCode.current.get(code) || byCode.current.get(`inner:${code}`) || null;
  }, []);

  const addProduct = useCallback((product: PosProduct, qty: number, emark?: string) => {
    let message = "";
    const current = linesRef.current;
    const existing = current.find((line) => line.product.id === product.id);
    const emarks = existing?.emarks || [];
    if (emark && emarks.includes(emark)) {
      dispatch({ type: "cart", cart: { alert: "Այս e-Mark կոդն արդեն սկանավորված է" } });
      return "duplicate";
    }
    const start = existing?.qty || 0;
    const limited = limitQty(product, start + qty);
    if (limited.qty <= start) {
      dispatch({ type: "cart", cart: { alert: "Անբավարար մնացորդ" } });
      return "stock";
    }
    if (limited.limited) message = "Անբավարար մնացորդ";
    const added = roundQty(limited.qty - start);
    const nextLines = existing
      ? current.map((line) =>
          line.product.id === product.id
            ? {
                ...line,
                product,
                qty: limited.qty,
                emarks: emark ? [...line.emarks, emark] : line.emarks,
              }
            : line
        )
      : [
          {
            product,
            qty: limited.qty,
            emarks: emark ? [emark] : [],
          },
          ...current,
        ];
    const selected = nextLines.findIndex((line) => line.product.id === product.id);
    linesRef.current = nextLines;
    dispatch({
      type: "cart",
      cart: {
        lines: nextLines,
        alert: message,
        lastAdded: { productId: product.id, qty: added },
      },
    });
    dispatch({ type: "ui", ui: { selectedLine: Math.max(selected, 0) } });
    return "ok";
  }, []);

  const setQty = useCallback((productId: number, qty: number) => {
    const line = linesRef.current.find((item) => item.product.id === productId);
    if (!line) return;
    const limited = limitQty(line.product, qty);
    const next = limited.qty <= 0
      ? linesRef.current.filter((item) => item.product.id !== productId)
      : linesRef.current.map((item) =>
          item.product.id === productId ? { ...item, qty: limited.qty } : item
        );
    linesRef.current = next;
    dispatch({
      type: "cart",
      cart: {
        alert: limited.limited ? "Անբավարար մնացորդ" : "",
        lines: next,
      },
    });
  }, []);

  const removeLine = useCallback((productId: number) => {
    const next = linesRef.current.filter((item) => item.product.id !== productId);
    linesRef.current = next;
    dispatch({ type: "cart", cart: { lines: next, alert: "" } });
  }, []);

  const clearCart = useCallback(() => {
    linesRef.current = [];
    dispatch({ type: "cart", cart: { lines: [], alert: "", lastAdded: null } });
  }, []);

  const parkCart = useCallback(() => {
    if (!state.cart.lines.length) return;
    const parked: ParkedSale = {
      id: `${Date.now()}`,
      draftNo: state.cart.draftNo,
      lines: state.cart.lines,
      at: new Date().toISOString(),
    };
    const next = [parked, ...state.ui.parked].slice(0, 8);
    writeParked(next);
    linesRef.current = [];
    dispatch({ type: "ui", ui: { parked: next } });
    dispatch({ type: "resetSale", draftNo: bumpDraft() });
  }, [state.cart.lines, state.cart.draftNo, state.ui.parked]);

  const resumeParked = useCallback((id: string) => {
    const item = state.ui.parked.find((sale) => sale.id === id);
    if (!item || state.cart.lines.length) return;
    const next = state.ui.parked.filter((sale) => sale.id !== id);
    writeParked(next);
    dispatch({ type: "ui", ui: { parked: next } });
    linesRef.current = item.lines;
    dispatch({
      type: "cart",
      cart: { lines: item.lines, draftNo: item.draftNo, alert: "", lastAdded: null },
    });
  }, [state.ui.parked, state.cart.lines.length]);

  const finishSale = useCallback(() => {
    linesRef.current = [];
    dispatch({ type: "resetSale", draftNo: bumpDraft() });
  }, []);

  const totals = useMemo(
    () => summarizeCart(state.cart.lines.map((line) => ({
      price: line.product.price,
      discountedPrice: line.product.discountedPrice,
      qty: line.qty,
    }))),
    [state.cart.lines]
  );

  const api = useMemo<PosApi>(() => ({
    state,
    dispatch,
    cashierKey,
    rememberProducts,
    findCached,
    addProduct,
    setQty,
    removeLine,
    clearCart,
    parkCart,
    resumeParked,
    finishSale,
    totals,
  }), [
    state,
    cashierKey,
    rememberProducts,
    findCached,
    addProduct,
    setQty,
    removeLine,
    clearCart,
    parkCart,
    resumeParked,
    finishSale,
    totals,
  ]);

  return <PosContext.Provider value={api}>{children}</PosContext.Provider>;
}

export function usePos() {
  const ctx = useContext(PosContext);
  if (!ctx) throw new Error("usePos must be used inside PosProvider");
  return ctx;
}

export function setView(dispatch: Dispatch<Action>, cashierKey: string, view: PosView) {
  localStorage.setItem(`storex.pos.view.${cashierKey}`, view);
  dispatch({ type: "ui", ui: { view } });
}

export function updateMethods(dispatch: Dispatch<Action>, methods: NonCashMethod[]) {
  const next = saveNonCashMethods(methods);
  dispatch({ type: "ui", ui: { methods: next, methodsOpen: false } });
  dispatch({ type: "payment", payment: { method: next[0]?.id || "card" } });
}

export { isWeightedMeasure, qtyStep, bumpDraft };
