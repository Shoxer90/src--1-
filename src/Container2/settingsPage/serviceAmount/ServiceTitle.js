import React, { memo } from "react";

import styles from "./index.module.scss";


const ServiceTitle = ({title,rightSide}) => {
  return(
    // <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"20px"}} >
    <div className={styles.titleRow} >
      <h3 style={{fontWeight:700}}>
        {title}
      </h3>
      {rightSide}
    </div>
  )
};

export default memo(ServiceTitle);
