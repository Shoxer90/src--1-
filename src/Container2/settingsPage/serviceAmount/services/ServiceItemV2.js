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
import ActivateMarketXDialog from "./ActivateMarketXDialog";



const ETRM_ID = 3;
const STOREX_ID = 5;
const SMS_ID = 6;

const ServiceItemV2 = ({
  service,
  content,
  isDelete,
  payData, 
  setPayData,
  serviceType,
  refresh,
  setRefresh,
  paymentType, 
  setPaymentType
}) => {
  const isOpenPayForEhdm = useSelector(state => state?.payForEhdm?.isOpen)
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false)
  const [message, setMessage] = useState({message:"",type:""});
  const [openPay, setOpenPay] = useState(false);
  const [activateEhdm,setActivateEhdm] = useState(false);
  const [openMarketX, setOpenMarketX] = useState(false);
  const [openActivateConfirm, setOpenActivateConfirm] = useState(false);
   const [billsData, setBills] = useState({
    web: true,
    daysEnum: 1,
    isBinding: content?.autopayment?.hasAutoPayment,
    serviceType: "",
    // serviceType: user?.activeServiceType,
    cardId: content?.autopayment?.defaultCard?.cardId,
    paymentType: ""
    // paymentType: 1
  });
  const disableStyle={opacity: 0.3};
  const {t} = useTranslation();
  const isEtrmActive = Boolean(
    content?.services?.some((item) => item?.id === ETRM_ID && item?.isActive)
  );
  const isEtrm = service?.id === ETRM_ID;
  const isStoreX = service?.id === STOREX_ID;
  const isSms = service?.id === SMS_ID;
  const isMarketX = /marketx/i.test(service?.name || "");
  const isStoreXFree = isStoreX && isEtrmActive;
  const showRegisterButton = isEtrm && !service?.isActive;
  const showFreeLabel = isStoreXFree;
  const showPayButton = Boolean(service?.isActive) && !isStoreXFree;
  const showActivateButton = !service?.isActive && !showRegisterButton && !showFreeLabel;
  const showPrice = !isStoreXFree && !isSms && (service?.isActive || showActivateButton);
  const serviceNameKey = `settings.${service?.name}`;
  const translatedName = t(serviceNameKey);
  const serviceTitle = translatedName !== serviceNameKey ? translatedName : service?.name;
  

  const closeMessage = () => {
    dispatch(setPayForEhdm(false))
    setRefresh(!refresh)
    setOpenPay(false)
    setMessage({message:"", type:""})
    setRefresh(!refresh)
  };


  const notAvailableService = () => {
    setBills({
      ...billsData,
      serviceType: service?.id
    })
    if(isEtrm) {
      if(!user?.isRegisteredInEhdm && !service?.isActive) {
        setActivateEhdm(true)

       return  dispatch(setPayForEhdm(true))
      }
    }
    if(showPayButton && !isOpenPayForEhdm) {
      setOpenPay(true)
    }
  };

  const handleActivate = () => {
    if (isMarketX) {
      setOpenMarketX(true);
      return;
    }
    setOpenActivateConfirm(true);
  };

  const confirmActivateService = () => {
    setOpenActivateConfirm(false);
    setMessage({ message: t("dialogs.done"), type: "success" });
    setRefresh(!refresh);
  };

  const confirmMarketXActivation = () => {
    setOpenMarketX(false);
    setMessage({ message: t("dialogs.done"), type: "success" });
    setRefresh(!refresh);
  };

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
          <h6 style={{margin:"4px"}}>{serviceTitle}</h6>
          {showPayButton && 
            <Button 
              variant="contained" 
              onClick={notAvailableService}
              style={{ opacity:1}}
              sx={{width:"150px",height:"30px",background:"#3FB68A",textTransform: "capitalize",}}
            >
              {t("basket.linkPayment")} 
            </Button>
          }
          {showActivateButton && 
            <Button 
              variant="contained" 
              onClick={handleActivate}
              style={{ opacity:1}}
              sx={{width:"150px",height:"30px",background:"#3FB68A",textTransform: "capitalize",}}
            >
              {t("settings.activate")} 
            </Button>
          }
          {showRegisterButton && 
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
          {showFreeLabel && <h6 style={{margin:"4px",color:"green"}}>{t("settings.free")}</h6>}

        </div>
        <span
          style={!service?.isActive && !showPayButton && !showActivateButton && !showFreeLabel ? disableStyle: null}
        >
          
      {showPrice &&
        <div className={styles.service_item_simpleRow}>
            <h6 style={{margin:"4px 0px"}}>{t("cardService.currentCommitment")}</h6>
            <h6 style={{margin:"4px 0px"}}>{formatNumberWithSpaces(service?.price)} {t("units.amd")}</h6>
        </div>
      }
      {showRegisterButton &&
        <div className={styles.service_item_simpleRow}>
          <h6 style={{margin:"4px 0px",opacity:"0.7"}}>{t("landing.priceListRow155")}</h6>
          <h6 style={{margin:"4px 0px"}}>{formatNumberWithSpaces(service?.price)} {t("units.amd")}</h6>
        </div>
      }
      {isSms &&
        <div className={styles.service_item_simpleRow}>
          <h6 style={{margin:"4px 0px"}}>{t("cardService.currentCommitment")} (100 {t("units.pcs")})</h6>
          <h6 style={{margin:"4px 0px"}}>{formatNumberWithSpaces(service?.price)} {t("units.amd")}</h6>
        </div>
      }
        <div className={styles.service_item_simpleRow} style={{fontWeight:700, fontSize:"100%",color:"green"}}>
          <span>{isSms ? t("settings.availSmsCount"):t("cardService.amountDate")}</span>
          {service?.isActive && !isSms && !isStoreXFree ?
            <span>
              {(new Date(service?.nextPayment)).getDate()}. 
              {new Date(service?.nextPayment).getMonth()+1 < 10 ? `0${(new Date(service?.nextPayment)).getMonth()+1}`:new Date(service?.nextPayment).getMonth()+1}
              .{ new Date(service?.nextPayment).getFullYear()}
            </span> : ""
          }
          { isSms ?
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
      <ActivateMarketXDialog
        open={openMarketX}
        close={()=>setOpenMarketX(false)}
        onConfirm={confirmMarketXActivation}
        setMessage={setMessage}
      />
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
      <ConfirmDialog 
        question={t("settings.activateServiceConfirm")}
        func={confirmActivateService}
        title=""
        open={openActivateConfirm}
        close={setOpenActivateConfirm}
        content={" "}
        t={t}
      />
    </>
  );
};

export default memo(ServiceItemV2);
