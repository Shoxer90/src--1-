import React, { memo } from "react";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';

import styles from "../../index.module.scss"

// cashiere
const RightBottom = ({mainContent}) => {
  return (
    <div className={styles.leftBottom}>
        <AlternateEmailIcon sx={{m:1}} />
        {mainContent?.email}
      </div>
  )
};

export default memo(RightBottom);
