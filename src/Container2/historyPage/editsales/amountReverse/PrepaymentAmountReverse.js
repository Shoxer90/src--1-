import { memo, useEffect, useState } from "react";
import styles from "../index.module.scss";
import { useTranslation } from "react-i18next";
import { Dialog } from "@mui/material";
import SnackErr from "../../../dialogs/SnackErr";

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
  isAllSelected,
  setIsAllSelected
}) => {
  const {t} = useTranslation();
  const [remainderAfterChanges, setRemainderAfterChanges] = useState();
  const [message, setMessage] = useState({m:"", t:""});
  const [remainderOfPrepaymentAfterChanges, setRemainderOfPrepaymentAfterChanges] = useState(0);

  useEffect(() => {
    if(reverseTotal ) {
      if(receiptAmountForPrepayment - total - reverseTotal > 0
        //  || isAllSelected
        ) {
        setRemainderOfPrepaymentAfterChanges(0)
        setConditionState({
          ...conditionState,
          cashAmount: 0,
          cardAmount: 0,
        })
      }else if(receiptAmountForPrepayment - reverseTotal === 0) {
        return setIsAllSelected(true)
      }
      else{
        // new
        // alert("hey")
        setMessage({
          m: `${t("history.reverseLimit")}
            ${t("basket.useprepayment")} ${total} ${t("units.amd")} / 
            ${t("history.receiptAmount")}
            ${receiptAmountForPrepayment-reverseTotal}
            ${t("units.amd")}`,
          t:"error"
        })
        // setRemainderAfterChanges(0)
        // setRemainderOfPrepaymentAfterChanges(reverseTotal - (receiptAmountForPrepayment - total))
        // if(reverseTotal - (receiptAmountForPrepayment - total) <= cashAmount){
        //   setConditionState({
        //     ...conditionState,
        //     cashAmount: reverseTotal - (receiptAmountForPrepayment - total),
        //     cardAmount: 0
        //   })
        // }
        // else {
        //   setConditionState({
        //     ...conditionState,
        //     cashAmount: cashAmount,
        //     cardAmount: reverseTotal - (receiptAmountForPrepayment - total)- cashAmount,
        //   })
        // }
      } 
    }
    // else{
    //   setConditionState({
    //     ...conditionState,
    //     cashAmount: 0,
    //     cardAmount: 0,
    //   })
    //   setRemainderOfPrepaymentAfterChanges(0)
    // }
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
    <div style={{width:"38%"}}>
      <div style={{color:"green",display:"flex", justifyContent:"space-between"}}>
        <span>{t("history.receiptPrice2")}</span>
        <span>{receiptAmountForPrepayment} {t("units.amd")}</span>
      </div>
      <div style={{display:"flex", justifyContent:"space-between"}}>
        <span>{t("basket.useprepayment")}</span>
        <span>{total} {t("units.amd")}</span>
      </div>
      <div style={{color:"grey", display:"flex", justifyContent:"space-between"}}>
        <span>{t("history.whichCash")}</span>
        <span>{cashAmount} {t("units.amd")}</span>
      </div>
      <div style={{color:"grey", display:"flex", justifyContent:"space-between"}}>
        <span>{t("history.whichCashless")}</span>
        <span>{cardAmount} {t("units.amd")}</span>
      </div>
      <div style={{display:"flex", justifyContent:"space-between"}}>
        <span>{t("basket.remainder")}</span> 
        <span> {receiptAmountForPrepayment - total} {t("units.amd")}</span>
      </div>
    </div>
    <div style={{width:"60%"}}>
      <div style={{display:"flex", justifyContent:"space-between"}}>
        <span>{t("history.backProdsbyDram")} </span>
        <span>{reverseTotal} {t("units.amd")}</span>
      </div> 
      <div  style={{color:"green", display:"flex", justifyContent:"space-between"}}>
        <span>{t("basket.remainder")} {`(${t("history.afterReverse")})`}</span> 
        <span>{receiptAmountForPrepayment - reverseTotal} {t("units.amd")}</span> 
      </div>
  
      {/* <div style={{color:"green", fontSize:"100%"}}>
        {t("history.takebackFromPrepayment")} 
        {remainderOfPrepaymentAfterChanges}
        {t("units.amd")}
      </div>  */}
    {/* <div style={{height:"50px"}}>
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
      */}
  </div>
  <Dialog open={!!message?.m}><SnackErr message={message?.m} type={message?.t} close={setMessage} /></Dialog>
  </div>
  )
};

export default memo(PrepaymentAmountReverse);
