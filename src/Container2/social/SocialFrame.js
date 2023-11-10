import React, { memo } from "react";
import styles from "./index.module.scss";


const SocialFrame = ({children, color, w}) => {
 return (
    <div className={styles.socialMedia} style={{background:color, width:`${w/4.5}px`,height:`${w/4.5}px`}} >
      {children}
    </div>
 )
};

export default memo(SocialFrame);
