import React, { useState, memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import AddCardIcon from '@mui/icons-material/AddCard';
import {Button, Card, Dialog, Divider, useMediaQuery } from '@mui/material';

import Services from './services';
import CreditCard from './creditCard/CreditCard';
import ServiceTitle from './ServiceTitle';
import CreditCardWrapper from './creditCard/CreditCardWrapper';
import AutoPaymentSwitch from "./autoPayment";
import { removeBankCard } from '../../../services/cardpayments/internalPayments';
import { getPaymentCardServices, postNewCreditCard } from '../../../services/internal/InternalPayments';

import styles from "./index.module.scss"
import ConfirmDialog from '../../dialogs/ConfirmDialog.js';
import SnackErr from '../../dialogs/SnackErr.js';
import PrepaymentConfirm from './prepayment/PrepaymentConfirm.js';
import st from "./creditCard/index.module.scss";
import HistoryCard from './serviceAmountHistory/HistoryCard.js';
import { useTheme } from '@mui/material/styles';
import HistoryTable from './serviceAmountHistory/HistoryTable.js';
import PrepaymentCard from './prepayment/PrepaymentCard.js';
import styles1 from "./services/index.module.scss";


const stylesCard = {
  m: window.innerWidth > 1000 ? 2 : .2,
  mb: 1,
  boxShadow: 3,
  borderRadius: 5,
  height:"fit-content",
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
    web: true
  });
  const [openPrepayment,setOpenPrepayment] = useState(false);
  const [responseUrl,setResponseUrl] = useState("");
  const {t} = useTranslation()
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [message, setMessage] = useState({message:"", type:""});
  const [isDelete,setIsDelete] = useState(false);
  const [refresh,setRefresh] = useState(false);
  const [currentId, setCurrentId] = useState();
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [isOpenHistory, setOpenHistory] = useState(false);

  const removeCard = async(id=internalPayments?.autopayment?.defaultCard?.cardId) => {
    await removeBankCard(id).then((res) => {
      setIsDelete(!isDelete)
      setOpenConfirmation(false)
      setMessage({message:t("dialogs.done"),type:"success"})
    })
  };
  

  const getInfo = async() => {
    await getPaymentCardServices().then((res) =>{
      setInternalPayments(res)
      if(!res?.isInDate && res?.days){
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
      return setResponseUrl(res)
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
    {/* services part  */}
    <Card sx={stylesCard}>
      <ServiceTitle title={t("landing.priceListSubTitle1")} />
      <div style={{display:"flex", flexFlow:"row nowrap"}}>
        {internalPayments &&
          <Services 
            content={internalPayments}
            payData={payData} 
            setPayData={setPayData}
            logOutFunc={logOutFunc}
            isDelete={isDelete}
          />
        }
        <div style={{display:"flex",flexFlow:"column", background:"white"}} className={styles1.service_item}>
          {internalPayments?.autopayment?.defaultCard ? 
            <AutoPaymentSwitch
              payData={payData}
              setPayData={setPayData}
            /> : ""
          }
        <PrepaymentCard 
            internalPayments={internalPayments}
            payData={payData}
            setOpenPrepayment={setOpenPrepayment}
          />
          <HistoryCard setOpenHistory={setOpenHistory}/>
        </div>
      </div>
    </Card>
{/* card part prepaymenmt */}
    <Card sx={stylesCard}>
    <ServiceTitle title={t("cardService.attachedCards")} />
      <div style={{display:"flex", flexFlow:"row wrap"}}>

        {/* <div className={styles.payWay}>
          <h6>Default Card</h6> */}
          {internalPayments?.autopayment?.defaultCard ?
            <CreditCardWrapper 
            setOpenConfirmation={setOpenConfirmation}
            element={<CreditCard card={internalPayments?.autopayment?.defaultCard}
            />}
            />:""}
        {/* </div> */}

            {/* <Card 
              className={st.smallCard}
              sx={stylesServCard} 
              onClick={addNewCreditCard}
            >
              <AddCardIcon fontSize="medium" sx={{m:"0 auto"}} />
              <div>{t("cardService.attachCard")}</div>
            </Card> */}
            {internalPayments?.cards &&  internalPayments?.cards.map((card) => {
              return <CreditCardWrapper 
                setOpenConfirmation={setOpenConfirmation}
                element={<CreditCard card={card}/>}
              />
            })}
      </div>
      <Button
        startIcon={<AddCardIcon fontSize="medium" sx={{m:"0 auto"}} />}
        onClick={addNewCreditCard}
      >
       {t("cardService.attachCard")}
      </Button>
    </Card>
    {/* <Card sx={stylesCard}>
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
          // { responseUrl && <a ref={ref} href={responseUrl}>{""}</a> }
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
    </Card>  */}
     { responseUrl && <a ref={ref} href={responseUrl}>{""}</a> }

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
    <Dialog 
      open={isOpenHistory} 
      onClose={()=>setOpenHistory(false)}
      fullScreen={fullScreen}
    >
      <HistoryTable  history={internalPayments?.history} setOpenHistory={setOpenHistory} />
    </Dialog>

    <Dialog open={message?.message}>
      <SnackErr message={message?.message} type={message?.type} close={setMessage} />
    </Dialog>
  </div>
  )
};

export default memo(ClientCardContainer);
