import { Button, Dialog, DialogActions, DialogContent, Divider, IconButton, Input } from '@mui/material';
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
  setPayData, 
  payData, 
}) => {
  console.log(payData,"paydata in dialog")
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

  return (
    <>
      <Dialog
        open={open}
        onClose={close}  
      >
      {payData &&
        <DialogContent>
          <h4 style={{margin:"10px 0px"}}>
            {t("basket.totalndiscount")} <span style={{textDecoration:"underline"}}> {payData?.price} {t("units.amd")}</span>
          </h4>
          <input
            id="activeCard"
            type="radio"
            name="pay operation"
            onChange={()=> {
              console.log("pay from active card")
            }}
          />
          <label for="activeCard" style={{marginLeft:"10px",textAlign:"center"}}>
            {t("settings.payByActiveCard")}
          </label>
        
          {!cardArr?.length &&
            <div>
              <input
                id="chooseCard"
                type="radio"
                name="pay operation"
                onChange={()=> {
                  console.log("pay from active card")
                }}
              />
              <label for="chooseCard" style={{marginLeft:"10px",textAlign:"center"}}>
                {t("cardService.chooseAnotherCard")}
              </label>
              <Divider sx={{bgcolor:"black"}}/>
              {cardArr.map((card) =>(
                <label>
                  <input
                    type="radio"
                    name="choose"
                    onChange={() => console.log("pay withattachedcard")}
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
                onChange={()=>console.log("pay without attach new card")}
                />
                <label for="no attach" style={{marginLeft:"10px",textAlign:"center"}}>
                  {t("settings.payWithNewCard")}
                </label>

            </div>
            <div>
              <input 
                id="attach"
                type="radio" 
                name="pay operation"
                onChange={()=>console.log("pay and attach new card")}
              />
              <label for="attach" style={{marginLeft:"10px",textAlign:"center"}}>
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
          Cancel
        </Button>
        <Button variant="contained">
          ok
        </Button>
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
