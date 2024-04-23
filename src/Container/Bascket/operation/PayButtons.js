import React, { memo } from "react";

import styles from "../index.module.scss";

const PayButtons = ({
  paymentInfo, 
  setSingleClick,
  setOpenPhonePay, 
  handleOpenPhoneDialog,
  multiSaleProducts, 
  blockTheButton,
  totalPrice,
  val
}) => {
  const buttonBlock = {
    opacity: "0.3",
    border:"red",
    pointerEvents:"none"
  };
  return(
    <div 
      className={styles.bask_container_body_footer_icons}
      style={blockTheButton ? buttonBlock : null}
    >
      <img
        src="/image/cash.png"
        alt="cash pay"
        onClick={()=>{
          setSingleClick({pointerEvents:"none"})
          multiSaleProducts(1)
        }}
        // style={!val ? buttonBlock : null}
        style={!totalPrice  && !paymentInfo?.cashAmount && !paymentInfo?.cardAmount? buttonBlock : null}
      />
      <img
        src="/image/qr.png"
        alt="pay by QR"
        onClick={()=>{
          setSingleClick({pointerEvents:"none"})
          multiSaleProducts(2)
        }}
        style={!paymentInfo?.cardAmount ? buttonBlock : null}
      />
      <img
        src="/image/sms.png"
        alt="sms link"
        onClick={()=>{
          setSingleClick({pointerEvents:"none"})
          handleOpenPhoneDialog()
          // setOpenPhonePay(true)
        }}
        style={!paymentInfo?.cardAmount ? buttonBlock : null}
      />
      <img 
        src="/image/link.png"
        alt="url" 
        onClick={()=> {
          setSingleClick({pointerEvents:"none"})
          multiSaleProducts(4)
        }}
        style={!paymentInfo?.cardAmount ? buttonBlock : null}
      />
    </div>
  )
};

export default memo(PayButtons);
