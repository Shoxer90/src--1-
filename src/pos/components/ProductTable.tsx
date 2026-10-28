import { memo, useMemo, useRef, useState, useEffect } from "react";
import styles from "../pos.module.scss";
import { formatAmd, formatQty } from "../money";
import { unitLabel } from "../cartMath";
import type { PosProduct } from "../types";

const Row = memo(function Row({
  product,
  onAdd,
}: {
  product: PosProduct;
  onAdd: (product: PosProduct) => void;
}) {
  const low = product.remainder < 10;
  return (
    <tr>
      <td>
        {product.photo ? (
          <img className={styles.tableImg} src={product.photo} alt="" />
        ) : (
          <span className={styles.meta}>Նկար չկա</span>
        )}
      </td>
      <td>
        <div className={styles.cardName}>{product.name}</div>
        <div className={styles.meta}>{product.category}</div>
      </td>
      <td className={styles.nums}>{product.innerCode || "—"}</td>
      <td className={styles.nums}>{product.barCode || "—"}</td>
      <td className={styles.nums}>
        {formatAmd(product.discountedPrice)} / {unitLabel(product.measure)}
      </td>
      <td className={`${styles.nums} ${low ? styles.low : ""}`}>{formatQty(product.remainder)}</td>
      <td>
        <button type="button" className={styles.addBtn} onClick={() => onAdd(product)}>
          + Ավելացնել
        </button>
      </td>
    </tr>
  );
});

export function ProductTable({
  products,
  onAdd,
  onEnd,
}: {
  products: PosProduct[];
  onAdd: (product: PosProduct) => void;
  onEnd?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [height, setHeight] = useState(500);
  const virtual = products.length > 300;
  const rowH = 52;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setHeight(el.clientHeight);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const slice = useMemo(() => {
    if (!virtual) return { items: products, pad: 0, tail: 0 };
    const start = Math.max(0, Math.floor(scrollTop / rowH) - 2);
    const count = Math.ceil(height / rowH) + 6;
    return {
      items: products.slice(start, start + count),
      pad: start * rowH,
      tail: Math.max(0, (products.length - start - count) * rowH),
    };
  }, [height, products, scrollTop, virtual]);

  return (
    <div
      ref={ref}
      className={styles.tableWrap}
      onScroll={(event) => {
        if (virtual) setScrollTop(event.currentTarget.scrollTop);
        const el = event.currentTarget;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 120) onEnd?.();
      }}
    >
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Նկար</th>
            <th>Անուն</th>
            <th>Կոդ</th>
            <th>Շտրիխ-կոդ</th>
            <th>Գին</th>
            <th>Մնացորդ</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {slice.pad > 0 && (
            <tr><td colSpan={7} style={{ height: slice.pad, padding: 0 }} /></tr>
          )}
          {slice.items.map((product) => (
            <Row key={product.id} product={product} onAdd={onAdd} />
          ))}
          {slice.tail > 0 && (
            <tr><td colSpan={7} style={{ height: slice.tail, padding: 0 }} /></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
