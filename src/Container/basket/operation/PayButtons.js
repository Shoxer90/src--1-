import React, { memo, useState } from "react";

import styles from "../index.module.scss";

const PayButtons = ({
  paymentInfo, 
  handleOpenPhoneDialog,
  multiSaleProducts, 
  closePrePaymentSale,
  blockTheButton,
  totalPrice,
  singleClick,
  setSingleClick
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
        if(!singleClick?.pointerEvents) {
          setSingleClick(buttonBlock)
            multiSaleProducts(1)
          } 
        }}
        style={(!totalPrice  && !paymentInfo?.cashAmount && !paymentInfo?.cardAmount) ||
          (totalPrice-paymentInfo?.prePaymentAmount === paymentInfo?.cardAmount)  || !paymentInfo?.cashAmount ?
          buttonBlock : null
        }
      />
      <img
        src="/image/card.png"
        alt="card pay"
        onClick={()=>{
          
        if(!singleClick?.pointerEvents) {
          setSingleClick(buttonBlock)
            multiSaleProducts(1)
        }
        }}
        style={paymentInfo?.cardAmount ? null: buttonBlock}
        // style={totalPrice-paymentInfo?.prePaymentAmount !== paymentInfo?.cardAmount? buttonBlock : null}
      />

      <img
        src="/image/qr.png"
        alt="pay by QR"
        onClick={()=>{
          if(!singleClick?.pointerEvents) {
            setSingleClick(buttonBlock)
            // multiSaleProducts(2)
            localStorage.setItem("fromQRpay", false)
            multiSaleProducts(4)
          }
        }}
        style={!paymentInfo?.cardAmount ? buttonBlock : null}
      />
      <img
        src="/image/sms.png"
        alt="sms link"
        onClick={()=>{
          if(!singleClick?.pointerEvents) {
            setSingleClick(buttonBlock)
            handleOpenPhoneDialog()
          }
        }}
        style={!paymentInfo?.cardAmount ? buttonBlock : null}
      />
      <img 
        src="/image/link.png"
        alt="url" 
        onClick={()=> {
          if(!singleClick?.pointerEvents) {
            setSingleClick(buttonBlock)
            localStorage.setItem("fromQRpay", true)
            multiSaleProducts(4)
          }
        }}
        style={!paymentInfo?.cardAmount ? buttonBlock : null}
      />
    </div>
  )
};

export default memo(PayButtons);
