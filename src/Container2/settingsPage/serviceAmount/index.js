import React, { useState, memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import AddCardIcon from '@mui/icons-material/AddCard';
import { Box, Button, Card, Dialog, Divider } from '@mui/material';

import Services from './services';
import CreditCard from './creditCard/CreditCard';
import ServiceTitle from './ServiceTitle';
import CreditCardWrapper from './creditCard/CreditCardWrapper';
import AutoPaymentSwitch from "./autoPayment";
import SmallCardForCarousel from './creditCard/SmallCardForCarousel.js';
import CardTravelIcon from '@mui/icons-material/CardTravel';

import { changeActiveStatus, removeBankCard } from '../../../services/cardpayments/internalPayments';
import { getPaymentCardServices, postNewCreditCard } from '../../../services/internal/InternalPayments';

import styles from "./index.module.scss"
import ConfirmDialog from '../../dialogs/ConfirmDialog.js';
import SnackErr from '../../dialogs/SnackErr.js';
import PrepaymentConfirm from './paymentDialog/PrepaymentConfirm.js';
import st from "./creditCard/index.module.scss";

const stylesCard = {
  m: window.innerWidth > 1000 ? 2 : .2,
  mb: 1,
  boxShadow: 3,
  borderRadius: 5,
  height:"fit-content"
};

const stylesBox = {
  mb:1,
  mt:0,
  minHeight: "30dvh",
  display:"flex",
  boxShadow: 0,
  justifyContent:"space-betweeen"
};

const stylesServCard = {
  background:"#def7ee",
};

const ClientCardContainer = ({logOutFunc, isBlockedUser}) => {
  const ref = useRef();
  const [internalPayments, setInternalPayments] = useState(); 
  const [payData, setPayData] = useState({
    isBinding: internalPayments?.autopayment?.hasAutoPayment,
    serviceType: null,
  });
  const [openPrepayment,setOpenPrepayment] = useState(false);
  const [responseUrl,setResponseUrl] = useState("");
  const {t} = useTranslation()
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [message, setMessage] = useState({message:"", type:""});
  const [isDelete,setIsDelete] = useState(false);
  const [refresh,setRefresh] = useState(false);
  const [currentId, setCurrentId] = useState();
  const [countDown, setCountDown] = useState(0);

  const removeCard = async(id=internalPayments?.autopayment?.defaultCard?.cardId) => {
    await removeBankCard(id).then((res) => {

      setIsDelete(!isDelete)
      setOpenConfirmation(false)
      setMessage({message:t("dialogs.done"),type:"success"})
    })
  };

  const changeActiveCard = async(id) => {
    await changeActiveStatus(id).then((res) => {
    })
  };

  // "notInDate": "Հարգելի հաճախորդ,դուք ունեք վճարման պարտավորություն: Ծառայությունների հետագա օգտագործման համար խնդրում ենք կատարել վճարումը",
  // "notInDateTrueDays": "Հարգելի հաճախորդ,դուք ունեք վճարման պարտավորություն: Մեր ծառայությունները հասանելի կլինեն  ",
  // "notInDateTrueDays2": "Խնդրում ենք կատարել վճարումը",
  // "dayCount": " օր",
  // "dayCount1": " օր",
  const getInfo = async() => {
    await getPaymentCardServices().then((res) =>{
      setInternalPayments(res)
      if(!res?.isInDate && res?.days){
        setCountDown(res?.days)
        setMessage({message:t("cardService.notInDate"), type:"error"})
        setMessage({
          type:"error",
          message:
           `${t("cardService.notInDateTrueDays")} 
            ${res?.days} 
            ${res?.days > 1 ? t("cardService.dayCount") : t("cardService.dayCount1")}
            ${t("cardService.notInDateTrueDays2")}`
        })
      }else if(!res?.isInDate && !res?.days) {
        setMessage({type:"error", message:t("cardService.notInDate")})
      }
      setPayData({
        isBinding: res?.autopayment?.hasAutoPayment,
      })
    })
  };

  const addNewCreditCard = async() => {
   await postNewCreditCard().then((res) => {
      setResponseUrl(res)
    })
  };

  const closePrepaymentDialog = () => {
    delete payData?.months
    delete payData?.cardId
   setPayData({
      ...payData,
      isBinding: internalPayments?.autopayment?.hasAutoPayment,
    });
    setOpenPrepayment(false)
  }

  useEffect(() => {
    getInfo()
  }, [refresh, isDelete]);

  useEffect(() => {
   responseUrl && ref.current.click()
  }, [responseUrl]);


  return (
  <div className={styles.clientContainer} >
    <h2> {t("cardService.btnTitle")}</h2>
    <Divider color="black" sx={{m:1}} />
    {isBlockedUser && <p style={{color:"red"}}>{t("cardService.notInDate")}</p>}
    <Card sx={stylesCard}>
      <ServiceTitle title={t("landing.priceListSubTitle1")} />
      {internalPayments &&
        <Services 
          content={internalPayments}
          payData={payData} 
          setPayData={setPayData}
          logOutFunc={logOutFunc}
          isDelete={isDelete}
        />
      }
    </Card>

    <Card sx={stylesCard}>
      <ServiceTitle title={t("settings.paymentMethods")} />
      {internalPayments?.autopayment?.defaultCard ? <AutoPaymentSwitch
        payData={payData}
        setPayData={setPayData}
      />: ""}

      <Box sx={stylesBox} className={styles.payWay}>

          {internalPayments?.autopayment?.defaultCard ?
            <CreditCardWrapper 
              setOpenConfirmation={setOpenConfirmation}
              element={<CreditCard card={internalPayments?.autopayment?.defaultCard}
            />}
          />:""}

        <Card className={styles.attachCardContainer} sx={{borderRadius:4,background:"#def7ee"}}>
          <div>
            <CardTravelIcon fontSize="large" />
            <span style={{fontWeight: 600}}>
              {t("cardService.balance")} {internalPayments?.balance} {t("units.amd")}
            </span>
          </div>
          <Button variant="outlined" 
            style={{ color: "rgba(26,61,48,1)", border:"solid rgba(26,61,48,1) 2px"}}
            onClick={()=>{
              delete payData?.isBinding
              delete payData?.attach
              return setOpenPrepayment(true)
            }}
          >
            {t("cardService.prepayment")}
          </Button>
        </Card>
      </Box>
    </Card>
    <Card sx={stylesCard}>
      <ServiceTitle title={t("cardService.attachedCards")} />
      <div style={{display:"flex",overflow:"auto",margin:"20px"}}>
        <Card 
          className={st.smallCard}
          sx={stylesServCard} 
          onClick={addNewCreditCard}
        >
          <AddCardIcon fontSize="medium" sx={{m:"0 auto"}} />
          <div>{t("cardService.attachCard")}</div>
        </Card>
          { responseUrl && <a ref={ref} href={responseUrl}>{""}</a> }
          { internalPayments?.cards?.length ?
            internalPayments?.cards.map((card,index) => (
              <SmallCardForCarousel
                card={card}
                key={card?.cardId}
                refresh={refresh}
                setRefresh={setRefresh}
                index={index}
                setOpenConfirmation={setOpenConfirmation}
                setCurrentId={setCurrentId}
              />
            )): ""
          }
      </div>
    </Card> 
    <ConfirmDialog
      open={openConfirmation}
      close={setOpenConfirmation}
      func={()=>removeCard(currentId)}
      t={t}
      question={t("cardService.remove")}
    />
    <PrepaymentConfirm 
      isPrepayment={false}
      open={openPrepayment} 
      close={closePrepaymentDialog}
      content={internalPayments}
      payData={payData}
      setPayData={setPayData}
    />

    <Dialog open={message?.message}>
      <SnackErr message={message?.message} type={message?.type} close={setMessage} />
    </Dialog>
  </div>
  )
};

export default memo(ClientCardContainer);
