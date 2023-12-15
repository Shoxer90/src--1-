import React, { memo, useState } from "react";
import { Button, Card, FormControlLabel } from "@mui/material";
import IOSSwitch from "../../../../modules/iosswitch";

import styles from "./index.module.scss";
import PaymentConfirm from "../paymentDialog/PaymentConfirm";
import ServiceAmountHistory from "../serviceAmountHistory";

const ServiceItemSecond = ({
  t,
  service,
  userCardInfo,
  changeActiveCard
}) => {
  const [openDialogForPay,setOpenDialogForPay] = useState(false);

  const [payData,setPayData] = useState({
    serviceType: 0,
    price: service?.serviceChargeBalance,
    isBinding: service?.userServicePayment[service?.userServicePayment.length-1]?.isBinding === true ? true : false
  });

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

  return (
    <>
    <Card sx={{ p:1.1,boxShadow:5,borderRadius:"8px"}} className={styles.service_item}>
      <FormControlLabel
        labelPlacement="start" 
        className={styles.service_item_hightSwitch}
        sx={{m:0,p:.7}}
        control={
          <Button 
            variant="contained" 
            size="small" 
            onClick={()=>{
              setOpenDialogForPay(true)
            }}
          >
            {t("basket.linkPayment")}
          </Button>
        }
        label={service?.title}
      />
      <FormControlLabel 
        labelPlacement="start"
        className={styles.service_item_simpleRow}
        sx={{m:0,p:.7}}
        label={t("cardService.authomatic")} 
        disabled={service?.title === "Attach"}
        control={<IOSSwitch  
          checked={payData?.isBinding === true ? true : false}
          onChange={(e)=>setPayData({
            ...payData,
            isBinding:e.target.checked  === true ? true : false
          })}
        />
        }
      />
      <div className={styles.service_item_simpleRow}>
        <span>{t("history.paid")}</span>
        <span>{service?.price - service?.serviceChargeBalance} {t("units.amd")}</span>
      </div>
      <div className={styles.service_item_simpleRow}>
        <span>{t("cardService.currentCommitment")}</span>
        <span>{service?.serviceChargeBalance} {t("units.amd")}</span> 
      </div>
      <ServiceAmountHistory serviceHistory={service?.userServicePayment} t={t}/>
    </Card>
    <PaymentConfirm
      open={openDialogForPay}
      close={()=> setOpenDialogForPay(false)}
      cardArr={userCardInfo}
      changeActiveCard={changeActiveCard} 
      setPayData={setPayData}
      payData={payData}
    />
  </>
  );
};

export default memo(ServiceItemSecond);
