import React, { useEffect } from "react";
import { memo } from "react";
import { BeatLoader } from "react-spinners";

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
    // close && setTimeout(() => {
    close && setTimeout(() => {
     close(false)
    },13000)
  },[]);

 return( 
  <div className={styles.loader} style={{position:"relative",display:"flex", justifyContent:"center"}}>
    <div>
      <BeatLoader
        size={25} 
        style={styles.spinnerStyle}
        margin={20}
        color="orange" 
      />
    </div>
    </div>
  )
}

export default memo(Loader);
