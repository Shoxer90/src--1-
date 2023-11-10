import React, { useContext, memo, useEffect } from "react";

import { Button } from "@mui/material";
import {LimitContext} from "../../context/Context";

import styles from "./index.module.scss";
import ExcelBurger from "./excelLoader/buttonForAdd"
import useDebonce from "../hooks/useDebonce";
import SearchBarcode from "../../SearchBarcode";

const HomeNavigation = ({
  byBarCodeSearching, 
  setOpenNewProduct, 
  setCurrentPage,
  setSearchValue,
  changeStatus,
  searchValue,
  setMessage,
  focusInput,
  dataGroup,
  setFrom,
  t, 
}) => {
  const {limitedUsing} = useContext(LimitContext);

  const  handleSendQuery = async(str, index) => {
    setMessage("")
    await setCurrentPage(1)
    changeStatus(str,index)
  };
  useEffect(() => {
 console.log(focusInput,"REFF")
  }, [])

  return(
    <div onKeyDown={(e)=>{
      if(e.key === "Enter") {
        e.preventDefault()
        byBarCodeSearching(searchValue)
      }}}
    >
    <div className={styles.mainNav}>
      <div className={styles.maninNav_btn}>
      <Button 
        variant="contained" 
        onClick={()=>handleSendQuery("GetAvailableProducts", 0)} 
        style={{
          background:(dataGroup === "GetAvailableProducts"? "#FFA500" : "gray"),
          color:"white",
          height:"33px",
          fontSize:"small",
          margin:"5px"
        }}
      >
        {t("mainnavigation.available")}
        {t("mainnavigation.prod")}
      </Button>
        <Button 
          variant="contained" 
          onClick={()=>handleSendQuery("GetNotAvailableProducts", 1)} 
          style={{
            background:(dataGroup === "GetNotAvailableProducts"? "#FFA500" : "gray"),
            height:"33px",
            fontSize:"small",
            margin:"5px"
          }}
        >
          {t("mainnavigation.notavailable")}
          {t("mainnavigation.prod")}
        </Button>
        <Button 
          variant="contained" 
          onClick={()=>handleSendQuery("GetFavoriteProducts", 2)} 
          style={{
            background:(dataGroup === "GetFavoriteProducts"? "#FFA500" : "gray"),
            height:"33px",
            fontSize:"small",
            margin:"5px"
          }}
        >
         {t("mainnavigation.favourite")}
         {t("mainnavigation.prod")}
        </Button>
      </div>
      <SearchBarcode
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        byBarCodeSearching={byBarCodeSearching}
        setFrom={setFrom}
        stringFrom="main"
        ref={focusInput}
      />
     
      { !limitedUsing && <ExcelBurger t={t} setOpenNewProduct={setOpenNewProduct}/> }
    </div>
  </div>
  )
};

export default memo(HomeNavigation);
