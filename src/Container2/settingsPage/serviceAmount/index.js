import React, { useState, memo, useEffect } from 'react';
import { Box, Card, Dialog, Divider } from '@mui/material';
import AddCardIcon from '@mui/icons-material/AddCard';

import CreditCard from './creditCard/CreditCard';
import styles from "./index.module.scss";
import { useTranslation } from 'react-i18next';
import ServicePayDetails from "./payDetails";

import CreditCardWrapper from './creditCard/CreditCardWrapper';
import ConfirmDialog from '../../dialogs/ConfirmDialog';
import { getUserCards } from '../../../services/cardpayments/getUserCard';
import { changeActiveStatus, removeBankCard } from '../../../services/cardpayments/internalPayments';
import SnackErr from '../../dialogs/SnackErr';
import Services from './services';
import { Title } from '@mui/icons-material';
import ServiceTitle from './ServiceTitle';
import AliceCarousel from 'react-alice-carousel';
import { getPaymentCardServices } from '../../../services/internal/InternalPayments';

const responsive = {
  0: {items: 1},
  568:{items: 3},
  1024:{items: 5}
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
  height: "30dvh",
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
  const [internalPayments, setInternalPayments] = useState({}); 

 
  const {t} = useTranslation()
  const [userCardInfo,setUserCardInfo] = useState([]);
  const [currentCard, setCurrentCard] = useState("");
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [message, setMessage] = useState({message:"", type:""});
  const [payForSeveralServices, setPayForSeveralServices] = useState(true);
  const [historyAndCardData, setHistoryAndCardData] = useState([]);
  const [isDelete,setIsDelete] = useState(false);
  const [hadIsActive, setHadIsActive] = useState(false);
  // const [openDialogForPay,setOpenDialogForPay] = useState(false);
 

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
     setCurrentCard(id)
    })
  };

  const getCards = async() => {
    let cardArr = [];
    let fullName = '';
    await getUserCards().then((resp) => {
      if(resp.length === 1){
        fullName = resp[0]?.cardHolder.split(" ");
        setUserCardInfo([{
          id: resp[0]?.cardId,
          name: fullName[0],
          surname: fullName[1],
          bank: resp[0]?.bankName,
          expMonth: resp[0]?.expiration.slice(-2),
          expYear: resp[0]?.expiration.slice(0,4),
          cardNumOrigin: resp[0]?.pan,
          isActive: true
        }])
        changeActiveCard(resp[0]?.cardId)
        return
      }else{
        resp && resp.map((card) => {
          fullName = card?.cardHolder.split(" ");
          cardArr.push({
            id: card?.cardId,
            isActive: card?.isActive,
            name: fullName[0],
            surname: fullName[1],
            bank: card?.bankName,
            expMonth: card?.expiration.slice(-2),
            expYear: card?.expiration.slice(0,4),
            cardNumOrigin: card?.pan,
          })
          if(card?.isActive === true){
            setHadIsActive(true)
            setCurrentCard(card?.cardId)
          }
          return cardArr
        })
      }
      if(!hadIsActive){
        changeActiveCard(resp[0]?.cardId)
      }
      return setUserCardInfo(cardArr)
    }) 
  };
  const getInfo = async() => {
    await getPaymentCardServices().then((res) =>{
      console.log(res,"RESULT IN COMPONENT")
      setInternalPayments(res)
    })

  }

  useEffect(() => {
    getInfo()
  }, []);
  

  return (
  <div style={{margin:"70px"}}>
    <h2> {t("cardService.btnTitle")}</h2>
    <Divider color="black" />

    <Card sx={stylesCard}>
      <ServiceTitle title={t("landing.priceListSubTitle1")} />
      <Box sx={stylesBox}>
        {[1,2,3].map((item) => {
          return <Card sx={stylesServCard}>
            Service N {item}
          </Card>
        })}
      </Box>
    </Card>

    <Card sx={stylesCard}>
      <ServiceTitle  title={t("settings.paymentMethods")} />
      <Box sx={stylesBox} >
        <CreditCardWrapper 
            setOpenConfirmation={setOpenConfirmation}
            element={<CreditCard 
          />}
        />
        <Card 
          sx={stylesServCard} 
          style={{width:"340px",height: "180px", display:"flex",justifyContent:"center",alignItems:"center",cursor:"pointer", margin:"0 20px"}}
        >
          <AddCardIcon fontSize="large" sx={{w:10}}/>
          <span style={{marginLeft:"7px"}}>
            {t("cardService.attachCard")}
          </span>
        </Card>
      </Box>
    </Card>

    <Card sx={stylesCard}>
      <ServiceTitle title={t("cardService.chooseCard")} />
      <div style={{display:"flex"}}>
        <AliceCarousel 
          // autoPlay 
          // infinite
          // autoPlayInterval={2500}
          // animationDuration={1000}
          // disableButtonsControls
        >
          {internalPayments?.cards && internalPayments?.cards.map((cardItem) => (
            <CreditCardWrapper 
              setOpenConfirmation={setOpenConfirmation}
              element={
                <CreditCard 
                
                />
              }
            />))
          }
        </AliceCarousel>
      </div>

      {/* </div> */}
      </Card>
    

{/* 
    <div className={styles.userService}>
      <div className={styles.card_pay_info}>
        <div style={{display:"flex", flexFlow:"column", alignItems:"center"}}>
          {
            userCardInfo?.length && userCardInfo.map((item, index) => {
              return item?.isActive &&
                <CreditCardWrapper 
                key={index}
                setOpenConfirmation={setOpenConfirmation}
                element={<CreditCard 
                  key={index} 
                  userCardInfo={item}
                />}
              />
            })
          }
          <ServicePayDetails
            t={t}
            currentCard={currentCard}
            userCardInfo={userCardInfo}
            changeActiveCard={changeActiveCard}
          />
        </div>
        {userCardInfo &&
          <Services 
            t={t} 
            payForSeveralServices={payForSeveralServices}
            userCardInfo={userCardInfo}
            changeActiveCard={changeActiveCard}
          />
        }
      </div> 
      <ConfirmDialog
        question={t("cardService.remove")}
        func={()=>removeCard(currentCard)}
        title={t("settings.remove")}
        open={openConfirmation}
        close={setOpenConfirmation}
        content={" "}
        t={t}
      />
      {message &&
        <Dialog open={Boolean(message?.message)}>
          <SnackErr message={message?.message} close={setMessage} type={message?.type} />
        </Dialog>
      }
    </div> */}
  </div>
  )
};

export default memo(ClientCardContainer);
