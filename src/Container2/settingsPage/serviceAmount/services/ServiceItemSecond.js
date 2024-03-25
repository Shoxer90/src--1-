import React, { memo, useEffect, useState } from "react";
import { Button, Card, Dialog, FormControlLabel } from "@mui/material";

import styles from "./index.module.scss";
import ConfirmDialog from "../../../dialogs/ConfirmDialog";
import PayXInfo from "../../../social/PayXInfo";
import SnackErr from "../../../dialogs/SnackErr";
import PayComponent from "../pay";
import { t } from "i18next";

const ServiceItemSecond = ({
  service,
  content,
  isDelete,
  payData, 
  setPayData,
  serviceType
}) => {
  const [message, setMessage] = useState({message:"",type:""});
  const [openPay, setOpenPay] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const disableStyle={opacity: 0.3};

  const closeMessage = () => {
    setOpenPay(false)
    setMessage({message:"", type:""})
  };
  

  const notAvailableService = () => {
    if(service?.isActive){
      setOpenPay(true)
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
        sx={{ p:1.1,boxShadow:5,borderRadius:"5px"}} 
        className={styles.service_item}
        style={!service?.isActive ? disableStyle: null}
        onClick={notAvailableService}
      >
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <h6>{t(`settings.${service?.name}`)}</h6>
          {!service?.isActive && service?.id === 3 ? "":
            <Button 
              variant="contained" 
              onClick={notAvailableService}
              sx={{width:"150px",height:"30px"}}
            >
              {service?.isActive  ? t("basket.linkPayment") : ""} 
              {!service?.isActive && service?.id === 1 ? t("settings.free") : ""}
            </Button>
          }
        </div>
        <div className={styles.service_item_simpleRow}>
          <span>{t("cardService.currentCommitment")}</span>
          {service?.isActive  && <span>{service?.price} {t("units.amd")}</span>}
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
    
      <ConfirmDialog
        question={<strong>{t("cardService.notAvailableService")}</strong>}
        func={()=>setOpenAlert(false)}
        open={openAlert}
        close={setOpenAlert}
        content={<PayXInfo t={t} />}
        t={t}
        nobutton={true}
      />
      <PayComponent 
        openPay={openPay}
        setOpenPay={setOpenPay}  
        price={service?.price}
        content={content}
        serviceType={serviceType}
        message={message}
        setMessage={setMessage}
      />
    </>
  );
};

export default memo(ServiceItemSecond);
