import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import styles from "../index.module.scss";


const ReverseConditions = ({
  // item
  cashAmount,
  cardAmount,
  total,
  prePaymentAmount,
// props
  reverseTotal,
  conditionState,
  setConditionState,
  receiptAmountForPrepayment,
  chooseFuncForSubmit,
  isAllSelected,
}) => {
  const {t} = useTranslation();

  const [blockButton,setBlockButton] = useState(false);

  const handleChangeInput = (e) => {
    const valid =/^\d+(\.\d{1,2})?$/;
    const text = e.target.value; 
    const isValid = valid.test(text);
    if(e.target.value > cardAmount || e.target.value > reverseTotal)return
    if(e.target.value[e.target.value.length-1] === "."  && !`${conditionState?.cardAmount}`.includes(".")) {
      return setConditionState({
        ...conditionState,
        [e.target.name] : e.target.value,
      })
    }else if((e.target.value === "0" || e.target.value === "00") && `${e.target.value}`.length > `${conditionState?.cardAmount}`.length) {
      return setConditionState({
        ...conditionState,
        [e.target.name] : "0.",
      })
    }else if(isValid  || e.target.value === "") {
      return setConditionState({
        ...conditionState,
        [e.target.name] : e.target.value,
        cashAmount: reverseTotal- conditionState?.cardAmount 
      })
    }else if(!isValid && `${e.target.value}`.length < `${conditionState?.cardAmount}`.length) {
      return setConditionState({
        ...conditionState,
        [e.target.name] : e.target.value,
        cashAmount: reverseTotal- conditionState?.cardAmount 
      })
    }
    
  };


  useEffect(() => {
    if(reverseTotal && cashAmount+prePaymentAmount < Math.ceil(conditionState?.cashAmount*100)/100 && cardAmount < conditionState?.cardAmount) {
      setBlockButton(false)
      
    }else if(!reverseTotal || 
      cashAmount+prePaymentAmount < Math.floor(conditionState?.cashAmount*100)/100  || 
      cardAmount < Math.floor(conditionState?.cardAmount*100)/100 || 
      (receiptAmountForPrepayment && receiptAmountForPrepayment-reverseTotal < total && !isAllSelected)
    ) {
      setBlockButton(true)
    }else{
      setBlockButton(false)
    }
  }, [reverseTotal, conditionState])
  // saleAmount useeefec

    useEffect(() => {
      if(reverseTotal >  cashAmount + prePaymentAmount) {
        setConditionState({
          cashAmount: +(cashAmount + prePaymentAmount).toFixed(2),
          cardAmount: (reverseTotal-(cashAmount + prePaymentAmount)).toFixed(2),
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
  
  return (
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
            {/* EYEYEYEYEYEY */}
            <span style={{color:"blue"}}>{(Math.floor((+conditionState?.cashAmount + conditionState?.cardAmount)*100))/100} {t("units.amd")}</span>
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
        {(conditionState?.cardAmount > cardAmount) 
        // && `${t("total")} ${reverseTotal}  ${t("units.amd")}`
        }
      </div> 


    <div style={{display:"flex", justifyContent:"center"}}>
    <Button 
      variant="contained" 
      sx={{background: "#3FB68A", width:"70%", alignContent:"center"}}
      onClick={chooseFuncForSubmit}
      disabled={blockButton}
    >
      {t("buttons.submit")}
    </Button>
  </div>
  </>

  )
};

export default memo(ReverseConditions);
