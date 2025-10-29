import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";

// 
const HdmStatus = ({status,mode}) => {
  const {t} = useTranslation();
  const [screen, setScreenWidth] = useState(window.innerWidth);

  const styling={
      width: screen<600 ? "10px":"auto",
      height: screen<600 ? "10px" : "20px",
      borderRadius:"4px",
      // backgroundColor: (status || mode !== 1) ? "green": "orangered",
      backgroundColor: mode === 0 ? "green":mode === 1 ? "orangered":mode === 2 && "orange",
      fontSize:"75%",
      color:"white",
      border:"none",
      padding: "2px 12px",
      alignText:"center",
      margin:screen<600 ?"auto":"2px"
  };
  
  window.addEventListener('resize', function(event) {
      setScreenWidth(window.innerWidth)
    }, true);

  return(
     <button style={styling}>
      {screen > 600 ?
        <>
          {mode === 0 && t("settings.ETRM")}
          {mode === 1 && t("history.receiptNoHmd")}
          {mode === 2 && t("history.hdm")}
        </>: ""
      }
      </button>

  )
};

export default memo(HdmStatus);
