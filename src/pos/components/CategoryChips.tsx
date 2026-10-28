import styles from "../pos.module.scss";

export function CategoryChips({
  categories,
  activeId,
  onChange,
}: {
  categories: { id: number; title: string }[];
  activeId: number | null;
  onChange: (id: number | null) => void;
}) {
  return (
    <div className={styles.chips} role="tablist" aria-label="Կատեգորիաներ">
      <button type="button" className={`${styles.chip} ${activeId == null ? styles.chipActive : ""}`} onClick={() => onChange(null)}>
        Բոլորը
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className={`${styles.chip} ${activeId === category.id ? styles.chipActive : ""}`}
          onClick={() => onChange(category.id)}
        >
          {category.title}
        </button>
      ))}
    </div>
  );
}
