import React, { memo } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import styles from "../../index.module.scss";

// services
const LeftBottomServices = ({cashiers, t}) => {
  return (
    <span className={styles.leftBottom}>
      <HomeRepairServiceIcon  sx={{m:1}} />
      <span className={styles.settingsCont_info_item} style={{fontSize:"80%"}}>
        {t("cardService.amount")}, {t("menubar.history")}
      </span>
    </span>
  )
};

export default memo(LeftBottomServices);
