import React, { memo, useEffect, useState } from "react";
import { Button, Card, Dialog } from "@mui/material";

import styles from "./index.module.scss";
import ConfirmDialog from "../../../dialogs/ConfirmDialog";
import PayXInfo from "../../../social/PayXInfo";
import SnackErr from "../../../dialogs/SnackErr";
import PayComponent from "../pay";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { completeEhdmRegistration } from "../../../../services/auth/auth";
import Loader from "../../../loading/Loader";
import ActivateStepByStep from "../pay/ActivatStepByStep"
import { setPayForEhdm } from "../../../../store/storex/openPaySlice";
import { formatNumberWithSpaces } from "../../../../modules/modules";



const ServiceItemV2 = ({
  service,
  content,
  isDelete,
  payData, 
  setPayData,
  serviceType,
  refresh,
  setRefresh,
  paymentType, setPaymentType
}) => {
  const isOpenPayForEhdm = useSelector(state => state?.payForEhdm?.isOpen)
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false)
  const [message, setMessage] = useState({message:"",type:""});
  const [openPay, setOpenPay] = useState(false);
  const [activateEhdm,setActivateEhdm] = useState(false);
   const [billsData, setBills] = useState({
    web: true,
    daysEnum: 1,
    isBinding: content?.autopayment?.hasAutoPayment,
    serviceType: user?.activeServiceType,
    cardId: content?.autopayment?.defaultCard?.cardId,
    paymentType: 1
  });
  const disableStyle={opacity: 0.3};
  const {t} = useTranslation();
  

  const closeMessage = () => {
    dispatch(setPayForEhdm(false))
    setRefresh(!refresh)
    setOpenPay(false)
    setMessage({message:"", type:""})
    setRefresh(!refresh)
  };


  const notAvailableService = () => {
    if(service?.id === 3) {
      if(!user?.isRegisteredInEhdm && !service?.isActive) {
        setActivateEhdm(true)

       return  dispatch(setPayForEhdm(true))
      }
    }
    if(service?.isActive && !isOpenPayForEhdm) {
      setOpenPay(true)
    }
  }
  useEffect(() =>{
    service?.isActive &&
    setPayData({
      ...payData,
      serviceType: service?.id
    })
  }, [isDelete]);

  useEffect(() => {
    isOpenPayForEhdm && notAvailableService()
  }, []);


  return (
    <>
      <Card 
        sx={{ p:1.1,boxShadow:5,borderRadius:"5px"}} 
        className={styles.service_item}
      >
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <h6 style={{margin:"4px"}}>{t(`settings.${service?.name}`)}</h6>
          {service?.isActive && 
            <Button 
              variant="contained" 
              onClick={notAvailableService}
              style={{ opacity:1}}
              sx={{width:"150px",height:"30px",background:"#3FB68A",textTransform: "capitalize",}}
            >
              {t("basket.linkPayment")} 
            </Button>
          }
          { !service?.isActive && service?.id === 3 && 
            <Button 
              variant="contained" 
              onClick={()=>{
                setActivateEhdm(true)
                notAvailableService()
              }}
              sx={{width:"150px",height:"30px",background:"#3FB68A",textTransform: "capitalize"}}
            >
              {t("settings.register")} 
          </Button>
          }
          { !service?.isActive && service?.id === 5 &&  <h6 style={{margin:"4px",color:"green"}}>{t("settings.free")}</h6>}

        </div>
        <span
          style={!service?.isActive  && service?.id !== 5 ? disableStyle: null}
        >
          
      {service?.isActive && service?.id !== 6 &&
        <div className={styles.service_item_simpleRow}>
            <h6 style={{margin:"4px 0px"}}>{t("cardService.currentCommitment")}</h6>
            <h6 style={{margin:"4px 0px"}}>{formatNumberWithSpaces(service?.price)} {t("units.amd")}</h6>
        </div>
      }
      {!service?.isActive && service?.id === 3 &&
        <div className={styles.service_item_simpleRow}>
          <h6 style={{margin:"4px 0px",opacity:"0.7"}}>{t("landing.priceListRow155")}</h6>
          <h6 style={{margin:"4px 0px"}}>{formatNumberWithSpaces(service?.price)} {t("units.amd")}</h6>
        </div>
      }
      {service?.id === 6 &&
        <div className={styles.service_item_simpleRow}>
          <h6 style={{margin:"4px 0px"}}>{t("cardService.currentCommitment")} (100 {t("units.pcs")})</h6>
          <h6 style={{margin:"4px 0px"}}>{formatNumberWithSpaces(service?.price)} {t("units.amd")}</h6>
        </div>
      }
        <div className={styles.service_item_simpleRow} style={{fontWeight:700, fontSize:"100%",color:"green"}}>
          <span>{service?.id === 6 ? t("settings.availSmsCount"):t("cardService.amountDate")}</span>
          {service?.isActive && service?.id !== 6 ?
            <span>
              {(new Date(service?.nextPayment)).getDate()}. 
              {new Date(service?.nextPayment).getMonth()+1 < 10 ? `0${(new Date(service?.nextPayment)).getMonth()+1}`:new Date(service?.nextPayment).getMonth()+1}
              .{ new Date(service?.nextPayment).getFullYear()}
            </span> : ""
          }
          { service?.id === 6 ?
            <span>
              {user?.availableSmsCount} {t("units.pcs")}
            </span>:""
          }
        </div>
        </span>
      </Card>
      <Dialog open={message?.message}>
        <SnackErr type={message?.type} message={message?.message} close={closeMessage} />
      </Dialog>
      <PayComponent 
        openPay={openPay}
        setOpenPay={setOpenPay}  
        price={service?.price}
        content={content}
        serviceType={serviceType}
        setMessage={setMessage}
        activateEhdm={activateEhdm}
        id={service?.type}
        paymentType={paymentType}
        setPaymentType={setPaymentType}
        billsData={billsData}
        setBills={setBills}
      />
      {isOpenPayForEhdm && !service?.isActive && <ActivateStepByStep
        open={isOpenPayForEhdm}
        close={()=>dispatch(setPayForEhdm(false))}
        setMessage={setMessage}
        content={content}
        activateEhdm={activateEhdm}
        price={service?.price}
        paymentType={paymentType}
        setPaymentType={setPaymentType}
        payData={billsData}
        setPayData={setBills}
      />}
       <ConfirmDialog 
        question={t("settings.clickEhdmAfterDone30000")}
        func={()=>setOpenDialog(false)}
        title=""
        open={openDialog}
        close={setOpenDialog}
        content={" "}
        t={t}
        nobutton={true}
      />
    </>
  );
};

export default memo(ServiceItemV2);
