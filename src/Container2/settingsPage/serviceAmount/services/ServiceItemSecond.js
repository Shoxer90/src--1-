import React, { memo, useState } from "react";
import { Button, Card, FormControlLabel, Input } from "@mui/material";
import IOSSwitch from "../../../../modules/iosswitch";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import styles from "./index.module.scss";

const ServiceItemSecond = ({
  t,
  service,
  payForSeveralServices, 
  paymentAmount,
  setPaymentAmount
}) => {

  const [authomaticPay, setAuthomaticPay] = useState(false);
  const [payForThis, setPayForThis] = useState(false);

  const addServiceForPay = (e) => {
    setPayForThis(e.target.checked)
    setPaymentAmount(paymentAmount+service?.price - service?.serviceChargeBalance)
  };

  return (
    <Card sx={{ p:1.1,boxShadow:5,borderRadius:"8px"}} className={styles.service_item}>
      <FormControlLabel
        labelPlacement="start" 
        className={styles.service_item_hightSwitch}
        sx={{m:0,p:.7}}
        control={
          payForSeveralServices ?
            <IOSSwitch  
              checked={payForThis}
              onChange={(e)=>addServiceForPay(e)}
            />
          :<Button variant="contained" size="small">{t("basket.linkPayment")}</Button>
        }
        label={service?.title}
      />
      <div className={styles.service_item_simpleRow}>
        <span>{t("history.paid")}</span>
        <span>{service?.serviceChargeBalance} {t("units.amd")}</span>
      </div>
      <FormControlLabel 
        labelPlacement="start"
        className={styles.service_item_simpleRow}
        sx={{m:0,p:.7}}
        label={t("cardService.authomatic")} 
        control={<IOSSwitch  
          checked={authomaticPay}
          onChange={(e)=>setAuthomaticPay(e.target.checked)}
        />
        }
      />
      <div className={styles.service_item_simpleRow}>
        <span>{t("cardService.currentCommitment")}</span>
        <span className={styles.service_item_simpleRow_amount}>
          <span>{service?.price - service?.serviceChargeBalance} {t("units.amd")}</span> 
          <ArrowForwardIosIcon  fontSize="small" sx={{color:"grey",pl:1}}/>
        </span>
      </div>
      <div className={styles.service_item_simpleRow}>
        <span>{t("basket.linkPayment")}</span>
        <span className={styles.service_item_simpleRow_amount}>
          <Input />
        </span>
      </div>
    </Card>
  );
};

export default memo(ServiceItemSecond);
