import { Button, Dialog, DialogContent, Divider, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { memo, useEffect, useState } from "react";
import PrepaymentConfirmation from "../prepayment/PrepaymentConfirm";
import PaymentConfirm from "../paymentDialog/PaymentConfirm";
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import { payForServiceWithAttachedCard, payForServiceWithNewCard } from "../../../../services/internal/InternalPayments";
import Loader from "../../../loading/Loader";
import ConfirmDialog from "../../../dialogs/ConfirmDialog";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { payForEhdm, payForEhdmWithUsingCard } from "../../../../services/auth/auth";
import { formatNumberWithSpaces } from "../../../../modules/modules";

const langEnum = () => {
  let lang = localStorage.getItem("lang") || localStorage.getItem("i18nextLng")
  switch(lang) {
  case 'ru':
    return "rus"
  case 'eng':
    return "eng"
  default:
    return "arm"
  }
};
console.log("IN PAY COMPONENT")

const PayComponent = ({
  openPay,
  setOpenPay,
  price,
  content,
  serviceType,
  setMessage,
  activateEhdm,
  id,
  paymentType,
  setPaymentType,
  billsData,
  setBills
}) => {
  const {t} = useTranslation();

  const user = useSelector(state => state?.user?.user)
  const [url, setUrl] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [clicked,setClicked] = useState(false);
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
      cardId: content?.autopayment?.defaultCard?.cardId,
      paymentType: 1

    })
    setOpenPay(false)
  };

  const closeSuccessDialog = () => {
    setOpenSuccess(false)
    window.location.href = url
  }

  const payForCompleteEhdmRegistration = () => {
    setLoader(true)
    if(billsData?.cardId) {
      payForEhdmWithUsingCard(billsData?.cardId).then((res) => {
        setLoader(false)
        if(res?.status !== 200) {
        }else{
          setUrl(res?.data?.formUrl)
          setOpenSuccess(true)
        }
      })
    }else{
      if(billsData?.attach) {
      }else{
      }
      payForEhdm().then((res) => {
        setLoader(false)
        if(res?.status !== 200) {
        }else{
          window.location.href = res?.data?.formUrl;
          // window.open( res?.data?.formUrl, '_blank', 'noopener,noreferrer');
        }
      })

    }
  };
  
  const servicePay = async() => {
    if(activateEhdm) {
        if(!user?.isRegisteredForEhdm){
        // return setOpenCompleteUserInfo(true)
        return 
      }else{
        return payForCompleteEhdmRegistration()
      }
    }
    setLoader(true)
    if(method === 1) {
      payForServiceWithAttachedCard(billsData).then((res) => {
        setLoader(false)
        if(res?.status === 200) {
          setMessage({type:"success", message:t("dialogs.checkCardStatus200")})
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
        // window.open( res?.formUrl, '_blank', 'noopener,noreferrer');
        // openUrl(res?.formUrl)
        window.location.href = res?.formUrl
      })
  };


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
      {activateEhdm ?  
        <h6 style={{marginTop:"0px"}}>{`${t("settings.register")} ${t("settings.ETRM")}`}</h6>

        :<h6 style={{marginTop:"0px"}}>{t("cardService.dialogTitle1")}</h6>
      } 
       
      <PrepaymentConfirmation 
        setBills={setBills}
        billsData={billsData}
        price={price}
        activateEhdm={activateEhdm}
        id={id}
      />
      <Divider sx={{m:1}} color="black" />
      

      <PaymentConfirm
        cardArr={content?.cards}
        setPayData={setBills}
        payData={billsData}
        content={content}
        method={method}
        setMethod={setMethod}
        activateEhdm={activateEhdm}
        clicked={clicked}
        setClicked={setClicked}
        paymentType={paymentType}
        setPaymentType={setPaymentType}
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
        {t("basket.totalndiscount")} {formatNumberWithSpaces(billsData?.daysEnum * price)} ֏ 
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
        question={<strong>{user?.paymentMessage[langEnum()]}</strong>}
        nobutton={true}
      />
       <ConfirmDialog
        t={t} 
        func={closeSuccessDialog} 
        open={openSuccess}
        close={closeSuccessDialog}
        question={<strong>{t("settings.done30000")}</strong>}
        nobutton={true}
      />
    </Dialog>
  )
};

export default memo(PayComponent);
