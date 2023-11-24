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
  const [isOpen, setIsOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState("");
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [message, setMessage] = useState({message:"", type:""});
  const [payForSeveralServices, setPayForSeveralServices] = useState(true);
  const [paymentAmount,setPaymentAmount] = useState(0);
  const [historyAndCardData, setHistoryAndCardData] = useState([]);
  // const [payData,setPayData] = useState({
  //   serviceType: 0,
  //   // price: commitment,
  //   isBinding: true
  // });

  const  defaultCardTexts= {
    name:"XXXX",
    surname:"XXXXXXXX",
    bank: "XXXXXX XXXX",
    expMonth: "mm",
    expYear:"yy",
    cvv:"",
    cardNumOrigin:"xxxxxxxxxxxxxxxxxx",
  };

  const removeCard = async(id) => {
    await removeBankCard(id).then((res) => {
    if(res === 200) {
      setMessage({message:t("dialogs.done"),type:"success"})
    }else{
      setMessage({message:t("dialogs.wrong"),type:"error"})
    }
  })
 };

  const changeActiveCard = async(id) => {
   await changeActiveStatus(id).then((res) => {
    })
  setCurrentCard(id)
};

  const getCards = async() => {
    let cardArr = [];
    let fullName = '';
    await getUserCards().then((resp) => {
      console.log(resp,"ACRDDD")
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
    console.log(cardArr,"CARD ARAY")
    console.log(currentCard,"current card")
    return setUserCardInfo(cardArr);
  }) 
  };

  useEffect(() => {
    getCards()
  }, [currentCard]); 

  return (
    <div className={styles.userService}>
      <h2 style={{color:"#FFA500"}}>{t("cardService.btnTitle")}</h2>
        <div className={styles.card_pay_info}>
          <div style={{display:"flex",alignItems:"center"}}>
            {
              userCardInfo && userCardInfo.map((item, index) => (
               item?.isActive ?
                <CreditCardWrapper 
                  key={index}
                  setOpenConfirmation={setOpenConfirmation}
                  element={<CreditCard 
                    key={index} 
                    userCardInfo={item }
                  />}
                /> :<CreditCardWrapper 
                setOpenConfirmation={setOpenConfirmation}
                element={<CreditCard 
                  key={index} 
                  userCardInfo={<CreditCardWrapper 
                    setOpenConfirmation={setOpenConfirmation}
                    element={<CreditCard 
                      key={index} 
                      userCardInfo={<CreditCardWrapper 
                        setOpenConfirmation={setOpenConfirmation}
                        element={<CreditCard 
                          key={index} 
                          userCardInfo={defaultCardTexts}
                        />}
                      />}
                    />}
                  />}
                />}
              />
              ))
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
