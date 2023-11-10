import React, { memo } from "react";
import styles from "./index.module.scss";

const FormTitle = ({operation}) => {
  return (
    <div className={styles.formTitle}>
      <img src="/StoreXLogo.jpg" alt="logo" />
      <h1>{operation}</h1> 
    </div>
  )
};

export default memo(FormTitle);
