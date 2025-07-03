import { Divider } from '@mui/material';
import { memo, useEffect } from 'react';

import styles from "./index.module.scss";
import { useTranslation } from 'react-i18next';
import AttachedCardsItem from './AttachedCardsItem';
import PaymentLogo from "../../../../modules/PaymentLgo";
import ChoosePaymentType from "../pay/paymentType/index"

const PaymentConfirm = ({
  cardArr,
  setPayData, 
  payData, 
  content,
  setMethod,
  method,
  clicked,
  setClicked,
  setPaymentType,
  paymentType

}) => {
  const {t} = useTranslation();

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
              key={index}
              card={card} 
              payData={payData}
              setPayData={setPayData}
              setMethod={setMethod}
              index={index}
              activeStyle={activeStyle}
              setClicked={setClicked}
            /> 
          ))}
        </div>: ""
      }
      </div>
      <Divider sx={{bgcolor:"black"}} />
     
      <div 
        className={styles.subscription_item} style={ payData?.paymentType === 1 && !payData?.cardId? activeStyle :null}>
        <label htmlFor="no attach" style={{display:"flex",justifyContent:"flex-start",width:"100%"}}>
        <input 
          id="no attach"
          checked={!payData?.cardId &&  payData?.paymentType === 1 }
          type="radio"
          name="pay operation"
          onChange={()=>{
            delete payData?.cardId
            setClicked(true)
            setMethod(2)
            setPayData({
              ...payData,
              attach: false,
              paymentType:1,
            })
          }}
        />
          <div style={{marginLeft:"10px", width:"100%",display:"flex", justifyContent:"flex-start"}}>
            <PaymentLogo />
          {/* <span> */}
            {t("settings.payWithNewCard")} 
            {/* <span style={{height:"10px", marginBottom:"2px", marginLeft:"3px"}}><PaymentLogo /></span> */}
          {/* </span> */}
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
              setMethod(2)
              setPayData({
                ...payData,
                attach: !payData?.attach,
                paymentType: 1,
              })
            }}
          />
          <span style={{height:"30px",marginLeft:"10px"}}>{t("settings.payWithNewCardAndAttach")}</span>
        </label>}
      </div>
      <ChoosePaymentType 
        billsData={payData}
        setBills={setPayData}
        paymentType={paymentType}
        setPaymentType={setPaymentType}
        setMethod={setMethod}
        setClicked={setClicked}
        activeStyle={activeStyle}
      />
    </div>
  )
}

export default memo(PaymentConfirm);
