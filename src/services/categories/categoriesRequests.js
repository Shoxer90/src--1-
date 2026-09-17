import axios from "axios";
import { baseUrl, getMediaOrigin, isLocalHostName, option } from "../baseUrl";

let categoriesCache = null;
let categoriesInflight = null;

export const toCategoryIds = (value) => {
  const raw = Array.isArray(value)
    ? value
    : value && typeof value === "object"
      ? [value.id]
      : value
        ? [value]
        : [];
  return raw
    .map((item) => (item && typeof item === "object" ? item.id : item))
    .map(Number)
    .filter((id) => Number.isFinite(id) && id !== 0);
};

export const getCategoryLang = () =>
  localStorage.getItem("lang") || localStorage.getItem("i18nextLng") || "hy";

export const getCategoryTitle = (cat, lang = getCategoryLang()) => {
  if (!cat) return "";
  if (lang === "ru") return cat.titleRu || cat.titleHy || cat.titleEn || cat.title || "";
  if (lang === "eng" || lang === "en") return cat.titleEn || cat.titleHy || cat.titleRu || cat.title || "";
  return cat.titleHy || cat.titleEn || cat.titleRu || cat.title || "";
};

export const getCategoryIcon = (cat) => {
  const raw = cat?.icon || cat?.Icon || cat?.iconUrl || cat?.image || cat?.photo || "";
  if (raw && typeof raw === "object") {
    return raw.url || raw.src || raw.path || "";
  }
  return typeof raw === "string" ? raw.trim() : "";
};

export const toCategoryIconSrc = (icon) => {
  const value = typeof icon === "string" ? icon.trim() : "";
  if (!value) return "";
  if (/^data:/i.test(value) || /^blob:/i.test(value)) return value;

  const mediaOrigin = getMediaOrigin();
  let url;
  try {
    url = new URL(value, `${mediaOrigin}/`);
  } catch {
    return `${mediaOrigin}/${value.replace(/^\//, "")}`;
  }

  if (isLocalHostName(url.hostname)) {
    const media = new URL(mediaOrigin);
    url.protocol = media.protocol;
    url.host = media.host;
  }
  return url.href;
};

export const collectDescendantIds = (node) => {
  if (!node?.children?.length) return [];
  return node.children.flatMap((child) => [child.id, ...collectDescendantIds(child)]);
};

export const normalizeCategoryTree = (categories = [], parentId = null, parentPath = [], lang = getCategoryLang()) =>
  (categories || []).map((cat) => {
    const title = getCategoryTitle(cat, lang);
    const path = [...parentPath, title];
    const node = {
      id: cat.id,
      title,
      titleHy: cat.titleHy || "",
      titleEn: cat.titleEn || "",
      titleRu: cat.titleRu || "",
      parentId,
      pathLabel: path.filter(Boolean).join(" / "),
      depth: parentPath.length,
      discount: cat.discount ?? 0,
      discountType: cat.discountType ?? 0,
      icon: getCategoryIcon(cat),
      children: []
    };
    node.children = normalizeCategoryTree(cat.childCategories || cat.children, cat.id, path, lang);
    return node;
  });

export const flattenCategories = (categories = []) => {
  const tree = categories[0]?.childCategories !== undefined
    ? normalizeCategoryTree(categories)
    : categories;
  const result = [];
  const walk = (nodes = []) => {
    for (const node of nodes) {
      result.push(node);
      if (node.children?.length) walk(node.children);
    }
  };
  walk(tree);
  return result;
};

export const mapCategoriesById = (categories = []) => {
  const map = {};
  flattenCategories(categories).forEach((item) => {
    map[item.id] = item;
  });
  return map;
};

export const idsWithAncestors = (id, byId = {}) => {
  const ids = [];
  const seen = new Set();
  let currentId = Number(id);
  while (Number.isFinite(currentId) && currentId !== 0 && !seen.has(currentId)) {
    seen.add(currentId);
    ids.push(currentId);
    const parentId = byId[currentId]?.parentId;
    currentId = parentId == null ? null : Number(parentId);
  }
  return ids;
};

export const expandCategoryIds = (value, byId = {}) => {
  const unique = [];
  const seen = new Set();
  toCategoryIds(value).forEach((id) => {
    idsWithAncestors(id, byId).forEach((nextId) => {
      if (!seen.has(nextId)) {
        seen.add(nextId);
        unique.push(nextId);
      }
    });
  });
  return unique;
};

export const deepestCategory = (value, byId = {}) => {
  const nodes = toCategoryIds(value)
    .map((id) => byId[id])
    .filter(Boolean);
  if (!nodes.length) return null;
  return nodes.reduce((deepest, item) => (item.depth >= deepest.depth ? item : deepest));
};

export const applyLevelChange = (selectedIds, parent, nextChildren) => {
  const nextDirect = new Set((nextChildren || []).map((child) => child.id));
  const removeIds = new Set();
  for (const child of parent?.children || []) {
    if (!nextDirect.has(child.id)) {
      removeIds.add(child.id);
      collectDescendantIds(child).forEach((id) => removeIds.add(id));
    }
  }
  const next = selectedIds.filter((id) => !removeIds.has(id));
  (nextChildren || []).forEach((child) => {
    if (!next.includes(child.id)) next.push(child.id);
  });
  if (parent?.id != null && !next.includes(parent.id)) {
    next.push(parent.id);
  }
  return next;
};

export const getCategories = async (force = false) => {
  if (!force && categoriesCache) {
    return categoriesCache;
  }
  if (!force && categoriesInflight) {
    return categoriesInflight;
  }
  categoriesInflight = axios.get(baseUrl + "Categories", option())
    .then((data) => {
      categoriesCache = Array.isArray(data?.data) ? data.data : [];
      return categoriesCache;
    })
    .catch(() => [])
    .finally(() => {
      categoriesInflight = null;
    });
  return categoriesInflight;
};

export const createCategory = async (body) => {
  try {
    const data = await axios.post(baseUrl + "Categories", body, option());
    categoriesCache = null;
    return { ok: true, data: data?.data, status: data?.status };
  } catch (err) {
    return { ok: false, status: err?.response?.status, data: err?.response?.data };
  }
};

export const updateCategory = async (id, body) => {
  try {
    const data = await axios.put(baseUrl + `Categories/${id}`, body, option());
    categoriesCache = null;
    return { ok: true, data: data?.data, status: data?.status };
  } catch (err) {
    return { ok: false, status: err?.response?.status, data: err?.response?.data };
  }
};

export const deleteCategory = async (id) => {
  try {
    const data = await axios.delete(baseUrl + `Categories/${id}`, option());
    categoriesCache = null;
    return { ok: true, data: data?.data, status: data?.status };
  } catch (err) {
    return { ok: false, status: err?.response?.status, data: err?.response?.data };
  }
};

export const extractCategoryId = (payload) => {
  if (payload == null || typeof payload !== "object") return null;
  if (typeof payload.id === "number") return payload.id;
  if (typeof payload.data?.id === "number") return payload.data.id;
  return null;
};
