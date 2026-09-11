import React, { useContext, memo, useEffect, useRef } from "react";

import {LimitContext} from "../../context/Context";

import styles from "./index.module.scss";
import ExcelBurger from "./excelLoader/buttonForAdd"
import SearchBarcode from "../../SearchBarcode";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import HomeCategoryBar from "./HomeCategoryBar";

const HomeNavigation = ({
  byBarCodeSearching, 
  setOpenNewProduct, 
  setCurrentPage,
  setSearchValue,
  changeStatus,
  searchValue,
  dataGroup,
  status,
  setFrom,
  from,
  setContent,
  categories,
  selectedMainId,
  selectedSubId,
  onSelectMain,
  onSelectSub,
}) => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  
  const {limitedUsing} = useContext(LimitContext);
  const navRef = useRef(null);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return undefined;
    const syncOffset = () => {
      const bottom = Math.ceil(el.getBoundingClientRect().bottom);
      document.documentElement.style.setProperty("--home-nav-offset", `${bottom}px`);
    };
    const observer = new ResizeObserver(syncOffset);
    observer.observe(el);
    window.addEventListener("resize", syncOffset);
    syncOffset();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncOffset);
      document.documentElement.style.removeProperty("--home-nav-offset");
    };
  }, []);
  
  const  handleSendQuery = async(str, index) => {
    navigate(`/prods?status=${str}&page=1`)
    setSearchValue("")
    await setCurrentPage(1)
    changeStatus(str,index)
  };

  return(
    <div onKeyDown={(e)=>{
      if(e.key === "Enter") {
        e.preventDefault()
        byBarCodeSearching(dataGroup,searchValue)
      }}}
    >
    <div className={styles.mainNav} ref={navRef}>
      <div className={styles.mainNav_top}>
        <div className={styles.mainNav_btn}>
          <div className={styles.statusGroup}>
            <button
              type="button"
              className={`${styles.statusChip} ${status === "GetAvailableProducts" ? styles.statusChip_active : ""}`}
              onClick={()=>handleSendQuery("GetAvailableProducts", 0)}
            >
              {t("mainnavigation.available")}
              {t("mainnavigation.prod")}
            </button>
            <button
              type="button"
              className={`${styles.statusChip} ${status === "GetNotAvailableProducts" ? styles.statusChip_active : ""}`}
              onClick={()=>handleSendQuery("GetNotAvailableProducts",1)}
            >
              {t("mainnavigation.notavailable")}
              {t("mainnavigation.prod")}
            </button>
            <button
              type="button"
              className={`${styles.statusChip} ${status === "GetFavoriteProducts" ? styles.statusChip_active : ""}`}
              onClick={()=>handleSendQuery("GetFavoriteProducts", 2)}
            >
              {t("mainnavigation.favourite")}
              {t("mainnavigation.prod")}
            </button>
          </div>
        </div>
        <div className={styles.mainNav_actions}>
          <div className={styles.mainNav_search}>
            <SearchBarcode
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              byBarCodeSearching={byBarCodeSearching}
              setFrom={setFrom}
              stringFrom="main"
              from={from}
              dataGroup={status}
            />
          </div>
          { !limitedUsing && <ExcelBurger t={t} setOpenNewProduct={setOpenNewProduct}/> }
        </div>
      </div>
      <HomeCategoryBar
        categories={categories}
        selectedMainId={selectedMainId}
        selectedSubId={selectedSubId}
        onSelectMain={onSelectMain}
        onSelectSub={onSelectSub}
      />
    </div>
  </div>
  )
};

export default memo(HomeNavigation);
