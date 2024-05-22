import React, { memo, useState } from "react";

import styles from "../index.module.scss";
import { Button, IconButton } from "@mui/material";

const PayButtons = ({
  paymentInfo, 
  setSingleClick,
  setOpenPhonePay, 
  handleOpenPhoneDialog,
  multiSaleProducts, 
  blockTheButton,
  totalPrice,
  val,
  setBlockTheButton,
  singleClick
  
}) => {
  const [alreadyClicked,setAlreadyClick] = useState(false)

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
        if(!alreadyClicked) {
          setAlreadyClick(true)
          multiSaleProducts(1)

          } 
        }}
        // style={!val ? buttonBlock : null}
        style={!totalPrice  && !paymentInfo?.cashAmount && !paymentInfo?.cardAmount? buttonBlock : null}
      />

      <img
        src="/image/qr.png"
        alt="pay by QR"
        onClick={()=>{
          if(!alreadyClicked) {
            setAlreadyClick(true)
            multiSaleProducts(2)
          }
        }}
        style={!paymentInfo?.cardAmount ? buttonBlock : null}
      />
      <img
        src="/image/sms.png"
        alt="sms link"
        onClick={()=>{
          if(!alreadyClicked) {
            setAlreadyClick(true)
            handleOpenPhoneDialog()
          }
        }}
        style={!paymentInfo?.cardAmount ? buttonBlock : null}
      />
      <img 
        src="/image/link.png"
        alt="url" 
        onClick={()=> {
          if(!alreadyClicked) {
            setAlreadyClick(true)
            multiSaleProducts(4)
          }
        }}
        style={!paymentInfo?.cardAmount ? buttonBlock : null}
      />
    </div>
  )
};

export default memo(PayButtons);
