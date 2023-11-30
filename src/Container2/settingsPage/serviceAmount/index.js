import React, { useState, memo, useEffect } from 'react';
import { Button, Checkbox, Dialog, FormControlLabel } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';

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
  const [paymentAmount,setPaymentAmount] = useState(0);
  const [historyAndCardData, setHistoryAndCardData] = useState([]);
  const [isDelete,setIsDelete] = useState(false);

  // const [payData,setPayData] = useState({
  //   serviceType: 0,
  //   // price: commitment,
  //   isBinding: true
  // });

  const removeCard = async(id) => {
    await removeBankCard(id).then((res) => {
      setIsDelete(!isDelete)
      setOpenConfirmation(false)
      setMessage({message:t("dialogs.done"),type:"success"})
      changeActiveCard(userCardInfo[0]?.cardId)
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
        fullName =  resp[0]?.cardHolder.split(" ");
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
        return changeActiveCard(resp[0]?.cardId)
      }
    resp && resp.map((card) => {
      fullName = card?.cardHolder.split(" ");
      if(card?.isActive === true){
        setCurrentCard(card?.cardId)
      }
      return cardArr.push({
        id: card?.cardId,
        isActive: card?.isActive,
        name: fullName[0],
        surname: fullName[1],
        bank: card?.bankName,
        expMonth: card?.expiration.slice(-2),
        expYear: card?.expiration.slice(0,4),
        cardNumOrigin: card?.pan,
      })
    })
    if (!currentCard) {
      changeActiveCard(resp[0]?.cardId)
    }
    return setUserCardInfo(cardArr);
  }) 
  };

  useEffect(() => {
    getCards()
  }, [currentCard,isDelete]); 

  return (
    <div className={styles.userService}>
      <h2 style={{color:"#FFA500"}}>{t("cardService.btnTitle")}</h2>
        <div className={styles.card_pay_info}>
          <div style={{display:"flex",alignItems:"center"}}>
            {
              userCardInfo?.length && userCardInfo.map((item, index) => {
                if(item?.isActive) {
                  return <CreditCardWrapper 
                    key={index}
                    setOpenConfirmation={setOpenConfirmation}
                    element={<CreditCard 
                      key={index} 
                      userCardInfo={item }
                    />}
                  />
                }
            })
            }
            <ServicePayDetails
              t={t}
              paymentAmount={paymentAmount}
              currentCard={currentCard}
              userCardInfo={userCardInfo}
              changeActiveCard={changeActiveCard}
              setPayForSeveralServices={setPayForSeveralServices}
              payForSeveralServices={payForSeveralServices}
            />
          </div>
            {userCardInfo &&
              <Services 
                t={t} 
                payForSeveralServices={payForSeveralServices}
                setPaymentAmount={setPaymentAmount}
                paymentAmount={paymentAmount}
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
        {/* <ServiceAmountHistory historyAndCardData={historyAndCardData} t={t}/> */}
        {message &&
          <Dialog open={Boolean(message?.message)}>
            <SnackErr message={message?.message} close={setMessage} type={message?.type} />
          </Dialog>
        }
    </div>
  )
}

export default memo(ClientCardContainer);
