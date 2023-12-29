import { Button, Dialog, DialogActions, DialogContent, Divider, IconButton, Input } from '@mui/material';
import React, { memo, useEffect, useRef, useState } from 'react';

import styles from "./index.module.scss";
import { useTranslation } from 'react-i18next';
import Loader from '../../../loading/Loader';
import { bindNewCard, payAndSubscribe } from '../../../../services/cardpayments/internalPayments';
import ConfirmDialog from '../../../dialogs/ConfirmDialog';
import ActionMessage from '../../../dialogs/ActionMessage';
import { payForServiceWithAttachedCard, payForServiceWithNewCard } from '../../../../services/internal/InternalPayments';

const PaymentConfirm = ({
  open,
  close,
  cardArr,
  setPayData, 
  payData, 
  content,
  price,
}) => {
  console.log(payData,"paydata in dialog")
  const {t} = useTranslation();
  const [load,setLoad] = useState(false);
  const [openDialog, setOpenDialog]= useState();
  const [openPayDialog, setOpenPayDialog]= useState();
  const [message, setMessage] = useState({message:"", type:""});
  const [activateBtn,setActivateBtn] = useState(false);
  const [newLink,setNewLink] = useState("")
  const ref = useRef();

  const getLinkForNewCard = async() => {
    setLoad(true)
    await bindNewCard().then((res) => {
      if(res) {
        window.location.href = res?.formUrl
      }
      setLoad(false)
    })
  } ;

  const payForService = async() => {
    setLoad(true)
    let response = "";
    if(activateBtn === 1) {
      response = await payForServiceWithAttachedCard(payData)
    }else{
      response = await payForServiceWithNewCard(payData).then((res) => {
        setLoad(false)       
        !res?.error ? setNewLink(res?.formUrl):
        setMessage({message:t("dialog.wrong"), type:"error"})

      })
    }
    console.log(response,"respomse")
  };

  useEffect(() => {
    setActivateBtn(false)
  },[open])

  useEffect(() => {
    newLink && ref?.current.click()
  },[newLink]);
  
  return (
    <>
      <Dialog
        open={open}
        onClose={close}  
      >
      {!content?.isInDate &&
        <DialogContent>
          <h4 style={{margin:"10px 0px"}}>
            {t("basket.totalndiscount")} <span style={{textDecoration:"underline"}}> {price} {t("units.amd")}</span>
          </h4>
          {!content?.autopayment?.defaultCard && 
            <>
              <input
                id="activeCard"
                type="radio"
                name="pay operation"
                onChange={()=> {
                  delete payData?.attach
                  setActivateBtn(1)
                  setPayData({
                    ...payData,
                    cardId: content?.autopayment?.defaultCard
                  })
                }}
              />
              <label htmlFor="activeCard" style={{marginLeft:"10px",textAlign:"center"}}>
                {t("settings.payByActiveCard")}
              </label>
            </>
          }
          {!cardArr?.length &&
            <div style={{fontWeight:600}}>
              {t("cardService.chooseAnotherCard")}
              <Divider sx={{bgcolor:"black"}}/>
              {cardArr.map((card) =>(
                <label>
                  <input
                    type="radio"
                    name="pay operation"
                    onChange={() => {
                      delete payData?.attach
                      setActivateBtn(1)
                      setPayData({
                        ...payData,
                        cardId: card?.cardId
                      })
                    }}
                  />
                  <div className={styles.inputLabel}>
                    {card?.pan.slice(0,4)} **** **** {card?.pan.slice(-4)}
                    {card?.isActive && 
                    <span style={{fontSize:"70%",color:"green",marginLeft:"5px",letterSpacing:"1px"}}>({t("settings.active")})</span>}
                  </div>
                </label>
              ))}
            </div>
          }
          <Divider sx={{bgcolor:"black"}} />
            <div>
              <input 
                id="no attach"
                type="radio"
                name="pay operation"
                onChange={()=>{
                  delete payData?.cardId
                  setActivateBtn(2)
                  setPayData({
                    ...payData,
                    attach: false
                  })
                }}
              />
              <label htmlFor="no attach" style={{marginLeft:"10px",textAlign:"center"}}>
                {t("settings.payWithNewCard")}
              </label>
            </div>
            <div>
              <input 
                id="attach"
                type="radio" 
                name="pay operation"
                onChange={()=>{
                  delete payData?.cardId
                  setActivateBtn(2)
                  setPayData({
                    ...payData,
                    attach: true
                  })
                  console.log("pay with attach new card")
                }}
              />
              <label htmlFor="attach" style={{marginLeft:"10px",textAlign:"center"}}>
                {t("settings.payWithNewCardAndAttach")}
              </label>
            </div>
        </DialogContent>
      }
      <DialogActions>
        <Button
          variant="contained"
          onClick={close}
        >
          {t("buttons.cancel")}
        </Button>
        <Button 
          disabled={!activateBtn}
          variant="contained"
          onClick={()=>{
            setOpenPayDialog(true)
           
          }}
        >
          {t("basket.linkPayment")}
        </Button>
      </DialogActions>
    </Dialog>
    {newLink && <a ref={ref} href={newLink}>""</a>}

    <ConfirmDialog
      question={t("cardService.attanchAmount")}
      func = {getLinkForNewCard}
      title = {t("cardService.newCard")}
      open= {openDialog}
      close = {setOpenDialog}
      content={""}
      t={t}
    />
    <ConfirmDialog
      question={`${t("cardService.payForService")} ${price} ${t("units.amd")}`}
      func = {payForService}
      open = {openPayDialog}
      close = {setOpenPayDialog}
      content={""}
      t={t}
    />
    <Dialog open={load}>
      <Loader />
    </Dialog>
    {message?.message && 
      <ActionMessage
        type={message?.type}
        message={message?.message}
        setMessage={setMessage}
      />
    }
    </>
  )
}

export default memo(PaymentConfirm);
