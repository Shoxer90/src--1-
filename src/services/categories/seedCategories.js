import {
  createCategory,
  getCategories,
  normalizeCategoryTree
} from "./categoriesRequests";

const SEED_FLAG = "storex_seeded_categories_v1";

export const SEED_TREE = [
  {
    titleHy: "Կաթնամթերք",
    titleEn: "Dairy",
    titleRu: "Молочные",
    aliases: ["молочный", "молочные", "dairy", "կաթնամթերք"],
    children: [
      { titleHy: "Կաթ", titleEn: "Milk", titleRu: "Молоко" },
      { titleHy: "Պանիր", titleEn: "Cheese", titleRu: "Сыр" },
      { titleHy: "Յոգուրտ", titleEn: "Yogurt", titleRu: "Йогурт" },
      { titleHy: "Թթվամթերք", titleEn: "Fermented dairy", titleRu: "Кисломолочные" },
      { titleHy: "Դիետիկ կաթնամթերք", titleEn: "Diet dairy", titleRu: "Диетические молочные продукты" }
    ]
  },
  {
    titleHy: "Միս",
    titleEn: "Meat",
    titleRu: "Мясо",
    aliases: ["мясо", "meat", "միս"],
    children: [
      { titleHy: "Տավարի միս", titleEn: "Beef", titleRu: "Говядина" },
      { titleHy: "Խոզի միս", titleEn: "Pork", titleRu: "Свинина" },
      { titleHy: "Հավի միս", titleEn: "Chicken", titleRu: "Курица" },
      { titleHy: "Երշիկեղեն", titleEn: "Sausages", titleRu: "Колбасы" }
    ]
  },
  {
    titleHy: "Հացաբուլկեղեն",
    titleEn: "Bakery",
    titleRu: "Хлеб и выпечка",
    aliases: ["хлеб", "выпечка", "bakery", "հացաբուլկեղեն"],
    children: [
      { titleHy: "Հաց", titleEn: "Bread", titleRu: "Хлеб" },
      { titleHy: "Թխվածք", titleEn: "Pastries", titleRu: "Выпечка" },
      { titleHy: "Թխվածքաբլիթ", titleEn: "Cookies", titleRu: "Печенье" }
    ]
  },
  {
    titleHy: "Մրգեր և բանջարեղեն",
    titleEn: "Fruits and vegetables",
    titleRu: "Овощи и фрукты",
    aliases: ["овощи", "фрукты", "fruits", "vegetables", "մրգեր", "բանջարեղեն"],
    children: [
      { titleHy: "Բանջարեղեն", titleEn: "Vegetables", titleRu: "Овощи" },
      { titleHy: "Մրգեր", titleEn: "Fruits", titleRu: "Фрукты" },
      { titleHy: "Կանաչի", titleEn: "Greens", titleRu: "Зелень" }
    ]
  },
  {
    titleHy: "Խմիչքներ",
    titleEn: "Drinks",
    titleRu: "Напитки",
    aliases: ["напитки", "drinks", "խմիչքներ"],
    children: [
      { titleHy: "Ջուր", titleEn: "Water", titleRu: "Вода" },
      { titleHy: "Հյութեր", titleEn: "Juices", titleRu: "Соки" },
      { titleHy: "Զովացուցիչ ըմպելիք", titleEn: "Soft drinks", titleRu: "Газировка" }
    ]
  },
  {
    titleHy: "Մթերք",
    titleEn: "Grocery",
    titleRu: "Бакалея",
    aliases: ["бакалея", "grocery", "մթերք"],
    children: [
      { titleHy: "Մակարոնեղեն և հացահատիկ", titleEn: "Pasta and cereals", titleRu: "Крупы и макароны" },
      { titleHy: "Յուղ և սոուսներ", titleEn: "Oil and sauces", titleRu: "Масла и соусы" },
      { titleHy: "Պահածոներ", titleEn: "Canned food", titleRu: "Консервы" }
    ]
  }
];

const namesOf = (cat) =>
  [cat?.titleHy, cat?.titleEn, cat?.titleRu, cat?.title]
    .filter(Boolean)
    .map((item) => String(item).trim().toLowerCase());

const sameCategory = (cat, item) => {
  const names = namesOf(cat);
  const aliases = (item.aliases || []).map((alias) => alias.toLowerCase());
  const titles = namesOf(item);
  return [...aliases, ...titles].some((name) => names.includes(name));
};

export const findIn = (list = [], item) => list.find((cat) => sameCategory(cat, item));

const postCategory = async (item, parentCategoryId) => {
  const result = await createCategory({
    id: 0,
    titleHy: item.titleHy,
    titleEn: item.titleEn,
    titleRu: item.titleRu,
    parentCategoryId: parentCategoryId || null,
    discount: 0,
    discountType: 0
  });
  return Boolean(result?.ok);
};

const isComplete = (tree) =>
  SEED_TREE.every((main) => {
    const parent = findIn(tree, main);
    return parent && main.children.every((child) => findIn(parent.children || [], child));
  });

export const seedRealisticCategories = async () => {
  if (localStorage.getItem(SEED_FLAG) === "1") {
    return getCategories();
  }

  const existing = await getCategories(true);
  if (!Array.isArray(existing)) return [];

  let tree = normalizeCategoryTree(existing);
  let created = false;

  for (const main of SEED_TREE) {
    let parent = findIn(tree, main);
    if (!parent) {
      const ok = await postCategory(main, null);
      if (!ok) continue;
      created = true;
      tree = normalizeCategoryTree(await getCategories(true));
      parent = findIn(tree, main);
    }
    if (!parent) continue;

    for (const child of main.children) {
      if (findIn(parent.children || [], child)) continue;
      const ok = await postCategory(child, parent.id);
      if (!ok) continue;
      created = true;
      tree = normalizeCategoryTree(await getCategories(true));
      parent = tree.find((item) => item.id === parent.id) || findIn(tree, main) || parent;
    }
  }

  const latest = created ? await getCategories(true) : existing;
  tree = normalizeCategoryTree(latest);
  if (isComplete(tree)) {
    localStorage.setItem(SEED_FLAG, "1");
  }
  return latest;
};
