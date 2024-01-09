import React, { useState, memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import AddCardIcon from '@mui/icons-material/AddCard';
import { Box, Button, Card, Dialog, Divider } from '@mui/material';

import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";

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


const responsive = {
  320: {items: 1},
  568:{items: 2},
  1024:{items: 7},
  2040:{items: 8}
};

const stylesCard = {
  m:2,
  boxShadow: 3,
  borderRadius: 5,
  height:"fit-content"
};

const stylesBox = {
  m:5,
  mb:1,
  mt:0,
  minHeight: "30dvh",
  display:"flex",
  boxShadow: 0,
  justifyContent:"space-betweeen"
};

const stylesServCard = {
  background:"#def7ee",
  borderRadius: 3
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
  <div style={{margin:"70px"}}>
    <h2> {t("cardService.btnTitle")}</h2>
    <Divider color="black" />
    {isBlockedUser && <p style={{color:"red"}}>{t("cardService.notInDate")}</p>}
    <Card sx={stylesCard}>
      <ServiceTitle title={t("landing.priceListSubTitle1")} />
      <Box sx={stylesBox}>
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
      </Box>
    </Card>

    <Card sx={stylesCard}>
      <ServiceTitle title={t("settings.paymentMethods")} />
      <AutoPaymentSwitch
        payData={payData}
        setPayData={setPayData}
      />
      <Box sx={stylesBox} >
        {internalPayments?.autopayment?.defaultCard && <CreditCardWrapper 
          setOpenConfirmation={setOpenConfirmation}
          element={<CreditCard 
            card={internalPayments?.autopayment?.defaultCard}
          />}
        />}
        <Card 
          sx={stylesServCard} 
          className={styles.attachCardContainer}
        >
          <div>
            <CardTravelIcon fontSize="large" sx={{w:10}}/>
            <span style={{marginLeft:"7px",fontWeight: 600,}}>
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

        <Card 
          sx={stylesServCard} 
          className={styles.attachCardContainer}
          onClick={addNewCreditCard}
        >
          <div>
            <AddCardIcon fontSize="large" sx={{w:10}}/>
            <span style={{marginLeft:"7px"}}>
              {t("cardService.attachCard")}
            </span>
          </div>
          {responseUrl && <a ref={ref} href={responseUrl}>{""}</a>}
        </Card>

      </Box>
     {internalPayments?.cards?.length ? 
        <Box>
          <ServiceTitle title={t("cardService.attachedCards")} />
          <div className={styles.carret}>
            {/* <AliceCarousel 
              animationDuration={1000}
              responsive={responsive}
              items={internalPayments?.cards}
              disableButtonsControls
            > */}
              {internalPayments?.cards && 
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
            {/* </AliceCarousel> */}
          </div>
        </Box> : ""
      }
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
