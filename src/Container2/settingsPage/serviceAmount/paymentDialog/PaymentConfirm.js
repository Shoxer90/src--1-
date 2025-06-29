import { Divider } from '@mui/material';
import React, { memo, useEffect, useState } from 'react';

import styles from "./index.module.scss";
import { useTranslation } from 'react-i18next';
import AttachedCardsItem from './AttachedCardsItem';
import PaymentLogo from "../../../../modules/PaymentLgo";
import paymentType from '../pay/paymentType';

const PaymentConfirm = ({
  cardArr,
  setPayData, 
  payData, 
  content,
  setMethod,
  method,
  clicked,setClicked
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
              setClicked={setClicked}
            /> 
          ))}
        </div>: ""
      }
      </div>
      <Divider sx={{bgcolor:"black"}} />
     
      <div 
        className={styles.subscription_item}
        style={activateBtn === 100 && payData?.paymentType === 1? activeStyle :null}
      >
        <label htmlFor="no attach" style={{display:"flex",justifyContent:"flex-start",width:"100%"}}>
        <input 
          id="no attach"
          checked={!payData?.cardId && payData?.paymentType === 1 }
          type="radio"
          name="pay operation"
          onChange={()=>{
            setClicked(true)
            delete payData?.cardId
            setActivateBtn(100)
            setMethod(2)
            setPayData({
              ...payData,
              attach: false,
              paymentType:1,

            })
          }}
        />
          <div style={{marginLeft:"10px", width:"100%", display:"flex"}}>
            <PaymentLogo />
            <span>{t("settings.payWithNewCard")}</span>
          </div>
        </label>
      </div>
      <div style={{marginLeft:"20px"}}>
        {method === 2 && clicked && <label htmlFor="attach">
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
                attach: !payData?.attach,
                paymentType:1,
              })
            }}
          />
          <span style={{height:"30px",marginLeft:"10px"}}>{t("settings.payWithNewCardAndAttach")}</span>
        </label>}
      </div>
    </div>
  )
}

export default memo(PaymentConfirm);
