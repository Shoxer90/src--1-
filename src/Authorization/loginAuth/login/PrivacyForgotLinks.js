import { useNavigate } from "react-router-dom";
import { memo } from "react";
import { useTranslation } from "react-i18next";

const PrivacyForgotLinks = () => {
  const navigate = useNavigate();
  const {t} = useTranslation();


  return(
    <div style={{display:"flex",justifyContent:"flex-start", flexFlow:"column", fontWeight: 600,margin:"0px",padding:"0px"}}>
      <div style={{margin:"2px", width:'fit-content'}}>
        <a style={{color:"orange"}} href="/privacy_policy">{t("intro.privacyPolicy")}</a>
      </div >
    
      <div style={{margin:"2px", width:'fit-content', textDecoration:"none"}} onClick={() => navigate("/forgot-password")}>
      <a style={{color:"#3FB68A"}} href="/forgot-password">
        {t("authorize.forgot")}
      </a>
      </div> 
    </div>
  )
};

export default memo(PrivacyForgotLinks);
