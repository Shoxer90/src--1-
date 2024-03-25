import { Divider } from '@mui/material';
import React, { memo, useEffect, useRef, useState } from 'react';

import styles from "./index.module.scss";
import { useTranslation } from 'react-i18next';
import { bindNewCard } from '../../../../services/cardpayments/internalPayments';
import ConfirmDialog from '../../../dialogs/ConfirmDialog';
import AttachedCardsItem from './AttachedCardsItem';



const PaymentConfirm = ({
  cardArr,
  setPayData, 
  payData, 
  content,
  setMethod
}) => {
  const {t} = useTranslation();
  const [load,setLoad] = useState(false);
  const [openDialog, setOpenDialog]= useState();
  const [activateBtn,setActivateBtn] = useState(0);
  const [newLink,setNewLink] = useState("")
  const ref = useRef();

  const activeStyle = {
    boxShadow: "10px 5px 5px grey",
    scale:"1.04",
    transition: "width 2s",
    background: "rgb(200, 240, 240)"
  };
  
  console.log(payData,"PAYDATA");
  
  const getLinkForNewCard = async() => {
    setLoad(true)
    await bindNewCard(payData).then((res) => {
      setLoad(false)
      if(res?.formUrl) {
        setNewLink(res?.formUrl)
      }else{
        // do something
      }
    })
  };

  useEffect(() => {
    newLink && ref?.current.click()
  },[newLink]);

  useEffect(() => {
    setPayData({
      ...payData,
      cardId: content?.autopayment?.defaultCard?.cardId || cardArr[0].cardId
    })
  },[]);
  
  return (
    <div style={{fontWeight:"600",fontSize:"90%"}}>
      <div>
      {content?.autopayment?.defaultCard &&  
      <>
        <h6> {t("settings.payByActiveCard")}</h6>
        <div 
          className={styles.subscription_item}
          style={activateBtn === 0 ? activeStyle :null}
        >
          <label>
            <input
              id="activeCard"
              type="radio"
              name="pay operation"
              checked={payData?.cardId === content?.autopayment?.defaultCard?.cardId}
              onChange={()=> {
                delete payData?.attach
                setActivateBtn(0)
                setMethod(1)
                setPayData({
                  ...payData,
                  cardId: content?.autopayment?.defaultCard?.cardId
                })
              }}
            />
            <span style={{marginRight:"5px"}}>
              {content?.autopayment?.defaultCard?.pan[0] == 5 && <img src="/mastercard1.png" alt="card_type" style={{width:"45px",height:"15px"}} />}
              {content?.autopayment?.defaultCard?.pan[0] == 4 && <img src="/visa1.png" alt="card_type" style={{width:"45px",height:"11px"}} />}
              {content?.autopayment?.defaultCard?.pan[0] == 9 && <img src="/arca1.png" alt="card_type" style={{width:"45px",height:"15px"}} />}
            </span>
            {content?.autopayment?.defaultCard?.bankName } {" "}
            {`${content?.autopayment?.defaultCard?.pan}`}

          </label>
        </div>
        <Divider sx={{m:1}} color="black" />
      </>
      }
   
      {cardArr?.length ?
        <div>
          <h6>{t("settings.payByAttachedCard")}</h6>
            {cardArr.map((card,index)=>(
              !card?.isDefault ?
              <AttachedCardsItem 
                card={card} 
                payData={payData}
                setActivateBtn={setActivateBtn}
                setPayData={setPayData}
                setMethod={setMethod}
                index={index}
                activateBtn={activateBtn}
                activeStyle={activeStyle}
              /> : null
            ))}
        </div>: ""
      }
      </div>
      <Divider sx={{bgcolor:"black"}} />
      <div 
        className={styles.subscription_item}
        style={activateBtn === 100 ? activeStyle :null}
      >
        <label htmlFor="no attach"  >
        <input 
          id="no attach"
          type="radio"
          name="pay operation"
          onChange={()=>{
            delete payData?.cardId
            setActivateBtn(100)
            setMethod(2)
            setPayData({
              ...payData,
              attach: false
            })
          }}
        />
          <span style={{marginLeft:"10px"}}>{t("settings.payWithNewCard")} </span>
        </label>
      </div>
      <div   
        className={styles.subscription_item}
        style={activateBtn === 101 ? activeStyle :null}
      >
        <label htmlFor="attach">
        <input 
          id="attach"
          type="radio" 
          name="pay operation"
          onChange={()=>{
            delete payData?.cardId
            setActivateBtn(101)
            setMethod(2)
            setPayData({
              ...payData,
              attach: true
            })
          }}
        />
          <span style={{marginLeft:"10px"}}>{t("settings.payWithNewCardAndAttach")}</span>
        </label>
      </div>
      {newLink && 
        <a 
          ref={ref} 
          href={newLink} 
          rel="noreferrer" 
          // target="_blank" 
        >""
        </a>
      }
      <ConfirmDialog
        question={t("cardService.attanchAmount")}
        func = {getLinkForNewCard}
        title = {t("cardService.newCard")}
        open= {openDialog}
        close = {setOpenDialog}
        content={""}
        t={t}
      />
    </div>
  )
}

export default memo(PaymentConfirm);
