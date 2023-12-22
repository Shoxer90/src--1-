import React, { memo } from "react";

import styles from "../../index.module.scss"
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';



const LeftBottom = ({mainContent}) => {
  return (
    <span className={styles.leftBottom}>
      <PhoneInTalkIcon sx={{m:1}} />
      <span className={styles.settingsCont_info_item}>
        +374({mainContent?.phoneNewForm?.slice(0,2)}) {mainContent?.phoneNewForm?.slice(2, 4)}-{mainContent?.phoneNewForm?.slice(4, 6)}-{mainContent?.phoneNewForm?.slice(6,8)}
      </span>
     
    </span>
  )
};

export default memo(LeftBottom);
