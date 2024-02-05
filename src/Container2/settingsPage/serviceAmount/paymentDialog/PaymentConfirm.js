import { Button, Dialog, DialogActions, DialogContent, Divider } from '@mui/material';
import React, { memo, useEffect, useRef, useState } from 'react';

import styles from "./index.module.scss";
import { useTranslation } from 'react-i18next';
import Loader from '../../../loading/Loader';
import { bindNewCard } from '../../../../services/cardpayments/internalPayments';
import ConfirmDialog from '../../../dialogs/ConfirmDialog';
import { payForServiceWithAttachedCard, payForServiceWithNewCard } from '../../../../services/internal/InternalPayments';
import IsInDate from './IsInDate';
import AttachedCardsItem from './AttachedCardsItem';

const PaymentConfirm = ({
  isPrepayment,
  open,
  close,
  cardArr,
  setPayData, 
  payData, 
  content,
  price,
  logOutFunc,
  message,
  setMessage,
}) => {
  const {t} = useTranslation();
  const [load,setLoad] = useState(false);
  const [openDialog, setOpenDialog]= useState();
  const [openPayDialog, setOpenPayDialog]= useState();
  const [activateBtn,setActivateBtn] = useState(false);
  const [newLink,setNewLink] = useState("")
  const ref = useRef();


  const getLinkForNewCard = async() => {
    setLoad(true)
    await bindNewCard(payData).then((res) => {
      if(res) {
        setNewLink(res?.formUrl)
      }
      setLoad(false)
    })
  } ;

  const payForService = async() => {
    setLoad(true)
    if(activateBtn === 1) {
      await payForServiceWithAttachedCard(payData).then((res) => {
        if(res === 401){
          logOutFunc()
        }else if(res === "Request processed successfully"){
          setLoad(false)  
          setMessage({message:t("basket.paymentsuccess"), type:"success"})
        }
      })
    }else{
       await payForServiceWithNewCard(payData).then((res) => {
      setLoad(false)       
        !res?.error ? setNewLink(res?.formUrl):
        setMessage({message:t("dialog.wrong"), type:"error"})
      })
    }
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
      {(!content?.isInDate && !content?.days) ?
        <DialogContent>
          <h4 style={{margin:"10px 0px"}}>
            {t("basket.totalndiscount")} <span> {price} {t("units.amd")}</span> 
          </h4>
          {content?.autopayment?.defaultCard && 
            <div className={styles.circleBorder}>
              <input
                id="activeCard"
                type="radio"
                name="pay operation"
                onChange={()=> {
                  delete payData?.attach
                  setActivateBtn(1)
                  setPayData({
                    ...payData,
                    cardId: content?.autopayment?.defaultCard?.cardId
                  })
                }}
              />
              <label htmlFor="activeCard" style={{marginLeft:"10px",textAlign:"center"}}>
                {t("settings.payByActiveCard")} <strong>{`${content?.autopayment?.defaultCard?.pan}`}</strong>
              </label>
            </div>
          }
          {cardArr?.length ?
            <div>
              <div style={{fontWeight:600,marginLeft:"25px"}}>
                {t("cardService.chooseAnotherCard")}
              </div>
              <div>
                {cardArr.map((card) =>(
                  <AttachedCardsItem 
                    card={card} 
                    payData={payData}
                    setActivateBtn={setActivateBtn}
                    setPayData={setPayData}
                  />
                ))}
              </div>
            </div>: ""
          }
          <Divider sx={{bgcolor:"black"}} />
            <div className={styles.circleBorder}>
              <input 
                id="no attach"
                type="radio"
                name="pay operation"
                onChange={()=>{
                  delete payData?.cardId
                  setActivateBtn(2)
                  !isPrepayment ?
                  setPayData({
                    ...payData,
                    attach: false
                  }):
                  setPayData({
                    ...payData,
                    cardId: 0
                  })
                }}
              />
              <label htmlFor="no attach" style={{marginLeft:"10px",textAlign:"center"}}>
                {t("settings.payWithNewCard")}
              </label>
            </div>
            {!isPrepayment && <div className={styles.circleBorder}>
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
                }}
              />
              <label htmlFor="attach" style={{marginLeft:"10px",textAlign:"center"}}>
                  {t("settings.payWithNewCardAndAttach")}
              </label>
            </div>}
        </DialogContent> : 
        <IsInDate />
      }
      {(!content?.isInDate) ? 
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
            if(activateBtn === 2 && payData?.attach) {
              setOpenDialog(true)
            }else{
              setOpenPayDialog(true)
            }
           
          }}
        >
          {t("basket.linkPayment")}
        </Button>
        </DialogActions>: 
        <DialogActions>
          <Button
            variant="contained"
            onClick={close}
          >
            {t("buttons.close")}
          </Button>
        </DialogActions>
      }
    </Dialog>
    {newLink && <a ref={ref} href={newLink} rel="noreferrer" target="_blank" >""</a>}

   <ConfirmDialog
      question={t("cardService.attanchAmount")}
      func = {getLinkForNewCard}
      title = {t("cardService.newCard")}
      open= {openDialog}
      close = {setOpenDialog}
      content={""}
      t={t}
    />
    {!message?.message && <ConfirmDialog
      question={`${t("cardService.payForService")} ${price} ${t("units.amd")}`}
      func = {payForService}
      open = {openPayDialog}
      close = {setOpenPayDialog}
      content={""}
      t={t}
    />}
    <Dialog open={load}>
      <Loader />
    </Dialog>

    </>
  )
}

export default memo(PaymentConfirm);
