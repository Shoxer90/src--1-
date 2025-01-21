import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import styles from "./index.module.scss";


const ReverseConditions = ({
  cashAmount,
  cardAmount,
  total,
  prePaymentAmount,
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
    const valid =/^\d*\.?(?:\d{1,2})?$/
    const text = e.target.value; 
    const isValid = valid.test(text);

    if(e.target.value > cardAmount || e.target.value > reverseTotal) return

    else if(isValid  || e.target.value === "" ) {
      return setConditionState({
        ...conditionState, 
        [e.target.name] : e.target.value === 0  ||
         e.target.value === "0" || 
           e.target.value[e.target.value.length -1]==="." 
         ? e.target.value : +e.target.value ,
        cashAmount: reverseTotal - conditionState?.cardAmount 
      })

    }else if(!isValid && `${e.target.value}`.length < `${conditionState?.cardAmount}`.length) {
      return setConditionState({
        ...conditionState,
        [e.target.name] : e.target.value,
        cashAmount: reverseTotal - conditionState?.cardAmount 
      })
    }
  };


  useEffect(() => {
    if( reverseTotal &&
         cashAmount + prePaymentAmount < conditionState?.cashAmount && 
        cardAmount < conditionState?.cardAmount) {
      setBlockButton(false)
    }else if(!reverseTotal || 
       cashAmount+prePaymentAmount < conditionState?.cashAmount || 
         cardAmount < conditionState?.cardAmount || 
         ( receiptAmountForPrepayment && 
        receiptAmountForPrepayment-reverseTotal < total &&
      !isAllSelected )
    ) {
      setBlockButton(true)
    }else{
      setBlockButton(false)
    }
  }, [reverseTotal, conditionState])
  
    useEffect(() => {
      if(reverseTotal >  cashAmount + prePaymentAmount) {
        setConditionState({
          cashAmount: +(cashAmount + prePaymentAmount).toFixed(2),
          cardAmount: +(reverseTotal-(+cashAmount + prePaymentAmount)).toFixed(2),
        })
  
      }else{
        setConditionState({
          cashAmount: reverseTotal ? +(reverseTotal)?.toFixed(2) : 0,
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
      <div style={{display:"flex", flexFlow:"column",alignItems:"center",justifyContent:"center"}}>
      <div style = {{color:"red",  padding:"0px 20px"}}> 
        {(conditionState?.cashAmount > cashAmount + prePaymentAmount) && `${t("dialogs.limitCash")} ${+cashAmount+ prePaymentAmount} ${t("units.amd")}`}
      </div>
      <div style = {{color:"red",  padding:"0px 20px"}}> 
        {(conditionState?.cardAmount > cardAmount) && `${t("dialogs.limitCard")} ${cardAmount} ${t("units.amd")}`}
      </div> 
      <div style = {{color:"red",  padding:"0px 20px"}}> 
        {(conditionState?.cardAmount > cardAmount) 
        }
      </div> 
        <h6>
          {t("history.forReverse")} {reverseTotal.toFixed(2)} {t("units.amd")}
        </h6>
        <Button 
          variant="contained" 
          sx={{background: "#3FB68A", width:"70%",textTransform: "capitalize"}}
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
