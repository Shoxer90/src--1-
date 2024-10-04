import { memo, useEffect, useState } from "react";
import styles from "../index.module.scss";
import { useTranslation } from "react-i18next";

const PrepaymentAmountReverse = ({
  cashAmount,
  cardAmount,
  saleType,
  reverseTotal,
  total,
  prePaymentAmount,
  conditionState,
  totalCounter,
  receiptAmountForPrepayment,
  setConditionState,
  handleChangeInput

}) => {
  const {t} = useTranslation();
  const [remainderAfterChanges, setRemainderAfterChanges] = useState();
  const [remainderOfPrepaymentAfterChanges, setRemainderOfPrepaymentAfterChanges] = useState(0);

  useEffect(() => {
    if(reverseTotal) {
      if(receiptAmountForPrepayment - total - reverseTotal >= 0) {
        setRemainderOfPrepaymentAfterChanges(0)
        setConditionState({
          ...conditionState,
          cashAmount: 0,
          cardAmount: 0,
        })
      }else{
        setRemainderAfterChanges(0)
        setRemainderOfPrepaymentAfterChanges(reverseTotal - (receiptAmountForPrepayment - total))
        if(reverseTotal - (receiptAmountForPrepayment - total) <= cashAmount){
          setConditionState({
            ...conditionState,
            cashAmount: reverseTotal - (receiptAmountForPrepayment - total),
            cardAmount: 0
          })
        }
        else {
          setConditionState({
            ...conditionState,
            cashAmount: cashAmount,
            cardAmount: reverseTotal - (receiptAmountForPrepayment - total)- cashAmount,
          })
        }
      } 
    }else{
      setConditionState({
        ...conditionState,
        cashAmount: 0,
        cardAmount: 0,
      })
      setRemainderOfPrepaymentAfterChanges(0)
    }
  }, [reverseTotal]);

  useEffect(() => {
    if(conditionState?.cardAmount || conditionState?.cashAmount ) {
      
      setConditionState({
        ...conditionState,
        cashAmount: reverseTotal - (receiptAmountForPrepayment - total) - conditionState?.cardAmount,
      })
    }
  }, [conditionState?.cardAmount]);

  return(
    <div className={styles.conditions}>
    <div>
      <div style={{color:"green", fontSize:"100%"}}>{t("history.receiptPrice2")} {receiptAmountForPrepayment} {t("units.amd")}</div>
      <div>{t("basket.useprepayment")} {total} {t("units.amd")}</div>
      <div style={{fontSize:"85%", color:"grey"}}>{t("history.whichCash")} {cashAmount} {t("units.amd")}</div>
      <div style={{fontSize:"85%",color:"grey"}}>{t("history.whichCashless")} {cardAmount} {t("units.amd")}</div>
      <div style={{color:"green", fontSize:"100%"}}>{t("basket.remainder")}  {receiptAmountForPrepayment - total} {t("units.amd")}</div>
      <div style={{color:"green", fontSize:"80%"}}>
        {t("history.backProdsbyDram")} 
        {reverseTotal}
        {t("units.amd")}
      </div> 
    </div>
    <div>
    { receiptAmountForPrepayment - total - reverseTotal>=0 ? 
      <div  style={{color:"green", fontSize:"100%"}}>{`${t("basket.remainder")} (new) `}  {receiptAmountForPrepayment - total - reverseTotal} {t("units.amd")}</div>:
      <div  style={{color:"green", fontSize:"100%"}}>{`${t("basket.remainder")} (new) `}  0 {t("units.amd")}</div>
    }
  
      <div style={{color:"green", fontSize:"100%"}}>
        {t("history.takebackFromPrepayment")} 
        {remainderOfPrepaymentAfterChanges}
        {t("units.amd")}
      </div> 
    <div style={{height:"50px"}}>
      {remainderOfPrepaymentAfterChanges ?
       <span>
        <div>
          {t("history.getCash")} 
          <input 
            autoComplete="off"
            name="cashAmount"
            style={{height:"20px"}}
            value={conditionState?.cashAmount || ""}
            readOnly
          />
          {t("units.amd")}
        </div>
        <div>
          {t("history.getCard")} 
          <input 
            autoComplete="off"
            name="cardAmount"
            style={{height:"20px"}}
            value={conditionState?.cardAmount || ""}
            onChange={e => {
              if(!reverseTotal){
                return
              }else{
                handleChangeInput(e)
              }
            }}
          /> 
          {t("units.amd")}
        </div>
      </span>:""
      }
        <div style = {{height:"60px",color:"red", fontSize:"80%", margin:"5px 0px"}}> 
          {reverseTotal && cashAmount < conditionState?.cashAmount ? `${t("dialogs.limitCash")} ${cashAmount} ${t("units.amd")}`:""}
          {reverseTotal && cardAmount < conditionState?.cardAmount ? `${t("dialogs.limitCard")} ${cardAmount} ${t("units.amd")}`:""}
        </div>
      </div> 
     
  </div>
  </div>
  )
};

export default memo(PrepaymentAmountReverse);
