import React, { memo, useEffect } from "react" ;
import { useTranslation } from "react-i18next";

import { Button } from "@mui/material";
import IOSSwitch from "../../../../modules/iosswitch";

import { autoPaymentSwitch } from "../../../../services/internal/InternalPayments";

const AutoPaymentSwitch = ({
  payData, 
  setPayData, 
  hasAutoPayment, 
  setMessage,
  isDefaultExist
}) => {
  
  const {t} = useTranslation();

  const switchSetBinding = async(bool) => {
    if(isDefaultExist){
      if(bool) {
        setMessage({message:t("cardService.isBindTrue"), type:"success"})
      }else {
        setMessage({message:t("cardService.isBindFalse"), type:"success"})
      } 
      await autoPaymentSwitch(bool)
      return setPayData({
        ...payData,
        isBinding: bool
      })
    }else{
      setMessage({message:t("cardService.cantBind"), type:"info"})
    }
  };

  useEffect(() => {
    hasAutoPayment && switchSetBinding(hasAutoPayment)
  },[]);

  return (
    <Button 
      size="small"
      style={{ backgroundColor: 'transparent' }}
      onClick={() => {
        if(!isDefaultExist){
          switchSetBinding(false)
        }
      }}
      startIcon={ <IOSSwitch 
        checked={payData?.isBinding}
        disabled={!isDefaultExist}
        onChange={(e)=>{
          switchSetBinding(e.target.checked)
        }}
      />}
    >
      <span style={{fontSize:"75%"}}>
        {t("cardService.authomatic")}
      </span>
    </Button>
  )
};

export default memo(AutoPaymentSwitch);
