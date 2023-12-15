import { Button, Dialog, DialogActions, DialogContent, Divider, IconButton } from '@mui/material';
import React, { memo, useState } from 'react';

import styles from "./index.module.scss";
import { useTranslation } from 'react-i18next';
import Loader from '../../../loading/Loader';
import { bindNewCard, payAndSubscribe } from '../../../../services/cardpayments/internalPayments';
import ConfirmDialog from '../../../dialogs/ConfirmDialog';
import ActionMessage from '../../../dialogs/ActionMessage';
import inputStyle from "../../../../Container/Bascket/"

const PaymentConfirm = ({
  open,
  close,
  cardArr,
  changeActiveCard, 
  setPayData, 
  payData, 
}) => {
  const {t} = useTranslation();
  const [load,setLoad] = useState(false);
  const [openDialog, setOpenDialog]= useState();
  const [openPayDialog, setOpenPayDialog]= useState();
  const [message, setMessage] = useState({message:"", type:""});

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
    await payAndSubscribe({
      ...payData,
    }).then((res) => {
      setLoad(false)
      setMessage({message:t(""), type:"success"})
    })
  };

  const onlyNumberAndADot = (event) => {
    const valid = /^\d*\.?(?:\d{1,2})?$/;
    const text = event.target.value;  
    if(valid.test(text)){
      setPayData({
        ...payData,
        price:+event.target.value
      })
    }else{
      return 
    }
  };   

  return (
    <>
    <Dialog
      open={open}
      onClose={close}  
      >
      { payData &&
      <DialogContent>
        <h4 style={{margin:"10px 0px"}}>{t("settings.payByActiveCard")}</h4>
        <label
          className={inputStyle.basketContent_item_quantity}
         >
          {t("basket.totalndiscount")}
          <input
            style={{padding: "3px"}}
            value={payData?.price}
            onChange={(e) => onlyNumberAndADot(e)}
          />
        </label>
        <div className={styles.cardList}>
        {cardArr && cardArr.map((card) => (
          
          <label key={card?.cardId}  className={styles.cardList_item}>
            <input 
              key={card?.cardId}  
              type="checkbox" 
              checked={payData?.serviceType !=="2" && card?.isActive}  
              onClick={()=>{
                if(!card?.isActive) {
                  setPayData({
                    ...payData,
                    serviceType: 1
                  })
                  changeActiveCard(card?.id)
                }
              }}
            />
            <div className={styles.inputLabel}>
              {card?.cardNumOrigin.slice(0,4)} **** **** {card?.cardNumOrigin.slice(-4)}
              {card?.isActive && 
              <span style={{fontSize:"70%",color:"green",marginLeft:"5px",letterSpacing:"1px"}}>({t("settings.active")})</span>}
            </div>
          </label>
        ))}
        </div>
        <div>
          <Divider sx={{bgcolor:"black"}}/>
          <input 
            type="checkbox" 
            className={styles.inputLabel}
            checked={payData?.serviceType !== "1" && Boolean(payData?.serviceType === 2)}
            onChange={()=>setPayData({
              ...payData,
              serviceType:2
            })}
          />
          <span className={styles.inputLabel} style={{fontSize:"80%"}}>
            {t("settings.addCard")}
          </span>
        </div>

      </DialogContent>}
      <DialogActions>

      <div className={styles.payBtn}>
        <Button
          variant="contained"
          onClick={close}
        >
          Cancel
        </Button>
          { payData?.serviceType === "2" ?
            <IconButton 
              // attanchAmount
              onClick={()=>setOpenDialog(true)}
              style={{padding:0, marginLeft:"10px"}}
            >
              <Button variant="contained">ok</Button>
            </IconButton>:
            <Button
              variant="contained"
              onClick={() => setOpenPayDialog(true)}
              style={{marginLeft:"10px"}}
            > 
             Ok
            </Button>
          }
      </div>
      </DialogActions>
    </Dialog>
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
      question={`${t("cardService.payForService")} ${payData?.price}`}
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
