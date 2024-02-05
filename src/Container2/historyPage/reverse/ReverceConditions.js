import React, { memo } from "react";
import styles from "./index.module.scss";
import { useEffect } from "react";
import { Divider } from "@mui/material";

const ReverceConditions = ({saleInfo , t, reverseTotal, conditionState,setCondition, reversePrepayment, setReversePrepayment}) => {

  const handleChangeConditions = (e) => {
    setCondition({
      ...conditionState,
      [e.target.name] : e.target.value,
      cashAmount: reverseTotal- conditionState?.cardAmount 
    })
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
        cashAmount:saleInfo?.res?.printResponseInfo?.cashAmount + saleInfo?.res?.printResponseInfo?.prePayment,
        cardAmount: (reverseTotal -  (saleInfo?.res?.printResponseInfo?.cashAmount + saleInfo?.res?.printResponseInfo?.prePayment)).toFixed(2),
      })

    }else{
      setCondition({
        cashAmount: reverseTotal ? reverseTotal : 0,
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
      {saleInfo?.res?.printResponseInfo?.saleType === 2 ?
     
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
            </span> : ""
          }
          {saleInfo?.res?.printResponseInfo?.cardAmount ?
            <span> {t("history.whichCashless")} 
              <strong style={{margin:"0 5px"}}> 
               {saleInfo?.res?.printResponseInfo?.cardAmount} {t("units.amd")}
              </strong>
            </span> : ""
          }
           {saleInfo?.res?.printResponseInfo?.prePayment ?
            <span> {t("history.useprepayment")} {saleInfo?.res?.printResponseInfo?.prePayment} {t("units.amd")}</span> :""
          }
          {/* {saleInfo?.res?.printResponseInfo?.partialAmount ?
            <span> Փոխհատուցում {saleInfo?.res?.printResponseInfo?.partialAmount} {t("units.amd")}
            <span style={{color:"red",margin:"0 5px", fontSize:"80%"}}>տվյալ դեպքում վերադարձ է արվում ամբողջ կտրոնը</span></span>:""
          } */}
          <span><strong>{t("history.forReverse")} {reverseTotal || 0} {t("units.amd")}</strong></span>
          {!saleInfo?.res?.printResponseInfo?.partialAmount &&
            <>
              <span className={styles.reverceConditions_item}>
                <span>{t("history.getCash")} </span> 
                <div>
                  <input
                    type="number"
                    name="cashAmount"
                    value={conditionState?.cashAmount || ""}
                    // placeholder={`${saleInfo?.res?.printResponseInfo?.totalAmount-saleInfo?.res?.printResponseInfo?.cardAmount}`}
                    readOnly
                  />
                  {t("units.amd")}
                </div>
              </span>
              
              <span className={styles.reverceConditions_item}>
                <span>{t("history.getCard")}</span>
                <div>
                  <input
                    type="number"
                    name="cardAmount"
                    value={conditionState?.cardAmount || ""}
                    readOnly
                  />
                  {t("units.amd")}
                </div>
              </span>
            </> 
          }
        </div> :
        <>      
          <Divider color="black" />
          <div className={styles.reverceConditions}> 
            <span>{t("basket.recieptPrice")}{saleInfo?.res?.printResponseInfo?.totalAmount} {t("units.amd")}</span>
            {saleInfo?.res?.printResponseInfo?.cashAmount ?
              <span>{t("history.whichCash")}{saleInfo?.res?.printResponseInfo?.cashAmount} {t("units.amd")}</span> : ""
            }
            {saleInfo?.res?.printResponseInfo?.cardAmount ?
              <span> {t("history.whichCasheless")} {saleInfo?.res?.printResponseInfo?.cardAmount} {t("units.amd")}</span> : ""
            }
            <span><strong>{t("history.forReverse")} {reverseTotal || 0} {t("units.amd")}</strong></span>
            <span className={styles.reverceConditions_item} >
              <span>{t("history.getCash")} </span> 
              <div>
                <input
                  type="number"
                  name="cashAmount"
                  value={conditionState?.cashAmount}
                  readOnly
                  />
                {t("units.amd")}
              </div>
            </span>
          {saleInfo?.res?.printResponseInfo?.cardAmount ? 
            <span className={styles.reverceConditions_item}>
              <span>{t("basket.getCard")}</span>
              <div>
                <input
                  type="number"
                  name="cardAmount"
                  value={conditionState?.cardAmount || ""}
                  // placeholder={saleInfo?.res?.printResponseInfo?.cardAmount}
                  onChange={e => handleChangeConditions(e)}
                />
                {t("units.amd")}
              </div>
            </span>: ""
          }  
          </div>
        </>
      } 
    </div>
  )
};

export default memo(ReverceConditions);
