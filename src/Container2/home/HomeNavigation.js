import React, { useContext, memo } from "react";

import { Button } from "@mui/material";
import {LimitContext} from "../../context/Context";

import styles from "./index.module.scss";
import ExcelBurger from "./excelLoader/buttonForAdd"
import SearchBarcode from "../../SearchBarcode";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

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
  setContent,
}) => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  
  const {limitedUsing} = useContext(LimitContext);
  
  const  handleSendQuery = async(str, index) => {
    navigate(`/prods?status=${str}&page=1`)
    setSearchValue("")
    setContent([])
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
    <div className={styles.mainNav}>
      <div className={styles.maninNav_btn}>
      <Button 
        variant="contained" 
        onClick={()=>handleSendQuery("GetAvailableProducts", 0)} 
        style={{
          background:(status === "GetAvailableProducts"? "#FFA500" : "gray"),
          color:"white",
          height:"33px",
          fontSize:"small",
          margin:"5px",
          textTransform: "capitalize"
        }}
      >
        {t("mainnavigation.available")}
        {t("mainnavigation.prod")}
      </Button>
        <Button 
          variant="contained" 
          onClick={()=>handleSendQuery("GetNotAvailableProducts",1)} 
          style={{
            background:(status === "GetNotAvailableProducts"? "#FFA500" : "gray"),
            height:"33px",
            fontSize:"small",
            margin:"5px",
            textTransform: "capitalize"
          }}
        >
          {t("mainnavigation.notavailable")}
          {t("mainnavigation.prod")}
        </Button>
        <Button 
          variant="contained" 
          onClick={()=>handleSendQuery("GetFavoriteProducts", 2)} 
          style={{
            background:(status === "GetFavoriteProducts"? "#FFA500" : "gray"),
            height:"33px",
            fontSize:"small",
            margin:"5px",
            textTransform: "capitalize"
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
        dataGroup={status}
      />
      { !limitedUsing && <ExcelBurger t={t} setOpenNewProduct={setOpenNewProduct}/> }
    </div>
  </div>
  )
};

export default memo(HomeNavigation);
