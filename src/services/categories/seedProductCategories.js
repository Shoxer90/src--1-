import { productQuery, updateProduct } from "../products/productsRequests";
import { toCategoryIds } from "./categoriesRequests";
import { findIn, SEED_TREE } from "./seedCategories";

const PROD_FLAG = "storex_seeded_product_categories_v1";

const NAME_RULES = [
  { test: /йогурт|yogurt|յոգուրտ/i, mainEn: "Dairy", subEn: "Yogurt" },
  { test: /сыр|cheese|պանիր/i, mainEn: "Dairy", subEn: "Cheese" },
  { test: /кефир|простокваш|кисломолоч|թթվ/i, mainEn: "Dairy", subEn: "Fermented dairy" },
  { test: /молоко|\bmilk\b|կաթ/i, mainEn: "Dairy", subEn: "Milk" },
  { test: /куриц|chicken|հավ|black meat/i, mainEn: "Meat", subEn: "Chicken" },
  { test: /говяд|beef|տավար/i, mainEn: "Meat", subEn: "Beef" },
  { test: /свин|pork|խոզ/i, mainEn: "Meat", subEn: "Pork" },
  { test: /колбас|sausage|երշիկ/i, mainEn: "Meat", subEn: "Sausages" },
  { test: /печень|cookie|թխվածքաբլիթ/i, mainEn: "Bakery", subEn: "Cookies" },
  { test: /выпечк|pastr|թխվածք/i, mainEn: "Bakery", subEn: "Pastries" },
  { test: /хлеб|bread|հաց/i, mainEn: "Bakery", subEn: "Bread" },
  { test: /сок|juice|հյութ/i, mainEn: "Drinks", subEn: "Juices" },
  { test: /вода|water|ջուր/i, mainEn: "Drinks", subEn: "Water" },
  { test: /газ|cola|sprite|fanta|лимонад/i, mainEn: "Drinks", subEn: "Soft drinks" },
  { test: /зелен|укроп|петрушк|կանաչի/i, mainEn: "Fruits and vegetables", subEn: "Greens" },
  { test: /фрукт|fruit|մրգ|яблок|банан|апельсин/i, mainEn: "Fruits and vegetables", subEn: "Fruits" },
  { test: /овощ|vegetable|բանջար|помидор|огурец|картофел/i, mainEn: "Fruits and vegetables", subEn: "Vegetables" },
  { test: /макарон|pasta|крупа|рис|гречк/i, mainEn: "Grocery", subEn: "Pasta and cereals" },
  { test: /масло|oil|соус|sauce|յուղ/i, mainEn: "Grocery", subEn: "Oil and sauces" },
  { test: /консерв|canned|պահածո/i, mainEn: "Grocery", subEn: "Canned food" },
  { test: /молочн|dairy|կաթն/i, mainEn: "Dairy", subEn: "Milk" },
  { test: /мясо|meat|միս/i, mainEn: "Meat", subEn: "Chicken" }
];

const loadProducts = async () => {
  const types = ["GetAvailableProducts", "GetNotAvailableProducts", "GetFavoriteProducts"];
  const pages = [1, 2];
  const byId = new Map();
  for (const type of types) {
    for (const page of pages) {
      const res = await productQuery(type, page);
      const list = Array.isArray(res?.data) ? res.data : [];
      list.forEach((item) => {
        if (item?.id != null && !byId.has(item.id)) byId.set(item.id, item);
      });
    }
  }
  return [...byId.values()];
};

const findMain = (tree, mainEn) => {
  const seed = SEED_TREE.find((item) => item.titleEn === mainEn);
  return seed ? findIn(tree, seed) : null;
};

const findChild = (main, subEn) => {
  if (!main || !subEn) return null;
  const seed = SEED_TREE.find((item) => item.children?.some((child) => child.titleEn === subEn));
  const childSeed = seed?.children?.find((child) => child.titleEn === subEn);
  return childSeed ? findIn(main.children || [], childSeed) : null;
};

const idsFor = (main, child) => [main?.id, child?.id].filter(Boolean);

const categoryPairs = (tree) => {
  const pairs = [];
  for (const seed of SEED_TREE) {
    const main = findIn(tree, seed);
    if (!main) continue;
    const children = (seed.children || [])
      .map((child) => findIn(main.children || [], child))
      .filter(Boolean);
    if (children.length) {
      children.forEach((child) => pairs.push({ main, child }));
    } else {
      pairs.push({ main, child: null });
    }
  }
  return pairs;
};

export const assignProductCategories = async (tree = []) => {
  if (localStorage.getItem(PROD_FLAG) === "1") return false;

  const pairs = categoryPairs(tree);
  if (!pairs.length) return false;

  const products = await loadProducts();
  const targets = products.filter((product) => toCategoryIds(product?.categoryIds).length === 0);
  if (!targets.length) {
    localStorage.setItem(PROD_FLAG, "1");
    return false;
  }

  const assignments = [];
  const used = new Set();

  for (const product of targets) {
    const text = `${product?.name || ""} ${product?.brand || ""}`;
    const rule = NAME_RULES.find((item) => item.test.test(text));
    if (!rule) continue;
    const main = findMain(tree, rule.mainEn);
    const child = findChild(main, rule.subEn);
    const categoryIds = idsFor(main, child);
    if (!categoryIds.length) continue;
    assignments.push({ product, categoryIds });
    used.add(product.id);
  }

  const unmatched = targets.filter((product) => !used.has(product.id));
  unmatched.forEach((product, index) => {
    const pair = pairs[index % pairs.length];
    assignments.push({
      product,
      categoryIds: idsFor(pair.main, pair.child)
    });
  });

  const limited = assignments.slice(0, 24);
  let updated = 0;
  for (const item of limited) {
    const status = await updateProduct({
      ...item.product,
      categoryIds: item.categoryIds
    });
    if (status === 200) updated += 1;
  }

  if (updated > 0 || targets.length === 0) {
    localStorage.setItem(PROD_FLAG, "1");
  }
  return updated > 0;
};
