import React, { memo } from "react";

import styles from "./index.module.scss";

const Logo = () => {

  return (
    <div className={styles.headerLogo}>
      <img src="/StoreXLogo.jpg" alt="StoreX" />
      <div>
        <h2 className={styles.headerLogo_title}>StoreX </h2>
      </div>
    </div>
  )
};

export default memo(Logo);
