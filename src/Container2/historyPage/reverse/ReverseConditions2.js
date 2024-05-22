import React, { memo, useRef } from "react";
import styles from "./index.module.scss";
import { useEffect } from "react";

const ReverceConditions2 = ({
  saleInfo,
  t,
  reverseTotal, 
  conditionState, 
  setCondition}) => {


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
    if(saleInfo?.res?.printResponseInfo?.partialAmount) {
      setCondition({
        cashAmount: saleInfo?.res?.printResponseInfo?.totalAmount,
        cardAmount: saleInfo?.res?.printResponseInfo?.cardAmount,
      })
      return
    }else if(reverseTotal >  saleInfo?.res?.printResponseInfo?.cashAmount + saleInfo?.res?.printResponseInfo?.prePayment) {
      setCondition({
        cashAmount:(saleInfo?.res?.printResponseInfo?.cashAmount + saleInfo?.res?.printResponseInfo?.prePayment).toFixed(2),
        cardAmount: (reverseTotal -  (saleInfo?.res?.printResponseInfo?.cashAmount + saleInfo?.res?.printResponseInfo?.prePayment)).toFixed(2),
      })

    }else{
      setCondition({
        cashAmount: reverseTotal ? reverseTotal?.toFixed(2) : 0,
        cardAmount: 0,
      })
    }
    }, [reverseTotal]);

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
          {saleInfo?.res?.printResponseInfo?.totalAmount} {t("units.amd")}
          </strong>
        </span>
          
        {saleInfo?.res?.printResponseInfo?.cashAmount ?
          <span>{t("history.whichCash")}
          <strong style={{margin:"0 5px"}}> 
              {saleInfo?.res?.printResponseInfo?.cashAmount} {t("units.amd")}
          </strong>
          </span> 
          : ""
        }

        {saleInfo?.res?.printResponseInfo?.cardAmount ?
            <span> 
              {t("history.whichCashless")} 
              <strong style={{margin:"0 5px"}}> 
                {saleInfo?.res?.printResponseInfo?.cardAmount} {t("units.amd")}
              </strong>
            </span> 
          : ""
        }

        {saleInfo?.res?.printResponseInfo?.prePayment ?
          <span> {t("history.prepaymentRedemption1")} {saleInfo?.res?.printResponseInfo?.prePayment} {t("units.amd")}</span> 
          :""
        }
        <span style={{ fontSize:"120%",color:"green"}}>
          <strong>{t("history.forReverse")} {(reverseTotal).toFixed(2) || 0} {t("units.amd")}</strong>
        </span>
      </div>
      <div>
        {!saleInfo?.res?.printResponseInfo?.partialAmount &&
          <div >
            <span className={styles.reverceConditions_item}>
              <span>{t("history.getCash")} </span> 
              <div>
                <input
                  autoComplete="off"
                  name="cashAmount"
                  value={conditionState?.cashAmount || ""}
                  readOnly
                />
                {t("units.amd")}
              </div>
            </span>
            <div style = {{height:"60px",color:"red", fontSize:"90%", margin:"5px"}}> 
              {conditionState?.cashAmount > saleInfo?.res?.printResponseInfo?.cashAmount + saleInfo?.res?.printResponseInfo?.prePayment && `${t("dialogs.limitCash")} ${saleInfo?.res?.printResponseInfo?.cashAmount+ saleInfo?.res?.printResponseInfo?.prePayment} ${t("units.amd")}`}
              {conditionState?.cardAmount > saleInfo?.res?.printResponseInfo?.cardAmount && `${t("dialogs.limitCard")} ${saleInfo?.res?.printResponseInfo?.cardAmount} ${t("units.amd")}`}
            </div>
            {saleInfo?.res?.printResponseInfo?.cardAmount ? 
              <span className={styles.reverceConditions_item}>
                  <span>{t("history.getCard")}</span>
                  <div>
                    <input  
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
                  </div>
                </span> 
              : ""
            }
          </div> 
        }
      </div>
    </div>
  )
};

export default memo(ReverceConditions2);
