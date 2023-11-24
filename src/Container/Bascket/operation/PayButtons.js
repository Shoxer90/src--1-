import React, { memo } from "react";
import styles from "../index.module.scss";
import { useEffect } from "react";


const PayButtons = ({paymentInfo, setOpenPhonePay, multiSaleProducts, singleClick, setSingleClick}) => {
  const buttonBlock = {
    opacity: "0.3",
    border:"red",
    pointerEvents:"none"
  }

  return(
    <div 
      className={styles.bask_container_body_footer_icons}
      style={singleClick?.pointerEvents  && buttonBlock}
    >
      <img
        src="/image/cash.png"
        alt="cash pay"
        onClick={()=>{
          setSingleClick({pointerEvents:"none"})
          multiSaleProducts(1)
        }}
      />
      <img
        src="/image/qr.png"
        alt="pay by QR"
        onClick={()=>{
          multiSaleProducts(2)
        }}
        style={!paymentInfo?.cardAmount ? buttonBlock : {pointerEvents:"auto"}}
      />
      <img
        src="/image/sms.png"
        alt="sms link"
        onClick={()=>{
          setSingleClick({pointerEvents:"none"})
          setOpenPhonePay(true)
        }}
        style={!paymentInfo?.cardAmount ? buttonBlock : {width:"10%"}}
      />
      <img 
        src="/image/link.png"
        alt="url" 
        onClick={()=> {
          setSingleClick({pointerEvents:"none"})
          multiSaleProducts(4)
        }}
        style={!paymentInfo?.cardAmount ? buttonBlock : {width:"10%"}}
      />
    </div>
  )
};

export default memo(PayButtons);
