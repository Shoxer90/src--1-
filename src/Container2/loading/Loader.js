import React, { useEffect, useState } from "react";
import { memo } from "react";
import { BeatLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";

const Loader = ({close}) => {

  const styles={ 
    spinnerStyle: {
      flex: 1,
      justifyContent: 'center',
      alignItems:'center',
      xIndex:2
    }
  };
  
  useEffect(() => {
    close && setTimeout(() => {
     close(false)
    },13000)
  },[]);

 return( 
  <div className={styles.loader} >
      <BeatLoader
        size={25} style={styles.spinnerStyle}
        margin={20}
        color="orange" 
      />
    </div>
  )
}

export default memo(Loader);
