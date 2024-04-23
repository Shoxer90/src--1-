import React, { memo } from "react";

import styles from "./index.module.scss";

const ServiceTitle = ({title}) => {
  return(
    <div className={styles.titleRow}>
      <h3>
        {title}
      </h3>
    </div>
  )
};

export default memo(ServiceTitle);
