import React, { memo, useState } from "react";
import styles from "./index.module.scss";


const BasketPay = ({qashCardPayment, payByQr, phonePay, payByUrl,singleClick,setSingleClick}) => {


  return(
    <div 
      className={styles.bask_container_body_footer_icons}
      style={singleClick  || {}}
     >
      <img
        src="/image/cash.png"
        alt="cash pay"
        onClick={()=>{
          setSingleClick({pointerEvents:"none"})
          qashCardPayment(1)
        }}
      />
      <img
        src="/image/card.png"
        alt="card pay"
        onClick={()=>{
          setSingleClick({pointerEvents:"none"})
          qashCardPayment(2)
        }}
      />
      <img
        src="/image/qr.png"
        alt="pay by QR"
        onClick={()=>{
          setSingleClick({pointerEvents:"none"})
          payByQr()
        }}
      />
      <img
        src="/image/sms.png"
        alt="sms link"
        onClick={phonePay}
      />
      <img 
        src="/image/link.png"
        alt="url" 
        onClick={()=> {
          setSingleClick({pointerEvents:"none"})
          payByUrl()
        }}
      />
    </div>
  )
};

export default memo(BasketPay);