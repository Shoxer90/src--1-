import { Button, Dialog, DialogContent, Divider, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { memo, useState } from "react";
import PrepaymentConfirmation from "../prepayment/PrepaymentConfirm";
import PaymentConfirm from "../paymentDialog/PaymentConfirm";
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import { payForServiceWithAttachedCard, payForServiceWithNewCard } from "../../../../services/internal/InternalPayments";
import Loader from "../../../loading/Loader";
import ConfirmDialog from "../../../dialogs/ConfirmDialog";
import { useTranslation } from "react-i18next";

const PayComponent = ({
  openPay,
  setOpenPay,
  price,
  content,
  serviceType,
  setMessage,
}) => {
  const {t} = useTranslation();

  const [billsData, setBills] = useState({
    web: true,
    daysEnum: 1,
    isBinding: content?.autopayment?.hasAutoPayment,
    serviceType: serviceType,
    cardId: content?.autopayment?.defaultCard?.cardId
  });
  const [method,setMethod] = useState(1)
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
      payUsingNewCard()
    }
  };

  const payUsingNewCard = () => {
    payForServiceWithNewCard(billsData).then((res) => {
      setLoader(false)
        window.open( res?.formUrl, '_blank', 'noopener,noreferrer');
      })
  }

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
          sx={{width:"100%",textTransform: "capitalize"}}
          onClick={()=>setOpenBankInfo(true)}
        >
          {t("cardService.bankTransfer")}
        </Button>

      </DialogContent>
     
      <Button
        variant="contained"
        onClick={servicePay}  
        sx={{m:2,background:"#3FB68A",textTransform: "capitalize"}}
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
      <ConfirmDialog
        t={t} 
        func={()=>setOpenBankInfo(false)} 
        open={openBankInfo}
        close={setOpenBankInfo}
        question={<strong>{t("cardService.bankMessage")}</strong>}
        nobutton={true}
      />
    </Dialog>
  )
};

export default memo(PayComponent);
