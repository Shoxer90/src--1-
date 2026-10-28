import { useEffect, useRef, useState, type RefObject } from "react";
import styles from "../pos.module.scss";
import { loadCategories, loadProductPage, searchCatalog } from "../api";
import { setView, usePos } from "../PosContext";
import type { PosProduct } from "../types";
import { ScanInput } from "./ScanInput";
import { ViewToggle } from "./ViewToggle";
import { CategoryChips } from "./CategoryChips";
import { ProductGrid } from "./ProductGrid";
import { ProductTable } from "./ProductTable";
import { ScannerMode } from "./ScannerMode";
import CreateProducts from "./CreateProducts";

export function ProductPanel({
  scanRef,
  onAdd,
  onScan,
  isAdmin,
  measure,
}: {
  scanRef: RefObject<HTMLInputElement>;
  onAdd: (product: PosProduct) => void;
  onScan: (raw: string) => void;
  isAdmin?: boolean;
  measure?: unknown[];
}) {
  const pos = usePos();
  const { view, categoryId, query } = pos.state.ui;
  const [categories, setCategories] = useState<{ id: number; title: string }[]>([]);
  const [products, setProducts] = useState<PosProduct[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searching, setSearching] = useState(false);
  const [catalogVersion, setCatalogVersion] = useState(0);
  const loadingMore = useRef(false);

  useEffect(() => {
    loadCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const text = query.trim();
    if (text) {
      setSearching(true);
      const timer = window.setTimeout(() => {
        searchCatalog(text, categoryId).then((items) => {
          setProducts(items);
          pos.rememberProducts(items);
          setSearching(false);
        });
      }, 200);
      return () => window.clearTimeout(timer);
    }
    let ignore = false;
    setSearching(false);
    setPage(1);
    loadProductPage(1, categoryId).then((res) => {
      if (ignore) return;
      setProducts(res.items);
      setTotal(res.total);
      pos.rememberProducts(res.items);
    });
    return () => {
      ignore = true;
    };
  }, [query, categoryId, catalogVersion, pos.rememberProducts]);

  const loadMore = () => {
    if (query.trim() || loadingMore.current || products.length >= total) return;
    loadingMore.current = true;
    const next = page + 1;
    setPage(next);
    loadProductPage(next, categoryId).then((res) => {
      setProducts((prev) => {
        const map = new Map(prev.map((item) => [item.id, item]));
        res.items.forEach((item) => map.set(item.id, item));
        pos.rememberProducts(res.items);
        return Array.from(map.values());
      });
      setTotal(res.total || total);
    }).finally(() => {
      loadingMore.current = false;
    });
  };

  const last = pos.state.cart.lastAdded;
  const lastLine = pos.state.cart.lines.find((line) => line.product.id === last?.productId);
  const shown = products;

  return (
    <section className={styles.products} aria-label="Ապրանքներ">
      <ScanInput
        inputRef={scanRef}
        value={query}
        onChange={(value) => pos.dispatch({ type: "ui", ui: { query: value } })}
        onSubmit={() => onScan(query)}
      />
      {pos.state.cart.alert && <div className={styles.alert} role="alert">{pos.state.cart.alert}</div>}
      <div className={styles.scanRow}>
        <ViewToggle
          value={view}
          onChange={(next) => setView(pos.dispatch, pos.cashierKey, next)}
        />
        {isAdmin && (
          <div style={{ marginLeft: "auto" }}>
            <CreateProducts measure={measure} onCreated={() => setCatalogVersion((value) => value + 1)} />
          </div>
        )}
      </div>
      {view !== "scanner" && (
        <CategoryChips
          categories={categories}
          activeId={categoryId}
          onChange={(id) => pos.dispatch({ type: "ui", ui: { categoryId: id } })}
        />
      )}
      <div className={styles.grow} style={{ minHeight: 0, display: "flex" }}>
        {view === "scanner" ? (
          <ScannerMode
            product={lastLine?.product || null}
            added={last?.qty || 0}
            inReceipt={lastLine?.qty || 0}
          />
        ) : searching && !shown.length ? (
          <div className={styles.muted}>...</div>
        ) : view === "list" ? (
          <ProductTable products={shown} onAdd={onAdd} onEnd={loadMore} />
        ) : (
          <ProductGrid products={shown} onAdd={onAdd} onEnd={loadMore} />
        )}
      </div>
    </section>
  );
}
