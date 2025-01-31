import React, { memo } from "react";

import styles from "./index.module.scss";

const Logo = () => {

  return (
  //  <div className={styles.headerLogo}>
  //    <img src="/StoreXLogo.jpg" alt="StoreX" style={{padding:"3px 2px",marginLeft:"15px", height: "70%"}}/>
  //     <div>
  //       <h2 className={styles.headerLogo_title}>StoreX </h2>
  //     </div> 
     
  //   </div>
   <div className={styles.headerLogo}>

    <img 
      src="/0001.jpg" 
      alt="StoreX" 
      style={{padding:"3px 2px",marginLeft:"15px",height:"60px"}}
    />
  </div>
  )
};

export default memo(Logo);
