import React from "react";
import styles from "./index.module.scss";

const PayXInfo = ({t}) => {
  return (
    <div className={styles.payxInfo}> 
      <span style={{fontSize:"80%",fontWeight:"700",color:"rgb(17, 46, 17)"}}>{t("settings.phone")} : +(374)55 522 225</span>
      <span style={{fontSize:"80%",fontWeight:"700",color:"rgb(17, 46, 17)"}}>{t("settings.email")} : info@payx.am</span>
      <span style={{fontSize:"80%",fontWeight:"700",color:"rgb(17, 46, 17)"}}>{t("settings.adressText")}</span>
    </div>
  )
};

export default PayXInfo;
