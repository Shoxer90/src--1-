import React, { memo, useState , useEffect } from "react";
import { useLocation } from "react-router-dom";
import LangSelect from "../../../Container2/langSelect";
import { useTranslation } from "react-i18next";
import PassChange from "./PassChange";

const ResetPassword = () => {
  const {t} = useTranslation();
  const search = useLocation().search;
  const [tokenBase64, setToken] = useState();

  useEffect(() => {
    setToken(new URLSearchParams(search).get('token'))
  }, []);
  
  return(
    <div style={{minWidth:"50dvw", padding:"20px"}}>
      <div style={{display:"flex", justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
        <span style={{color:"orange",fontSize:"130%",fontWeight:600, textAlign:"start"}}>{t("settings.changepassword")}</span>
        <LangSelect size={"22px"} />
      </div>
      <PassChange token={tokenBase64} />
    </div>
  )
};

export default memo(ResetPassword);
