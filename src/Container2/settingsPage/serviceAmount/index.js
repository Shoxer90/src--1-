import React, { useState, memo, useEffect } from 'react';
import { Card, Dialog } from '@mui/material';

import CreditCard from './CreditCard';
import styles from "./index.module.scss";
import ClientPay from './ClientPay';
import { useTranslation } from 'react-i18next';
import ActivateCreditCard from './ActivateCreditCard';

import CreditCardWrapper from './CreditCardWrapper';
import ConfirmDialog from '../../dialogs/ConfirmDialog';
import { getUserCards } from '../../../services/cardpayments/getUserCard';
import { changeActiveStatus, getServiceHistoryAndPayAmount, removeBankCard } from '../../../services/cardpayments/internalPayments';
import ServiceAmountHistory from './serviceAmountHistory';
import SnackErr from '../../dialogs/SnackErr';
const ClientCardContainer = () => {
  
  const {t} = useTranslation()
  const [userCardInfo,setUserCardInfo] =  useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState("");
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [page,setPage] = useState("1");
  const [message, setMessage] = useState({message:"", type:""});
 
  const [historyAndCardData, setHistoryAndCardData] = useState([]);
  const [payData,setPayData] = useState({
    serviceType: 0,
    // price: commitment,
    isBinding: true
  });

  const getServiceAmountHistory = async() => {
    await getServiceHistoryAndPayAmount().then((res) => {
    res.forEach((item, index) => {
      if(index === 0) {
        setPayData({
          "serviceType": 0,
          "price": +item?.price - item?.serviceChargeBalance,
          "isBinding": true
        })
      }
    })
    setHistoryAndCardData(res)
   })
  }



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
    await getUserCards().then((resp) => {
    resp && resp.map((card) => {
      const fullName = card?.cardHolder.split(" ");
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
    return setUserCardInfo(cardArr);
  }) 
  };

  // const setActiveCard = () => {
  //   let flag=0;
  //   userCardInfo.map((item) => {
  //     if(item?.isActive){
  //       flag+=1
  //       return setCurrentCard(item)
  //     }
  //   })
  //   if(!flag){
  //     changeActiveCard(userCardInfo[0]?.id)
  //     setCurrentCard(userCardInfo[0])
  //   } 

  // };

  // const changeActiveCard = (id) => {
  //   const newArr = []
  //   userCardInfo.map((item) => {
  //     if(item?.id !== id){
  //      return newArr.push({
  //         ...item,
  //         isActive: false,
  //       })
  //     }else{
  //      return newArr.push({
  //         ...item,
  //         isActive: true,
  //       })
  //     }
  //   })
  //   setUserCardInfo(newArr)
  // };

  // const updateCreditCard = (newCard) => {
  //   const newCardArr = [];
  //   userCardInfo.map((item) => {
  //     if(newCard?.id === item?.id){
  //      return newCardArr.push(newCard)
  //     }else{
  //      return newCardArr.push(item)
  //     }
  //   })
  //   setUserCardInfo(newCardArr)
    
  //   setIsOpenUpdate(false)
  // };
 
  // const createCreditCard = async(newCard) => {
  //   let flag=0;
  //   userCardInfo.map((item) => {
  //     if(item?.cardNumOrigin === newCard?.cardNumOrigin){
  //       return flag+=1
  //     }
  //   })
  //   if(!flag){
  //     setUserCardInfo([
  //      ...userCardInfo,
  //      {
  //        ...newCard,
  //        id:`${newCard?.name}${newCard?.cardNumOrigin.slice(8,15)}`,
  //      }
  //    ])
  //    setNewCard({
  //      id:"",
  //      isActive: false,
  //      name:"",
  //      surname:"",
  //      bank: "",
  //      expMonth: "",
  //      expYear:"",
  //      cvv:"",
  //      cardNumOrigin:"",
  //    })
  //    setIsOpen(false)
  //   }else{
  //     setMessage({type:"error",message:t("")})
  //   }
  // };
  useEffect(() => {
    getServiceAmountHistory()
  }, []);

  useEffect(() => {
    getCards()
  }, [currentCard]); 

  return (
    <Card
      sx={{ 
        width: "95%",
        alignSelf:"center",
        position: "absolute",
        top: "70px",
        left: 0,
        m: 4, 
        boxShadow: 12, 
        height: "86vh",
        display: "inline-block", 
        overflowY: "auto",
        padding: 5
      }}
    >
      <>
      <h2 className={styles.cardTitleGroup} style={{display:"flex",justifyContent:"center"}}>
        <span 
          style={{color:page==="1"?"#FFA500":"black"}}
          className={styles.cardTitleGroup_item} 
          onClick={()=>setPage("1")}
        >
          {t("cardService.btnTitle")}
        </span>{" / "}

        <span 
          style={{color:page==="2"?"#FFA500":"black"}}
          className={styles.cardTitleGroup_item} 
          onClick={()=>setPage("2")}
        >
          {t("menubar.history")}
        </span>
      </h2>
      {page === "1" ?
        <div className={styles.card_pay_info}>
          <div >
            {
              userCardInfo && userCardInfo.map((item, index) => (
               item?.isActive ?
                <CreditCardWrapper 
                  setOpenConfirmation={setOpenConfirmation}
                  element={<CreditCard 
                    key={index} 
                    userCardInfo={item}
                  />}
                /> :""
              ))
            }
            {userCardInfo?.length ? 
              <ActivateCreditCard 
                currentCard={currentCard}
                t={t} 
                userCardInfo={userCardInfo} 
                changeActiveCard={changeActiveCard}
               /> :
              <div className={styles.creditCard} style={{justifyContent:"center",cursor:"pointer"}} onClick={()=>setIsOpen(!isOpen)}>
                {t("cardService.createCard2")}
              </div>
            }
          </div>
          {userCardInfo && 
          <ClientPay 
            t={t} 
            cardArr={userCardInfo} 
            currentCard={currentCard}
            setCurrentCard={setCurrentCard}
            changeActiveCard={changeActiveCard}
            historyAndCardData={historyAndCardData}
        /> }      
        </div> :
          <ServiceAmountHistory historyAndCardData={historyAndCardData} t={t}/>
      }
          {/* <Button 
            startIcon={<AddCircleIcon fontSize="large" />}  
            sx={{m:10,bgcolor:"#28A745"}} 
            variant="contained"
            onClick={()=>setIsOpen(!isOpen)}
          >
           {t("cardService.createCard")}
          </Button> */}
          {/* <AddNewCard 
            func={createCreditCard}
            card={newCard}
            setCard={setNewCard}
            isOpen={isOpen} 
            setIsOpen={setIsOpen} 
            t={t} 
            title={t("cardService.createCard")}
            btn={t("buttons.create")}
          />
          <AddNewCard 
            func={updateCreditCard}
            card={currentCard}
            setCard={setCurrentCard}
            isOpen={isOpenUpdate} 
            setIsOpen={setIsOpenUpdate} 
            t={t} 
            title={t("cardService.updateCard")}
            btn={t("buttons.save")}
          /> */}
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
      </>
    </Card>
  )
}

export default memo(ClientCardContainer);
