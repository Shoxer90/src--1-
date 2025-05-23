import { Divider } from '@mui/material';
import React, { memo, useEffect, useState } from 'react';

import styles from "./index.module.scss";
import { useTranslation } from 'react-i18next';
import AttachedCardsItem from './AttachedCardsItem';
import PaymentLogo from "../../../../modules/PaymentLgo";

const PaymentConfirm = ({
  cardArr,
  setPayData, 
  payData, 
  content,
  setMethod,
  method,
}) => {
  const {t} = useTranslation();
  const [activateBtn,setActivateBtn] = useState(0);

  const activeStyle = {
    boxShadow: "10px 5px 5px grey",
    scale:"1.04",
    transition: "width 2s",
  };

  useEffect(() => {
    setPayData({
      ...payData,
      cardId: content?.autopayment?.defaultCard?.cardId 
    })
  },[]);

  return (
    <div style={{fontWeight:"600",fontSize:"90%"}}>
      <div>
      <div style={{display:"flex",width:"100%"}}>
        <span>{t("settings.payByAttachedCard")}</span>
        <PaymentLogo />
      </div>

      {cardArr?.length ?
        <div>
          {cardArr.map((card,index)=>(
            <AttachedCardsItem 
              card={card} 
              payData={payData}
              setActivateBtn={setActivateBtn}
              setPayData={setPayData}
              setMethod={setMethod}
              index={index}
              activateBtn={activateBtn}
              activeStyle={activeStyle}
            /> 
          ))}
        </div>: ""
      }
      </div>
      <Divider sx={{bgcolor:"black"}} />
      <div 
        className={styles.subscription_item}
        style={activateBtn === 100 ? activeStyle :null}
      >
        <label htmlFor="no attach" style={{display:"flex",justifyContent:"flex-start",width:"100%"}}>
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
          <span style={{marginLeft:"10px", width:"100%"}}>{t("settings.payWithNewCard")} </span>
        </label>
      </div>
      <div style={{height:"30px", marginLeft:"20px"}}>
        {method === 2 && <label htmlFor="attach">
          <input 
            id="attach"
            type="checkbox"
            checked={method === 2 && payData?.attach}
            name="pay operation"
            onChange={()=>{
              delete payData?.cardId
              setActivateBtn(101)
              setMethod(2)
              setPayData({
                ...payData,
                attach: !payData?.attach
              })
            }}
          />
          <span style={{marginLeft:"10px"}}>{t("settings.payWithNewCardAndAttach")}</span>
        </label>}
      </div>
    </div>
  )
}

export default memo(PaymentConfirm);
