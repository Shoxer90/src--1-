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
  serviceType,
  refresh,
  setRefresh
}) => {
  const [message, setMessage] = useState({message:"",type:""});
  const [openPay, setOpenPay] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const disableStyle={opacity: 0.3};

  const closeMessage = () => {
    setRefresh(!refresh)
    setOpenPay(false)
    setMessage({message:"", type:""})

  };
  

  const notAvailableService = () => {
    if(service?.isActive){
      setOpenPay(true)
    }else if(!service?.isActive && service?.id === 3){
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
        style={!service?.isActive  && service?.id !== 1 ? disableStyle: null}
        onClick={notAvailableService}
      >
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <h6 style={{margin:"4px"}}>{t(`settings.${service?.name}`)}</h6>
          {/* {!service?.isActive && service?.id === 3 ? "":
            <Button 
              variant="contained" 
              onClick={notAvailableService}
              sx={{width:"150px",height:"30px",background:"#3FB68A"}}
            >
              {service?.isActive  ? t("basket.linkPayment") : ""} 
              {!service?.isActive && service?.id === 1 ? t("settings.free") : ""}
            </Button>
          } */}

          {/* {!service?.isActive && service?.id === 3 ? "":
            <Button 
              variant="contained" 
              onClick={notAvailableService}
              sx={{width:"150px",height:"30px",background:"#3FB68A"}}
            >
              {service?.isActive  ? t("basket.linkPayment") : ""} 
              {!service?.isActive && service?.id === 1 ? t("settings.free") : ""}
            </Button>
          } */}
          {service?.isActive && 
            <Button 
              variant="contained" 
              onClick={notAvailableService}
              sx={{width:"150px",height:"30px",background:"#3FB68A"}}
            >
              {t("basket.linkPayment")} 
            </Button>
          }
          { !service?.isActive && service?.id === 3 && ""}
          { !service?.isActive && service?.id === 1 &&  <h6 style={{margin:"4px",color:"green"}}>{t("settings.free")}</h6>}

        </div>
        <div className={styles.service_item_simpleRow}>
        <h6 style={{margin:"4px 0px"}}>{t("cardService.currentCommitment")}</h6>
          {service?.isActive  &&  <h6 style={{margin:"4px 0px"}}>{service?.price} {t("units.amd")}</h6>}
        </div>
        <div className={styles.service_item_simpleRow} style={{fontWeight:700, fontSize:"100%",color:"green"}}>
         <span>{t("cardService.amountDate")}</span>
         {service?.isActive &&
            <span >
              {(new Date(service?.nextPayment)).getDate()}. 
              {new Date(service?.nextPayment).getMonth()+1 < 10 ? `0${(new Date(service?.nextPayment)).getMonth()+1}`:new Date(service?.nextPayment).getMonth()+1}
              .{ new Date(service?.nextPayment).getFullYear()}
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
        setRefresh={setRefresh}
        refresh={refresh}
      />
    </>
  );
};

export default memo(ServiceItemSecond);
