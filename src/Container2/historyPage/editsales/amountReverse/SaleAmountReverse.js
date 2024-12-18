import { memo, useEffect } from "react";
import styles from "../index.module.scss";
import { useTranslation } from "react-i18next";


const SaleAmountReverse = ({
  cashAmount,
  cardAmount,
  saleType,
  reverseTotal,
  total,
  prePaymentAmount,
  conditionState,
  setConditionState,
  handleChangeInput,
  // reverse
}) =>{
  const {t} = useTranslation();

  useEffect(() => {
    if(reverseTotal >  cashAmount + prePaymentAmount) {
      setConditionState({
        cashAmount: +(cashAmount + prePaymentAmount).toFixed(2),
        cardAmount: +(Math.floor(reverseTotal*100)/100 -  (Math.floor(cashAmount*100)/100 + prePaymentAmount)),
      })

    }else{
      setConditionState({
        cashAmount: reverseTotal ? (+reverseTotal)?.toFixed(2) : 0,
        cardAmount: 0,
      })
    }
    }, [reverseTotal]);



  useEffect(() => {
    setConditionState({
      ...conditionState,
      cashAmount: Math.floor(+(reverseTotal- conditionState?.cardAmount)*100)/100
    })
  }, [conditionState?.cardAmount]);

  return(
    <>
      <div className={styles.conditions}>
        <div style={{marginTop:"5px",width:"37%"}}>
          <div style={{color:"green", display:"flex", justifyContent:"space-between"}}>
            <span>{t("history.receiptPrice2")}</span>
            <span>{total} {t("units.amd")}</span>
          </div>
            <div style={{display:"flex", justifyContent:"space-between"}}>
              <span>{t("history.whichCash")}</span>
              <span>{cashAmount} {t("units.amd")}</span>
            </div>
            <div style={{display:"flex", justifyContent:"space-between"}}>
              <span>{t("history.whichCashless")}</span>
              <span>{cardAmount} {t("units.amd")}</span>
            </div>
            <div style={{display:"flex", justifyContent:"space-between"}}>
              <span>{t("history.whichPrepayment")}</span>
              <span>{prePaymentAmount} {t("units.amd")}</span>
            </div>
            <div style={{color:"green", display:"flex",justifyContent:"space-between"}}>
              <span style={{color:"green", alignContent:"center"}}>{t("history.forReverse")}</span>
              <span>{(Math.floor((+conditionState?.cashAmount + conditionState?.cardAmount)*100))/100} {t("units.amd")}</span>
            </div>
          </div>
          <div style={{width:"60%"}}>
          <div style={{display:"flex", justifyContent:"space-between", marginTop:"2px"}}>
            <span>{t("history.getCash")}</span>
            <span>
              <input 
                style={{height:"20px"}}
                autoComplete="off"
                name="cashAmount"
                value={conditionState?.cashAmount || ""}
                readOnly
              />
              {t("units.amd")}
            </span>
          </div>
          <div style={{display:"flex", justifyContent:"space-between"}}>
            <span>{t("history.getCard")}</span>
            <span>
              <input 
                style={{height:"20px"}}
                autoComplete="off"
                name="cardAmount"
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
            </span>
          </div>
        </div>

        </div>
        <div style = {{color:"red",  padding:"0px 20px"}}> 
          {(conditionState?.cashAmount > cashAmount + prePaymentAmount) && `${t("dialogs.limitCash")} ${+cashAmount+ prePaymentAmount} ${t("units.amd")}`}
        </div>
        <div style = {{color:"red",  padding:"0px 20px"}}> 
          {(conditionState?.cardAmount > cardAmount) && `${t("dialogs.limitCard")} ${cardAmount} ${t("units.amd")}`}
        </div> 
        <div style = {{color:"red",  padding:"0px 20px"}}> 
          {(conditionState?.cardAmount > cardAmount) && `${t("total")} ${reverseTotal}  ${t("units.amd")}`}
        </div> 
      </>
  )
};

export default memo(SaleAmountReverse);
