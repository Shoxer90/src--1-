import React, { memo } from "react";
import styles from "./index.module.scss";
import { useEffect } from "react";
import { Divider } from "@mui/material";

const ReverceConditions = ({saleInfo , t, reverseTotal, setReverseTotal, conditionState, setCondition}) => {

  const handleChangeInput = (e) => {
    const valid =/^\d+(\.\d{1,2})?$/;
    const text = e.target.value;  
    const isValid = valid.test(text);
    if(+e.target.value > saleInfo?.res?.printResponseInfo?.cardAmount || e.target.value === ".") {
      return
    }
    else if(e.target.value[e.target.value.length-1] === "." || e.target.value === "0" ||
     (e.target.value[e.target.value.length-1] === "0" && e.target.value[e.target.value.length-2] === ".")
    ){
      setCondition({
        ...conditionState,
        [e.target.name] : e.target.value,
      })
      return
    }else if(isValid || e.target.value === ""){
      if(reverseTotal- e.target.value <=  saleInfo?.res?.printResponseInfo?.cashAmount){
        console.log(reverseTotal - e.target.value <=  saleInfo?.res?.printResponseInfo?.cashAmount,"")
        setCondition({
          ...conditionState,
          [e.target.name] : +e.target.value,
          cashAmount: reverseTotal- conditionState?.cardAmount 
        })
      }
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
            <span> {t("basket.useprepayment")} {saleInfo?.res?.printResponseInfo?.prePayment} {t("units.amd")}</span> :""
          }
          {/* {saleInfo?.res?.printResponseInfo?.partialAmount ?
            <span> Փոխհատուցում {saleInfo?.res?.printResponseInfo?.partialAmount} {t("units.amd")}
            <span style={{color:"red",margin:"0 5px", fontSize:"80%"}}>տվյալ դեպքում վերադարձ է արվում ամբողջ կտրոնը</span></span>:""
          } */}
          <span><strong>{t("history.forReverse")} {(reverseTotal).toFixed(2) || 0} {t("units.amd")}</strong></span>
          {/* Inputs  product true*/}
          {!saleInfo?.res?.printResponseInfo?.partialAmount &&
            <>
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
              
              {saleInfo?.res?.printResponseInfo?.cardAmount ? <span className={styles.reverceConditions_item}>
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
              </span> : ""}
            </> 
          }
        </div> :
        <>     
         {/*PREPSYMENT  */}
          <Divider color="black" />
          <div className={styles.reverceConditions}> 
            <span>{t("basket.recieptPrice")}{(saleInfo?.res?.printResponseInfo?.totalAmount).toFixed(2)} {t("units.amd")}</span>
            {saleInfo?.res?.printResponseInfo?.cashAmount ?
              <span>{t("history.whichCash")}{saleInfo?.res?.printResponseInfo?.cashAmount} {t("units.amd")}</span> : ""
            }
            {saleInfo?.res?.printResponseInfo?.cardAmount ?
              <span> {t("history.whichCashless")} {saleInfo?.res?.printResponseInfo?.cardAmount} {t("units.amd")}</span> : ""
            }
            <span><strong>{t("history.forReverse")} {reverseTotal || 0} {t("units.amd")}</strong></span>
            <span className={styles.reverceConditions_item} >
              <span>{t("history.getCash")} </span> 
              <div>
                <input
                  name="cashAmount"
                  value={conditionState?.cashAmount}
                  readOnly
                />
                {t("units.amd")}
              </div>
            </span>
          {saleInfo?.res?.printResponseInfo?.cardAmount ? 
            <span className={styles.reverceConditions_item}>
              <span>{t("history.getCard")}</span>
              <div>
                <input
                  autoComplete="off"
                  name="cardAmount"
                  value={conditionState?.cardAmount || ""}
                  onChange={e =>  {
                    if(!reverseTotal){
                      return
                    }else{
                      // handleChangeConditions(e)
                      handleChangeInput(e)
                    }
                  }}
                />
                {t("units.amd")}asdfgh
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
