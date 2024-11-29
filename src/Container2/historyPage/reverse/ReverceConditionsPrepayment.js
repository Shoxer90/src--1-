import React, { memo, useState } from "react";
import styles from "./index.module.scss";
import { useEffect } from "react";

const ReverceConditionsPrepayment = ({
  saleInfo,
  t,
  reverseTotal, 
  conditionState, 
  setCondition,
  amountForPrePayment,
  setAmountForPrePayment,
  detailsData
}) => {
  const [changedPay,setChangedPay] = useState({});

  useEffect(() => {
    setChangedPay({
      amount: amountForPrePayment?.amount,
      prepayment: 0
    })
  }, []);



  const handleChangeInput = (e) => {

    const valid =/^\d+(\.\d{1,2})?$/;
    const text = e.target.value; 
    const isValid = valid.test(text);
    if(e.target.value > saleInfo?.res?.printResponseInfo?.cardAmount || e.target.value > reverseTotal)return
    if(e.target.value[e.target.value.length-1] === "."  && !`${conditionState?.cardAmount}`.includes(".")) {
      return setCondition({
        ...conditionState,
        [e.target.name] : e.target.value,
      })
    }else if((e.target.value === "0" || e.target.value === "00") && `${e.target.value}`.length > `${conditionState?.cardAmount}`.length) {
      return setCondition({
        ...conditionState,
        [e.target.name] : "0.",
      })
    }else if(isValid  || e.target.value === "") {
      return setCondition({
        ...conditionState,
        [e.target.name] : e.target.value,
        cashAmount: reverseTotal- conditionState?.cardAmount 
      })
    }else if(!isValid && `${e.target.value}`.length < `${conditionState?.cardAmount}`.length) {
      return setCondition({
        ...conditionState,
        [e.target.name] : e.target.value,
        cashAmount: reverseTotal- conditionState?.cardAmount 
      })
    }
  };

  useEffect(() => {
    setCondition({
      ...conditionState,
      cashAmount: (reverseTotal- conditionState?.cardAmount).toFixed(2)
    })
  }, [conditionState?.cardAmount]);

  return(
    <div className={styles.reverseConditions}>
      <div className={styles.reverceConditions}> 

        <span>{t("history.receiptPrice2")} 
          <strong style={{margin:"0 5px"}}> 
          {amountForPrePayment.amount} {t("units.amd")}
          </strong>
        </span>

        {amountForPrePayment?.rest ?
          <span style={{ fontSize:"120%",color:"green"}}> 
            {t("history.prepaymentRedemption")} {amountForPrePayment?.amount - amountForPrePayment?.rest} ֆգգհյյհգյֆյ{t("units.amd")}
          </span> :""
        }
        
        {detailsData?.cashAmount ?
          <span>{t("history.whichCash")}
            <strong style={{margin:"0 5px"}}> 
              {detailsData?.cashAmount} {t("units.amd")}
            </strong>
          </span>: ""
        }

        {detailsData?.cardAmount ?
          <span> 
            {t("history.whichCashless")} 
            <strong style={{margin:"0 5px"}}> 
              {detailsData?.cardAmount} {t("units.amd")}
            </strong>
          </span>: ""
        }

          <span style={{ fontSize:"120%",color:"green"}}>
          <strong>{t("basket.remainder")} {amountForPrePayment?.rest} {t("units.amd")}</strong>
        </span>
        
      </div>
      <div>
        <label>
          {t("history.prepaymentReverse")}
          <input 
            type="number"
            // value={changedPay?.prepayment}
            value={changedPay?.prepayment}
            name="prepayment"
          /> 
        </label>
       
        <label>
        {t("history.restAmountReverse")}
          <input 
            type="number"
            value={changedPay?.amount}
            name="prepayment"
            readOnly
          /> 
        </label>
      </div>

    </div>
  )
};

export default memo(ReverceConditionsPrepayment);
