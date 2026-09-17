import { memo, useEffect, useRef, useState } from "react";
import { IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";
import CategorySettingsDialog from "./CategorySettingsDialog";
import { toCategoryIconSrc } from "../../services/categories/categoriesRequests";

const UNCATEGORIZED_ID = 0;

const ChipBtn = ({ active, onClick, icon, children }) => {
  const iconSrc = toCategoryIconSrc(icon);
  return (
    <button
      type="button"
      className={`${styles.chipBtn} ${iconSrc ? styles.chipBtn_withIcon : ""} ${active ? styles.chipBtn_active : ""}`}
      onClick={onClick}
    >
      {iconSrc ? (
        <img
          src={iconSrc}
          alt=""
          className={styles.chipBtn_icon}
          onError={(event) => { event.currentTarget.style.display = "none"; }}
        />
      ) : null}
      <span className={styles.chipBtn_label}>{children}</span>
    </button>
  );
};

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
  onSelectSub,
  onCategoriesChange,
  showSettings,
  bulkSelectMode,
  selectedCount = 0,
  onToggleBulkSelect,
  onRequestBulkDelete,
}) => {
  const { t } = useTranslation();
  const [openSettings, setOpenSettings] = useState(false);
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

  return (
    <>
      <div className={styles.categoryBarRow}>
        <CategorySlide>
          <ChipBtn active={selectedMainId == null} onClick={() => onSelectMain(null)}>
            {t("mainnavigation.allCategories")}
          </ChipBtn>
          {categories.map((item) => (
            <ChipBtn
              key={item.id}
              icon={item.icon}
              active={selectedMainId === item.id}
              onClick={() => onSelectMain(item.id)}
            >
              {item.title}
            </ChipBtn>
          ))}
          <ChipBtn
            active={selectedMainId === UNCATEGORIZED_ID}
            onClick={() => onSelectMain(UNCATEGORIZED_ID)}
          >
            {t("mainnavigation.uncategorized")}
          </ChipBtn>
        </CategorySlide>
        {showSettings && (
          <div className={styles.categoryBarActions}>
            {selectedCount > 0 ? (
              <button
                type="button"
                className={styles.bulkDeleteBtn}
                onClick={onRequestBulkDelete}
              >
                {t("productinputs.deleteSelectedProducts")}
              </button>
            ) : (
              <IconButton
                size="small"
                className={`${styles.categorySettingsBtn} ${bulkSelectMode ? styles.categorySettingsBtn_active : ""}`}
                title={t("productinputs.selectProductsToDelete")}
                onClick={onToggleBulkSelect}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton
              size="small"
              className={styles.categorySettingsBtn}
              title={t("productinputs.categorySettings")}
              onClick={() => setOpenSettings(true)}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </div>
        )}
      </div>
      <div className={`${styles.categoryHeadingWrap} ${selectedMain ? styles.categoryHeadingWrap_open : ""}`}>
        <div className={styles.categoryHeading}>
          {visibleMain && (
            <>
              <h2 className={styles.categoryHeading_title}>{visibleMain.title}</h2>
              <CategorySlide>
                <ChipBtn active={selectedSubId == null} onClick={() => onSelectSub(null)}>
                  {t("mainnavigation.allCategories")}
                </ChipBtn>
                {(visibleMain.children || []).map((item) => (
                  <ChipBtn
                    key={item.id}
                    icon={item.icon}
                    active={selectedSubId === item.id}
                    onClick={() => onSelectSub(item.id)}
                  >
                    {item.title}
                  </ChipBtn>
                ))}
              </CategorySlide>
            </>
          )}
        </div>
      </div>
      <CategorySettingsDialog
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        onChanged={onCategoriesChange}
      />
    </>
  );
};

export default memo(HomeCategoryBar);
