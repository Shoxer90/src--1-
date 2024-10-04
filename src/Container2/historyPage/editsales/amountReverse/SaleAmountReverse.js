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
        cardAmount: +(reverseTotal -  (cashAmount + prePaymentAmount)).toFixed(2),
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
      cashAmount: +(reverseTotal- conditionState?.cardAmount).toFixed(2)
    })
  }, [conditionState?.cardAmount]);

  return(
    <>
      <div className={styles.conditions}>
        <div style={{marginTop:"5px"}}>
          <div style={{color:"green", fontSize:"100%"}}>{t("history.receiptPrice2")} {total} {t("units.amd")}</div>
          <div>{t("history.whichCash")} {cashAmount} {t("units.amd")}</div>
          <div>{t("history.whichCashless")} {cardAmount} {t("units.amd")}</div>
          <div>{t("history.whichPrepayment")} {prePaymentAmount} {t("units.amd")}</div>
          <div style={{color:"green", fontSize:"100%"}}>
            {t("history.forReverse")} 
            {+conditionState?.cashAmount + conditionState?.cardAmount} 
            {t("units.amd")}
          </div>
          </div>
          <div>
            <div>{t("history.getCash")} 
              <input 
                 style={{height:"20px"}}
                 autoComplete="off"
                 name="cashAmount"
                 value={conditionState?.cashAmount || ""}
                 readOnly
              />
              {t("units.amd")}
            </div>
            <div>
              {t("history.getCard")} 
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
              {t("units.amd")}</div>
          </div>

        </div>
        <div style = {{color:"red", fontSize:"90%", padding:"0px 20px"}}> 
          {(conditionState?.cashAmount > cashAmount + prePaymentAmount) && `${t("dialogs.limitCash")} ${+cashAmount+ prePaymentAmount} ${t("units.amd")}`}
        </div>
        <div style = {{color:"red", fontSize:"90%", padding:"0px 20px"}}> 
        {(conditionState?.cardAmount > cardAmount) && `${t("dialogs.limitCard")} ${cardAmount} ${t("units.amd")}`}
        </div> 
        <div style = {{color:"red", fontSize:"90%", padding:"0px 20px"}}> 
        {(conditionState?.cardAmount > cardAmount) && `${t("total")} ${reverseTotal}fgjfdfg ${t("units.amd")}`}
        </div> 
      </>
  )
};

export default memo(SaleAmountReverse);
