import React, { memo } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import styles from "../../index.module.scss";

// cashiere
const LeftBottomCashiers = ({cashiers, t}) => {
  return (
    <span className={styles.leftBottom}>
      <AccountCircleIcon  sx={{m:1}} />
      <span className={styles.settingsCont_info_item}>
        {cashiers?.length} {t("settings.cashier")}
      </span>
    </span>
  )
};

export default memo(LeftBottomCashiers);
