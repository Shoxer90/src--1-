import React, { memo, useState } from "react";
import { Button, Card, FormControlLabel } from "@mui/material";
import PaymentConfirm from "../paymentDialog/PaymentConfirm";

import styles from "./index.module.scss";

const ServiceItemSecond = ({
  t,
  content,
  service,
  userCardInfo,
  changeActiveCard,
}) => {
  const [openDialogForPay,setOpenDialogForPay] = useState(false);

  const [payData,setPayData] = useState({
    serviceType: service?.id,
    price: service?.price,
    // isBinding: service?.userServicePayment[service?.userServicePayment.length-1]?.isBinding === true ? true : false
  });

  const disableStyle={
    // pointerEvents: "none",
    opacity: 0.3
  }

  const handleChangeAmountForPay = (val) => {
    const valid = /^\d*\.?(?:\d{1,2})?$/;
    const text = val;  
    if(valid.test(text)){
      setPayData({
        ...payData,
        price: val
      })
    }else{
      return 
    }
  };

  console.log(payData,"payData");

  return (
    <>
      <Card 
        sx={{ p:1.1,boxShadow:5,borderRadius:"8px"}} 
        className={styles.service_item}
        style={!service?.isActive ? disableStyle: null}
      >
        <FormControlLabel
          labelPlacement="start" 
          className={styles.service_item_hightSwitch}
          sx={{m:0,p:.7}}
          control={
            <Button 
              variant="contained" 
              size="small" 
              onClick={()=>{
               return service?.isActive ?
                setOpenDialogForPay(true) : alert("For more info please call PayX")
              }}
            >
              {t("basket.linkPayment")}
            </Button>
          }
          label={service?.name}
        />
        <div className={styles.service_item_simpleRow}>
          <span>{t("history.paid")}</span>
          {service?.isActive && <span>
            {(new Date(service?.lastPayment)).getDate()}/ 
            {new Date(service?.lastPayment).getMonth()+1 < 10 ? ` 0${(new Date(service?.lastPayment)).getMonth()+1}`:` ${new Date(service?.lastPayment).getMonth()+1}`}
            / {(new Date(service?.lastPayment)).getFullYear()}
          </span>}
        </div>
        <div className={styles.service_item_simpleRow}>
          <span>{t("cardService.currentCommitment")}</span>
          {service?.isActive && <span>{service?.price} {t("units.amd")}</span>}
        </div>
        <div className={styles.service_item_simpleRow}>
         <span>{t("cardService.amountDate")}</span>
         {service?.isActive &&
            <span>
              {(new Date(service?.nextPayment)).getDate()}/ 
              {new Date(service?.nextPayment).getMonth()+1 < 10 ? ` 0${(new Date(service?.nextPayment)).getMonth()+1}`:new Date(service?.nextPayment).getMonth()+1}
              / { new Date(service?.nextPayment).getFullYear()}
            </span>
          }
        </div>
        {/* <ServiceAmountHistory serviceHistory={service?.userServicePayment} t={t}/> */}
      </Card>
      <PaymentConfirm
        open={openDialogForPay}
        close={()=> setOpenDialogForPay(false)}
        cardArr={content?.cards}
        changeActiveCard={changeActiveCard} 
        setPayData={setPayData}
        payData={payData}
      />
    </>
  );
};

export default memo(ServiceItemSecond);
