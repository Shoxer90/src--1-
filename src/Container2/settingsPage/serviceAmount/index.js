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
  // m:5,
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
  const [internalPayments, setInternalPayments] = useState({}); 
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

  const removeCard = async(id) => {
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

  const getInfo = async() => {
    await getPaymentCardServices().then((res) =>{
      setInternalPayments(res)
      console.log(res,"resssss")
      if(!res?.isInDate){
        setMessage({message:t("cardService.notInDate"), type:"error"})
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

  useEffect(() => {
    getInfo()
  }, [refresh]);

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
          t={t} 
          changeActiveCard={changeActiveCard}
          payData={payData} 
          setPayData={setPayData}
          logOutFunc={logOutFunc}
        />
      }
    </Card>

    <Card sx={stylesCard}>
      <ServiceTitle title={t("settings.paymentMethods")} />
      <AutoPaymentSwitch
        payData={payData}
        setPayData={setPayData}
      />

      <Box sx={stylesBox} className={styles.payWay}>

        {internalPayments?.autopayment?.defaultCard && 
          <CreditCardWrapper 
            setOpenConfirmation={setOpenConfirmation}
            element={<CreditCard card={internalPayments?.autopayment?.defaultCard}/>}
          />
        }

        <Card className={styles.attachCardContainer} sx={{borderRadius:4,background:"#def7ee"}}>
          <div>
            <CardTravelIcon fontSize="large" />
            <span style={{fontWeight: 600}}>
              {t("cardService.balance")} 6000 AMD
            </span>
          </div>
          <Button variant="outlined" 
            style={{ color: "rgba(26,61,48,1)", border:"solid rgba(26,61,48,1) 2px"}}
            onClick={()=>setOpenPrepayment(true)}
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
          { internalPayments?.cards?.length && 
            internalPayments?.cards.map((card,index) => (
              <SmallCardForCarousel
                card={card}
                key={card?.cardId}
                refresh={refresh}
                setRefresh={setRefresh}
                index={index}
              />
            ))
          }
      </div>
    </Card> 
    <ConfirmDialog
      open={openConfirmation}
      close={setOpenConfirmation}
      func={removeCard}
      t={t}
      question={t("cardService.remove")}
    />
    <PrepaymentConfirm open={openPrepayment} close={()=>setOpenPrepayment(false)}/>

    <Dialog open={message?.message}>
      <SnackErr message={message?.message} type={message?.type} close={setMessage} />
    </Dialog>
  </div>
  )
};

export default memo(ClientCardContainer);
