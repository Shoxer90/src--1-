import React, { memo } from "react";

import styles from "../../index.module.scss"
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';



const LeftBottom = ({mainContent}) => {
  return (
    <div className={styles.leftBottom} style={{fontSize:"80%"}}>
        <PhoneInTalkIcon sx={{m:1}} />  
        +374({mainContent?.phoneNewForm?.slice(0,2)}) {mainContent?.phoneNewForm?.slice(2, 4)}-{mainContent?.phoneNewForm?.slice(4, 6)}-{mainContent?.phoneNewForm?.slice(6,8)}
    </div>
  )
};

export default memo(LeftBottom);
