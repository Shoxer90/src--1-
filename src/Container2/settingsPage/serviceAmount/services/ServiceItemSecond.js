import React, { memo, useEffect, useState } from "react";
import { Button, Card, FormControlLabel } from "@mui/material";
import PaymentConfirm from "../paymentDialog/PaymentConfirm";

import styles from "./index.module.scss";

const ServiceItemSecond = ({
  t,
  content,
  service,
  logOutFunc,
  changeActiveCard,
  payData, setPayData,
}) => {
  const [openDialogForPay,setOpenDialogForPay] = useState(false);
  const [activateBtn,setActivateBtn] = useState(false);
  const [payDate, setNextPayDate] = useState();
  const disableStyle={
    // pointerEvents: "none",
    opacity: 0.3
  };


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
               if(service?.isActive) {
                  setPayData({
                    ...payData,
                    serviceType: service?.id
                  })
                  setOpenDialogForPay(true)
               }else{
                  alert("For more info please call PayX")
                }
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
      </Card>
      <PaymentConfirm
        open={openDialogForPay}
        close={()=> setOpenDialogForPay(false)}
        cardArr={content?.cards}
        changeActiveCard={changeActiveCard} 
        setPayData={setPayData}
        payData={payData}
        content={content}
        price={service?.price}
        activateBtn={activateBtn}
        setActivateBtn={setActivateBtn}
        logOutFunc={logOutFunc}
      />
    </>
  );
};

export default memo(ServiceItemSecond);
