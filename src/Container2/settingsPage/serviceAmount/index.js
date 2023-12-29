import React, { useState, memo, useEffect, useRef } from 'react';
import { Box, Card, Divider } from '@mui/material';
import AddCardIcon from '@mui/icons-material/AddCard';

import CreditCard from './creditCard/CreditCard';
import { useTranslation } from 'react-i18next';

import CreditCardWrapper from './creditCard/CreditCardWrapper';
import { getUserCards } from '../../../services/cardpayments/getUserCard';
import { changeActiveStatus, removeBankCard } from '../../../services/cardpayments/internalPayments';
import Services from './services';
import ServiceTitle from './ServiceTitle';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import { getPaymentCardServices, postNewCreditCard } from '../../../services/internal/InternalPayments';
import AutoPaymentSwitch from "./autoPayment/index.js";
import SmallCardForCarousel from './creditCard/SmallCardForCarousel.js';
import styles from "./index.module.scss"
const responsive = {
  320: {items: 1},
  568:{items: 2},
  1024:{items: 7},
  2040:{items: 8}

}


const stylesCard = {
  m:2,
  boxShadow: 3,
  borderRadius: 5,
  height:"fit-content"
  
}
const stylesBox = {
  m:5,
  mb:1,
  mt:0,
  minHeight: "30dvh",
  display:"flex",
  boxShadow: 0,
  justifyContent:"space-betweeen"
}
const stylesServCard = {
  m:2,
  width:"30dvw",
  background:"#f4ebfe",
  borderRadius: 3
}

const ClientCardContainer = () => {
  const ref = useRef();
  const [internalPayments, setInternalPayments] = useState({}); 
  const [payData, setPayData] = useState({
    isBinding: internalPayments?.autopayment?.hasAutoPayment,
    serviceType: null,
  });
  const [responseUrl,setResponseUrl] = useState("");

 
  const {t} = useTranslation()
  const [userCardInfo,setUserCardInfo] = useState([]);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [message, setMessage] = useState({message:"", type:""});
  const [isDelete,setIsDelete] = useState(false);
  const [refresh,setRefresh] = useState(false);

  const removeCard = async(id) => {
    await removeBankCard(id).then((res) => {
      setIsDelete(!isDelete)
      setOpenConfirmation(false)
      changeActiveCard(userCardInfo[0]?.cardId)
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

    <Card sx={stylesCard}>
      <ServiceTitle title={t("landing.priceListSubTitle1")} />
      <Box sx={stylesBox}>
      {internalPayments &&
          <Services 
            content={internalPayments}
            t={t} 
            userCardInfo={userCardInfo}
            changeActiveCard={changeActiveCard}
            payData={payData} 
            setPayData={setPayData}
          />
        }
      </Box>
    </Card>

    <Card sx={stylesCard}>
      <ServiceTitle title={t("settings.paymentMethods")} />
      {/* <AutoPaymentSwitch
        payData={payData}
        setPayData={setPayData}
        isAutoPay={internalPayments?.autopayment?.hasAutoPayment}
      /> */}
      <Box sx={stylesBox} >
       {internalPayments?.autopayment?.defaultCard && <CreditCardWrapper 
            setOpenConfirmation={setOpenConfirmation}
            element={<CreditCard 
              card={internalPayments?.autopayment?.defaultCard}
            />}
        />}
        <Card 
          sx={stylesServCard} 
          style={{width:"340px",height: "180px", display:"flex",justifyContent:"center",alignItems:"center",cursor:"pointer", margin:"0 20px"}}
          onClick={addNewCreditCard}
        >
          <AddCardIcon fontSize="large" sx={{w:10}}/>
          <span style={{marginLeft:"7px"}}>
            {t("cardService.attachCard")}
          </span>
          {responseUrl && <a ref={ref} href={responseUrl}>""</a>}
        </Card>

      </Box>
     {internalPayments?.cards?.length ? 
        <Box>
          <ServiceTitle title={t("cardService.chooseCard")} />
          <div className={styles.carret}>
            <AliceCarousel 
              animationDuration={1000}
              responsive={responsive}
              items={internalPayments?.cards}
              disableButtonsControls
            >
              {internalPayments?.cards && 
                internalPayments?.cards.map((card) => (
                  <SmallCardForCarousel 
                    card={card} 
                    key={card?.cardId}
                    refresh={refresh}
                    setRefresh={setRefresh}
                  />
                ))
              }   
            </AliceCarousel>
          </div>
        </Box> : ""
      }
    </Card>
  </div>
  )
};

export default memo(ClientCardContainer);
