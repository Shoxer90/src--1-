import { memo, useEffect, useRef, useState } from "react";
import { IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";

const ChipBtn = ({ active, onClick, children }) => (
  <button
    type="button"
    className={`${styles.chipBtn} ${active ? styles.chipBtn_active : ""}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const CategorySlide = ({ children }) => {
  const [canScroll, setCanScroll] = useState({ left: false, right: false });
  const slideRef = useRef(null);

  const updateScroll = () => {
    const el = slideRef.current;
    if (!el) return;
    setCanScroll({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4
    });
  };

  useEffect(() => {
    updateScroll();
    const el = slideRef.current;
    if (!el) return undefined;
    el.addEventListener("scroll", updateScroll);
    window.addEventListener("resize", updateScroll);
    return () => {
      el.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, [children]);

  const scrollByDir = (dir) => {
    slideRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  return (
    <div className={styles.mainNav_categories}>
      {canScroll.left && (
        <IconButton size="small" onClick={() => scrollByDir(-1)} sx={{ color: "#5a5a5a", p: 0.3 }}>
          <ChevronLeftIcon />
        </IconButton>
      )}
      <div className={styles.mainNav_categorySlide} ref={slideRef}>
        {children}
      </div>
      {canScroll.right && (
        <IconButton size="small" onClick={() => scrollByDir(1)} sx={{ color: "#5a5a5a", p: 0.3 }}>
          <ChevronRightIcon />
        </IconButton>
      )}
    </div>
  );
};

const HomeCategoryBar = ({
  categories,
  selectedMainId,
  selectedSubId,
  onSelectMain,
  onSelectSub
}) => {
  const { t } = useTranslation();
  const selectedMain = categories.find((item) => item.id === selectedMainId) || null;
  const [visibleMain, setVisibleMain] = useState(selectedMain);

  useEffect(() => {
    if (selectedMain) {
      setVisibleMain(selectedMain);
      return undefined;
    }
    const timer = setTimeout(() => setVisibleMain(null), 320);
    return () => clearTimeout(timer);
  }, [selectedMain]);

  if (!categories.length) return null;

  return (
    <>
      <CategorySlide>
        <ChipBtn active={!selectedMainId} onClick={() => onSelectMain(null)}>
          {t("mainnavigation.allCategories")}
        </ChipBtn>
        {categories.map((item) => (
          <ChipBtn
            key={item.id}
            active={selectedMainId === item.id}
            onClick={() => onSelectMain(item.id)}
          >
            {item.title}
          </ChipBtn>
        ))}
      </CategorySlide>
      <div className={`${styles.categoryHeadingWrap} ${selectedMain ? styles.categoryHeadingWrap_open : ""}`}>
        <div className={styles.categoryHeading}>
          {visibleMain && (
            <>
              <h2 className={styles.categoryHeading_title}>{visibleMain.title}</h2>
              {!!visibleMain.children?.length && (
                <CategorySlide>
                  <ChipBtn active={!selectedSubId} onClick={() => onSelectSub(null)}>
                    {t("mainnavigation.allCategories")}
                  </ChipBtn>
                  {visibleMain.children.map((item) => (
                    <ChipBtn
                      key={item.id}
                      active={selectedSubId === item.id}
                      onClick={() => onSelectSub(item.id)}
                    >
                      {item.title}
                    </ChipBtn>
                  ))}
                </CategorySlide>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(HomeCategoryBar);
