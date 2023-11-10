import React from "react";
import { memo } from "react";

import styles from "./index.module.scss";

const WelcomeClient = ({t}) => {

  return (
    <div className={styles.auth_container_welcome}>
      <div className={styles.auth_container_welcome_text}>
        <h1>{t("intro.welcome")}</h1>
        {t("intro.intro")}
        <div style={{alignItems:"center"}}>
        <div style={{padding:"0px"}}>
          <img src="/11223.png" alt=""style={{ width:"140px", padding:"0px",height:"auto"}} />
          <img src="/11230.png" alt=""style={{ width:"150px",  padding:"0px",height:"90%"}} />
        </div>
        <img src="/storexQr.png" alt="" style={{ width:"140px"}}/>

        </div>
      </div>
      <div className={styles.auth_container_welcome_img}>
        <img src= "/Img.jpg" alt="shop" />
      </div>
      
    </div>
  )
};

export default memo(WelcomeClient);
