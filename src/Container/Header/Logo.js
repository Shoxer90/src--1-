import React, { memo } from "react";

import styles from "./index.module.scss";

const Logo = () => {

  return (
    <div className={styles.headerLogo}>
      <img src="/StoreXLogo.jpg" alt="StoreX" style={{border:"solid #3FB68A 2px",margin:"2px"}}/>
      <div>
        <h2 className={styles.headerLogo_title}>StoreX </h2>
      </div>
    </div>
  )
};

export default memo(Logo);
