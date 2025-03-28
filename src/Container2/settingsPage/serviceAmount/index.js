import React, { useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {Card, Dialog, Divider, useMediaQuery } from '@mui/material';
import Services from './services';
import CreditCard from './creditCard/CreditCard';
import ServiceTitle from './ServiceTitle';
import CreditCardWrapper from './creditCard/CreditCardWrapper';
import { removeBankCard } from '../../../services/cardpayments/internalPayments';
import { changeCreditCardName, getPaymentCardServices, postNewCreditCard, setActiveCard } from '../../../services/internal/InternalPayments';

import styles from "./index.module.scss"
import ConfirmDialog from '../../dialogs/ConfirmDialog.js';
import SnackErr from '../../dialogs/SnackErr.js';
import HistoryCard from './serviceAmountHistory/HistoryCard.js';
import { useTheme } from '@mui/material/styles';
import HistoryTable from './serviceAmountHistory/HistoryTable.js';
import Loader from '../../loading/Loader.js';
import AutoPaymentSwitch from "./autoPayment"
import CreditCardNewName from './creditCard/CreditCardNewName.js';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ServicesV2 from './services/servicesV2.js';


const stylesCard = {
  m: window.innerWidth > 1000 ? 2 : .2,
  mb: 1,
  boxShadow: 3,
  borderRadius: 5,
  height:"fit-content",
  padding:"10px 20px"
};


const ClientCardContainer = ({logOutFunc, isBlockedUser, serviceType, lastDate}) => {
  const [internalPayments, setInternalPayments] = useState(); 
  const [payData, setPayData] = useState({
    isBinding: internalPayments?.autopayment?.hasAutoPayment,
    serviceType: serviceType,
    months: 1,
    web: true
  });
  const {t} = useTranslation()
  const [message, setMessage] = useState({message:"", type:""});
  const [isDelete,setIsDelete] = useState(false);
  const [refresh,setRefresh] = useState(false);
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [operationWithCard, setOperationWithCard] = useState({text:"",function:"", cardId:""});
  const [openDialog,setOpenDialog] = useState(false);
  const [isLoad,setIsLoad] = useState(false);
  const [cardName, setCardName] = useState({name:"",id:""});
  const [openRename, setRename] = useState(false);
  const [openAttachInfo,setOpenAttachInfo] = useState(false);


  const [isOpenHistory, setOpenHistory] = useState(false);

  const successFetch = () => {
    setIsDelete(!isDelete)
    setOpenDialog(false)
    setRefresh(!refresh)
    setMessage({message:t("dialogs.done"),type:"success"})
  };

  const removeCard = async(id=internalPayments?.autopayment?.defaultCard?.cardId) => {
    await removeBankCard(id).then((res) => {
      successFetch()
    })
  };

  const setMainCard = (id) => {
    setActiveCard(id).then((res) => {
      successFetch()
      setRename(false)
    })
  };

  const changeCardName = (id) => {
    changeCreditCardName(cardName).then((res) => {
      if(res?.status === 200) {
      successFetch()
      setRename(false)
      }
    })
  };

  const handleOperation = (eNum,id,name) => {
    if(eNum === 1) {
      setOperationWithCard({
        function: ()=> setMainCard(id),
        text: t("cardService.chooseCard")
      })
    }else if(eNum === 2) {
      setRename(true)
      setCardName({name:name,id:id})
      return
    }else{
      setOperationWithCard({
        function: () =>removeCard(id),
        text: t("cardService.remove")
      })
    }
    setOpenDialog(true)
  }

  const getInfo = async() => {
    await getPaymentCardServices().then((res) =>{
      setInternalPayments(res)
      if(!res?.isInDate && !res?.days) {
        setMessage({type:"error", message:t("cardService.notInDate")})
      }
      setPayData({
        isBinding: res?.autopayment?.hasAutoPayment,
      })
    })
  };

  const addNewCreditCard = async() => {
    setIsLoad(true)
    await postNewCreditCard().then((res) => {
      setIsLoad(false)
      window.open(res, '_blank', 'noopener,noreferrer');

    })
  };

  useEffect(() => {
    getInfo()
  }, [refresh, isDelete]);

  return (
  <div className={styles.clientContainer} >
    <Divider color="black" sx={{m:1}} />
    {isBlockedUser && <p style={{color:"red"}}>{t("cardService.notInDate")}</p>}
    {internalPayments?.isInDate && internalPayments?.days ? 
      <p style={{color:"red"}}>
        {`${t("cardService.notInDateTrueDays")}  ${lastDate} ${t("cardService.notInDateTrueDays2")}`}
      </p>: ""
    }
    <Card sx={stylesCard}>
      <div>
        <ServiceTitle title={t("landing.priceListSubTitle1")} />
        <div style={{width:"600px"}}></div>
      </div>
      <div style={{display:"flex", flexFlow:"row "}}>
        {/* {internalPayments &&
          <Services 
            content={internalPayments}
            payData={payData} 
            setPayData={setPayData}
            logOutFunc={logOutFunc}
            isDelete={isDelete}
            serviceType={serviceType}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        } */}
         {internalPayments &&
          <ServicesV2
            content={internalPayments}
            payData={payData} 
            setPayData={setPayData}
            logOutFunc={logOutFunc}
            isDelete={isDelete}
            serviceType={serviceType}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        }

      </div>
    </Card>
    <Card sx={stylesCard}>
      <div style={{display:"flex",justifyContent:"flex-start"}}>
        <ServiceTitle title={t("cardService.attachedCards")} />
        <span style={{width:"30%"}}></span>
        <AutoPaymentSwitch
          setMessage={setMessage}
          payData={payData}
          setPayData={setPayData}
          hasAutoPayment={internalPayments?.autopayment?.hasAutoPayment}
          isDefaultExist={internalPayments?.autopayment?.defaultCard}
        /> 
      </div>
      <div style={{display:"flex",justifyContent:"flex-start",flexFlow:"row wrap"}}>
          <div style={{margin:"10px"}}>
            <Card className={styles.creditCard} onClick={()=>setOpenAttachInfo(true)} style={{borderRadius:"12px",cursor:"pointer"}}>
              <div style={{margin:"auto",color:"white",alignContent:"center"}}>
                <AddCircleOutlineIcon  sx={{ fontSize:40 }} />
                <span style={{marginLeft:"5px"}}>{t("cardService.attachCard")}</span>
              </div>
            </Card>
          </div>
          {internalPayments?.cards?.length ?  internalPayments?.cards.map((card) => {
            return  <div style={{margin:"10px"}}>
              <CreditCardWrapper 
                isMain={card?.isDefault}
                handleOperation={handleOperation}
                cardId={card?.cardId}
                name={card?.bankName}
                element={<CreditCard card={card} t={t} isMain={card?.isDefault}/>}
              /> 
            </div>
          }) : <h1 style={{color:"lightgray",margin:"40px auto"}}>{t("cardService.noAttachedCards")}</h1>}

      </div>
      
      <div style={{alignItems:"start",display:"flex"}}>
        <HistoryCard setOpenHistory={setOpenHistory} t={t} />
      </div>
    </Card>
   
    <ConfirmDialog
      open={openDialog}
      close={setOpenDialog}
      func={()=>operationWithCard?.function(operationWithCard?.cardId)}
      t={t}
      title={operationWithCard?.title}
      question={operationWithCard?.text}
    />
   
    <Dialog 
      open={!!isOpenHistory} 
      onClose={()=>setOpenHistory(false)}
      fullScreen={fullScreen}
    >
      <HistoryTable  history={internalPayments?.history} setOpenHistory={setOpenHistory} />
    </Dialog>

   {message?.message &&
      <Dialog open={message?.message}>
        <SnackErr message={message?.message} type={message?.type} close={setMessage} />
      </Dialog> 
    }

    <Dialog open={!!isLoad}>
        <Loader close={setIsLoad} />
    </Dialog>
    <CreditCardNewName 
      open={openRename} 
      close={()=>setRename(false)}
      cardName={cardName}
      setCardName={setCardName}
      func={changeCardName}
    />
    <ConfirmDialog
      t={t} 
      func={addNewCreditCard} 
      open={openAttachInfo}
      close={setOpenAttachInfo}
      question={<strong>{t("cardService.attachAmount")}</strong>}
    />
  </div>
  )
};

export default memo(ClientCardContainer);
