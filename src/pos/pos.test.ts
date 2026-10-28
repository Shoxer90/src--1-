import { formatAmd, roundLineTotal, toAmd } from "./money";
import { parseScan, isScanBurst } from "./parseScan";
import { includedVat, lineAmounts, summarizeCart } from "./cartMath";
import { validatePayment } from "./payment";

describe("formatAmd", () => {
  test("spaces thousands and appends dram", () => {
    expect(formatAmd(28001)).toBe("28 001 դր");
    expect(formatAmd(1000)).toBe("1 000 դր");
    expect(formatAmd(0)).toBe("0 դր");
  });
});

describe("parseScan", () => {
  test("exact code", () => {
    expect(parseScan("4850006200101")).toEqual({ kind: "code", code: "4850006200101" });
  });

  test("multiplies pieces", () => {
    expect(parseScan("6*4850006200101")).toEqual({
      kind: "qty",
      qty: 6,
      code: "4850006200101",
    });
  });

  test("accepts dot and comma for weighted quantity", () => {
    expect(parseScan("1.25*2001")).toMatchObject({ kind: "qty", qty: 1.25, code: "2001" });
    expect(parseScan("1,25*2001")).toMatchObject({ kind: "qty", qty: 1.25, code: "2001" });
  });

  test("detects an e-Mark code and its barcode", () => {
    const code = "010485000620010121SERIAL";
    const parsed = parseScan(code);
    expect(parsed.kind).toBe("emark");
    if (parsed.kind === "emark") {
      expect(parsed.barcodes).toContain("4850006200101");
    }
  });

  test("empty input", () => {
    expect(parseScan("   ")).toEqual({ kind: "empty" });
  });

  test("wedge burst is only fast gaps", () => {
    expect(isScanBurst([10, 12, 20])).toBe(true);
    expect(isScanBurst([10, 40])).toBe(false);
  });
});

describe("cart math", () => {
  test("discounts and included VAT", () => {
    const totals = summarizeCart([
      { price: 1200, discountedPrice: 1000, qty: 2 },
      { price: 500, discountedPrice: 500, qty: 1 },
    ]);
    expect(totals.subtotal).toBe(2900);
    expect(totals.discount).toBe(400);
    expect(totals.payable).toBe(2500);
    expect(totals.vat).toBe(Math.round(2500 / 6));
    expect(includedVat(6000)).toBe(1000);
  });

  test("weighted quantity rounds the line total", () => {
    expect(roundLineTotal(1000, 1.25)).toBe(1250);
    expect(lineAmounts({ price: 1000, discountedPrice: 800, qty: 1.25 })).toEqual({
      listTotal: 1250,
      payTotal: 1000,
      discount: 250,
    });
  });

  test("money is rounded to whole dram before multiplying", () => {
    expect(toAmd(10.6)).toBe(11);
    expect(roundLineTotal(10.4, 3)).toBe(30);
  });
});

describe("validatePayment", () => {
  test("change comes only from cash", () => {
    const result = validatePayment({
      total: 2800,
      cash: 2000,
      nonCash: 1500,
      method: "idram",
      otherName: "",
      mode: "sale",
    });
    expect(result.paid).toBe(3500);
    expect(result.change).toBe(700);
    expect(result.canConfirm).toBe(true);
    expect(result.errors).toEqual([]);
  });

  test("mixed cash and Idram keeps the overpay inside the cash tender", () => {
    const result = validatePayment({
      total: 5000,
      cash: 2000,
      nonCash: 3000,
      method: "idram",
      otherName: "",
      mode: "sale",
    });
    expect(result.change).toBe(0);
    expect(result.canConfirm).toBe(true);
  });

  test("rejects non-cash above the total", () => {
    const result = validatePayment({
      total: 2800,
      cash: 0,
      nonCash: 3000,
      method: "card",
      otherName: "",
      mode: "sale",
    });
    expect(result.errors[0]).toBe("Անկանխիկ գումարը չի կարող գերազանցել ընդհանուր գումարը։");
    expect(result.canConfirm).toBe(false);
  });

  test("rejects overpay that cannot be returned as cash change", () => {
    const result = validatePayment({
      total: 2800,
      cash: 0,
      nonCash: 2800,
      method: "card",
      otherName: "",
      mode: "sale",
    });
    expect(result.canConfirm).toBe(true);

    const over = validatePayment({
      total: 1000,
      cash: 0,
      nonCash: 1000,
      method: "card",
      otherName: "",
      mode: "sale",
    });
    expect(over.errors).not.toContain("Ստացված գումարը գերազանցում է ընդհանուրը։");

    const blocked = validatePayment({
      total: 1000,
      cash: 0,
      nonCash: 1500,
      method: "card",
      otherName: "",
      mode: "sale",
    });
    expect(blocked.errors).toContain("Ստացված գումարը գերազանցում է ընդհանուրը։");
  });

  test("other method requires a name", () => {
    const result = validatePayment({
      total: 1000,
      cash: 0,
      nonCash: 1000,
      method: "other",
      otherName: "   ",
      mode: "sale",
    });
    expect(result.errors).toContain("Նշեք, թե որ միջոցով է ստացվել անկանխիկ վճարումը։");
    expect(result.canConfirm).toBe(false);
  });

  test("prepayment can confirm with a partial payment", () => {
    const result = validatePayment({
      total: 5000,
      cash: 2000,
      nonCash: 0,
      method: "card",
      otherName: "",
      mode: "prepay",
    });
    expect(result.debt).toBe(3000);
    expect(result.canConfirm).toBe(true);
  });

  test("sale cannot confirm until the total is covered", () => {
    const result = validatePayment({
      total: 5000,
      cash: "2000",
      nonCash: "",
      method: "card",
      otherName: "",
      mode: "sale",
    });
    expect(result.canConfirm).toBe(false);
    expect(result.remaining).toBe(3000);
  });
});
