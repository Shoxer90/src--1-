import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import ImageUser from "../../ImageUser";

import styles from "../../index.module.scss";

// services
const LeftTopServices = ({cashiers}) => {
  const {t} = useTranslation();
  
  return (
    <div className={styles.leftTop_div}>
      <ImageUser  img="/photo_2023-12-19_15-48-27.jpg" />
      <div className={styles.leftTop_div_title}>
        <div style={{color:"#5a5a5a"}}>
          {t("cardService.btnTitle")}
        </div>
      </div>
    </div>
  )
};

export default memo(LeftTopServices);
