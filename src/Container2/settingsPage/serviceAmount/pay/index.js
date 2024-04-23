import { Button, Dialog, DialogContent, Divider, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { memo, useEffect, useRef, useState } from "react";
import { t } from "i18next";
import PrepaymentConfirmation from "../prepayment/PrepaymentConfirm";
import PaymentConfirm from "../paymentDialog/PaymentConfirm";
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import { payForServiceWithAttachedCard, payForServiceWithNewCard } from "../../../../services/internal/InternalPayments";
import Loader from "../../../loading/Loader";
import SnackErr from "../../../dialogs/SnackErr";

const PayComponent = ({
  openPay,
  setOpenPay,
  price,
  content,
  serviceType,
  message,
  setMessage,
  setRefresh,
  refresh
}) => {
  const [billsData, setBills] = useState({
    web: true,
    daysEnum: 1,
    isBinding: content?.autopayment?.hasAutoPayment,
    serviceType: serviceType,
    cardId: content?.autopayment?.defaultCard?.cardId
  });
  const [method,setMethod] = useState(1)
  const ref = useRef();
  const [responseUrl,setResponseUrl] = useState();
  const [openBankInfo,setOpenBankInfo] = useState();
  const [loader,setLoader] = useState(false);
  const closeDialog = () => {
    setMethod(1)
    setBills({
      web: true,
      daysEnum: 1,
      isBinding: content?.autopayment?.hasAutoPayment,
      serviceType: serviceType,
      cardId: content?.autopayment?.defaultCard?.cardId
      // cardId: 0
    })
    setOpenPay(false)
  };

  const servicePay = async() => {
    setLoader(true)
    if(method === 1) {
      payForServiceWithAttachedCard(billsData).then((res) => {
        setLoader(false)
        if(res?.status === 200) {
          setMessage({toStringype:"success", message:t("dialogs.checkCardStatus200")})
        }else if(res?.status === 201) {
          setMessage({type:"success", message:t("dialogs.checkCardStatus201")})
        }else if(res?.status === 410) {
          setMessage({type:"error", message:t("dialogs.checkCardStatus410")})
        }else if(res?.status === 400) {
          setMessage({type:"error", message:t("dialogs.checkCardStatus400")})
        }else if(res?.status === 411) {
          setMessage({type:"error", message:t("dialogs.checkCardStatus412")})
        }else {
          setMessage({type:"error", message:t("dialogs.checkCardStatus400")})
        }
        setOpenPay(false)
      })
      
    }else if (method === 2){
      payForServiceWithNewCard(billsData).then((res) => {
      setLoader(false)
        setResponseUrl(res?.formUrl)
      })
    }
  };

  useEffect(() => {
    responseUrl && ref.current.click()
  }, [responseUrl]);

  return(
    <Dialog open={openPay}>
      <div style={{display:"flex", justifyContent:"space-between",margin:"3px 7px",alignItems:"center"}}>
        <h5>{""}</h5>
        <IconButton onClick={closeDialog}> 
          <CloseIcon />
        </IconButton>
      </div>      
      <Divider color="black" />
      <DialogContent style={{margin:"auto", paddingTop:"4px"}}>
      <h6 style={{marginTop:"0px"}}>{t("cardService.dialogTitle")}</h6>
       
      <PrepaymentConfirmation 
        setBills={setBills}
        billsData={billsData}
        price={price}
      />
      <Divider sx={{m:1}} color="black" />

      <PaymentConfirm
        cardArr={content?.cards}
        setPayData={setBills}
        payData={billsData}
        content={content}
        method={method}
        setMethod={setMethod}
      />
        <Divider sx={{m:1}} color="black" />

        <Button 
          color="success" 
          variant="outlined" 
          startIcon={<HomeRepairServiceIcon color="success" />}
          sx={{width:"100%"}}
          onClick={()=>setOpenBankInfo(true)}
        >
          {t("cardService.bankTransfer")}
        </Button>

      </DialogContent>
     
      { responseUrl && <a ref={ref} href={responseUrl} target="_blank" rel="noreferrer">{""}</a> }

      <Button
        variant="contained"
        onClick={servicePay}  
        sx={{m:2,background:"#3FB68A"}}
        // disabled={billsData?.attach === undefined && billsData?.cardId === undefined}
        disabled={billsData?.attach === undefined && billsData?.cardId === undefined }
      >
        {t("basket.totalndiscount")} {billsData?.daysEnum * price} ֏ 
      </Button>
      {loader && 
        <Dialog open={!!loader}>
          <Loader
           close={!loader} />
        </Dialog>
      }
      <Dialog open={openBankInfo}>
        <SnackErr type="success" message={t("cardService.bankMessage")}  close={setOpenBankInfo}/>
      </Dialog>
    </Dialog>
  )
};

export default memo(PayComponent);
