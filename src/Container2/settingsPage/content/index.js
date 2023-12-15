import React, { memo, useState } from "react" ;
import Cashiers from "../cashiers/Cashiers";
import ClientCardContainer from "../serviceAmount";
import { useTranslation } from "react-i18next";

import styles from "./index.module.scss";
import { Divider } from "@mui/material";

const SettingsContent = () => {
  const [content, setContent] = useState(1);
  const {t} = useTranslation();

  return (
    <div style={{width:"100%"}}>
      <div className={styles.content_title}>
        <span className={styles.content_title_item} onClick={()=>setContent(1)} style={{color: content ? "#FFA500": "black"}}>{t("settings.cashiers")} </span>
        <span className={styles.content_title_item} onClick={()=>setContent(0)} style={{color: !content ? "#FFA500": "black"}}> {t("settings.priceListSubTitle1")}</span>
      </div>
      <Divider color="black" />
      <div  style={{width:"100%"}}>
        {
          content ? 
          <Cashiers t={t} screen={window.innerWidth} /> :
          <ClientCardContainer />
        }
      </div>
    </div>
  )
};

export default memo(SettingsContent);
