import React, { useState, memo, useEffect } from 'react';
import { Dialog } from '@mui/material';

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

const ClientCardContainer = () => {
  
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

  useEffect(() => {
    getCards()
  }, [currentCard,isDelete]); 

  return (
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
  </div>
  )
};

export default memo(ClientCardContainer);
