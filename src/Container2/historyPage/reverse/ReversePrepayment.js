import React, { useEffect, useState, memo } from "react";
import { t } from "i18next";

import styles from "./index.module.scss";

const ReversePrepayment = ({
  saleInfo,
  reversePrepayment, 
  setReversePrepayment, 
  setReverseTotal, 
}) => {
  const [valueForReverse,setValueForReverse] = useState("");

  const handleChangeForReverse = (e) => {
    if(e.target.value <= saleInfo?.res?.printResponseInfo?.totalAmount){
      return onlyNumberAndADot(e.target.value)
    }else{
      return
    }
  }

  const onlyNumberAndADot = (value) => {
    const valid = /^\d*\.?(?:\d{1,2})?$/ 
    let text = value; 
    if(valid.test(text)){
      if(value[value.length - 1] === "." ||
        (value[value.length-1] === "0" && value[value.length-2] === ".")
      ) {
        return setValueForReverse(value)
      }
        return setValueForReverse(+value)
    } 
  };

  useEffect(() => {
    if(reversePrepayment){
      setReverseTotal(valueForReverse)
    }else{
      setReverseTotal(0)
    }
  }, [valueForReverse, reversePrepayment]);

  useEffect(() => {
    setValueForReverse(saleInfo?.res?.printResponseInfo?.totalAmount)
  }, []);

  return(
    <div className={styles.radioDialog}>
    <span  style={{width:"90%",display:"flex", margin:"3px"}}>
      <input 
        type="checkbox"
        name="isChecked"
        value={reversePrepayment}
        style={{marginRight:"10px"}}
        onChange={(e)=>{ setReversePrepayment(e.target.checked)}}
      />
      <label>
        {t("basket.useprepayment")}
        <input 
          autoComplete="off"
          style={{width:'100px',margin:"0 15px",padding:"1px 4px"}}
          name="cashAmount"
          value={valueForReverse}
          onChange={(e) => handleChangeForReverse(e)}
        />
      </label>
    </span> 
    </div>
  )
};

export   default memo(ReversePrepayment);
