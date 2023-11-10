import React, { useEffect, useState } from "react";
import { memo } from "react";
import styles from "./index.module.scss";

const ReversePrepayment = ({
  saleInfo,
  reversePrepayment, 
  setReversePrepayment, 
  setReverseTotal, 
}) => {
  const [valueForReverse,setValueForReverse] = useState();

  useEffect(() => {
    if(reversePrepayment){
      setReverseTotal(valueForReverse)
    }else{
      setReverseTotal(0)
    }
  }, [valueForReverse,reversePrepayment])

  return(
    <div className={styles.radioDialog}>
    <span  style={{width:"90%",display:"flex", margin:"3px"}}>
      <input 
        type="checkbox"
        name="isChecked"
        style={{marginRight:"10px"}}
        onChange={(e)=>{ setReversePrepayment(e.target.checked)}}
      />
      <label>
        Կանխավճարի վերադարձ
        
        <input 
          type="number" 
          style={{width:'100px',margin:"0 15px",padding:"1px 4px"}}
          name="cashAmount"
          value={valueForReverse || ""}
          onChange={(e) =>(e.target.value <= saleInfo?.res?.printResponseInfo?.totalAmount)? setValueForReverse(+e.target.value):""}
        />
      </label>
    </span> 
    </div>
  )
};

export   default memo(ReversePrepayment);

