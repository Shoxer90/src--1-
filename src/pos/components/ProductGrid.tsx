import { memo, useEffect, useMemo, useRef, useState } from "react";
import styles from "../pos.module.scss";
import { formatAmd, formatQty } from "../money";
import { unitLabel } from "../cartMath";
import type { PosProduct } from "../types";
import { Photo } from "./Photo";

const ProductCard = memo(function ProductCard({
  product,
  onAdd,
}: {
  product: PosProduct;
  onAdd: (product: PosProduct) => void;
}) {
  const discounted = product.discountedPrice < product.price;
  const low = product.remainder < 10;
  return (
    <button type="button" className={styles.card} onClick={() => onAdd(product)}>
      <Photo src={product.photo} className={styles.thumb} alt="">
        {discounted && <span className={styles.cornerL}>Զեղչ</span>}
        {product.isEmark && <span className={styles.cornerR}>e-Mark</span>}
      </Photo>
      <span className={styles.cardName}>{product.name}</span>
      <span className={`${styles.price} ${styles.nums}`}>
        {formatAmd(product.discountedPrice)} / {unitLabel(product.measure)}
        {discounted && <span className={styles.old}>{formatAmd(product.price)}</span>}
      </span>
      <span className={styles.meta}>
        Կոդ՝ {product.innerCode || "—"} · Մնացորդ՝{" "}
        <span className={low ? styles.low : undefined}>{formatQty(product.remainder)}</span>
      </span>
      <span className={styles.meta}>Շտրիխ-կոդ՝ {product.barCode || "—"}</span>
    </button>
  );
});

export function ProductGrid({
  products,
  onAdd,
  onEnd,
}: {
  products: PosProduct[];
  onAdd: (product: PosProduct) => void;
  onEnd?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ width: 800, height: 600, scrollTop: 0 });
  const virtual = products.length > 300;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setBox((prev) => ({ ...prev, width: el.clientWidth, height: el.clientHeight }));
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const layout = useMemo(() => {
    const gap = 8;
    const cols = Math.max(1, Math.floor((box.width + gap) / (150 + gap)));
    const rowH = 188;
    const totalRows = Math.ceil(products.length / cols);
    if (!virtual) return { cols, slice: products, padTop: 0, padBottom: 0 };
    const startRow = Math.max(0, Math.floor(box.scrollTop / rowH) - 1);
    const rows = Math.ceil(box.height / rowH) + 3;
    const start = startRow * cols;
    const end = Math.min(products.length, (startRow + rows) * cols);
    return {
      cols,
      slice: products.slice(start, end),
      padTop: startRow * rowH,
      padBottom: Math.max(0, (totalRows - startRow - rows) * rowH),
    };
  }, [box.height, box.scrollTop, box.width, products, virtual]);

  return (
    <div
      ref={ref}
      className={styles.grid}
      style={virtual ? { gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))` } : undefined}
      onScroll={(event) => {
        const el = event.currentTarget;
        if (virtual) setBox((prev) => ({ ...prev, scrollTop: el.scrollTop }));
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 120) onEnd?.();
      }}
    >
      {virtual && layout.padTop > 0 && <div style={{ gridColumn: "1 / -1", height: layout.padTop }} />}
      {layout.slice.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
      {virtual && layout.padBottom > 0 && <div style={{ gridColumn: "1 / -1", height: layout.padBottom }} />}
    </div>
  );
}
