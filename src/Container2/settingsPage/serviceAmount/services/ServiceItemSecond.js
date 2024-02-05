import React, { memo, useEffect, useState } from "react";
import { Button, Card, Dialog, FormControlLabel } from "@mui/material";
import PaymentConfirm from "../paymentDialog/PaymentConfirm";

import styles from "./index.module.scss";
import ConfirmDialog from "../../../dialogs/ConfirmDialog";
import PayXInfo from "../../../social/PayXInfo";
import SnackErr from "../../../dialogs/SnackErr";
import { t } from "i18next";

const ServiceItemSecond = ({
  service,
  content,
  isDelete,
  payData, 
  logOutFunc,
  setPayData,
}) => {
  const [openDialogForPay,setOpenDialogForPay] = useState(false);
  const [message, setMessage] = useState({message:"",type:""});

  const closeMessage = () => {
    setOpenDialogForPay(false)
    setMessage({message:"", type:""})
  }

  const [openAlert, setOpenAlert] = useState(false);
  const disableStyle={opacity: 0.3};

  const notAvailableService = () => {
    if(service?.isActive){
      setOpenDialogForPay(true)
    }else{
      setOpenAlert(true)
    }
  }

  useEffect(() =>{
    service?.isActive &&
    setPayData({
      ...payData,
      serviceType: service?.id
    })
  }, [isDelete]);

  return (
    <>
      <Card 
        sx={{ p:1.1,boxShadow:5,borderRadius:"8px"}} 
        className={styles.service_item}
        style={!service?.isActive ? disableStyle: null}
        onClick={notAvailableService}
      >
        <FormControlLabel
          labelPlacement="start" 
          className={styles.service_item_hightSwitch}
          sx={{m:0,p:.7}}
          control={
            <Button 
              variant="contained" 
              size="small" 
              onClick={notAvailableService}
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
      <Dialog open={message?.message}>
        <SnackErr type={message?.type} message={message?.message} close={closeMessage} />
      </Dialog>
      <PaymentConfirm
        isPrepayment={false}
        open={openDialogForPay}
        close={()=> setOpenDialogForPay(false)}
        cardArr={content?.cards}
        setPayData={setPayData}
        payData={payData}
        content={content}
        price={service?.price}
        logOutFunc={logOutFunc}
        message={message}
        setMessage={setMessage}
      />
      <ConfirmDialog
        question={<strong>{t("cardService.notAvailableService")}</strong>}
        func={()=>setOpenAlert(false)}
        open={openAlert}
        close={setOpenAlert}
        content={<PayXInfo t={t} />}
        t={t}
        nobutton={true}
      />
    </>
  );
};

export default memo(ServiceItemSecond);
