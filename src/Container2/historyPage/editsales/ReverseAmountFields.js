import { memo, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import PrepaymentAmountReverse from "./amountReverse/PrepaymentAmountReverse";
import SaleAmountReverse from "./amountReverse/SaleAmountReverse";


const ReverseAmountFields = ({
  cashAmount,
  cardAmount,
  saleType,
  reverseTotal,
  total,
  prePaymentAmount,
  conditionState,
  setConditionState,
  totalCounter,
  receiptAmountForPrepayment,
  chooseFuncForSubmit
}) => {
  const [blockButton,setBlockButton] = useState(false);
  const {t} = useTranslation();

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
    if(reverseTotal && cashAmount+prePaymentAmount < conditionState?.cashAmount && cardAmount < conditionState?.cardAmount) {
      setBlockButton(false)
      
    }else if(!reverseTotal || cashAmount+prePaymentAmount < conditionState?.cashAmount || cardAmount < conditionState?.cardAmount ) {
      setBlockButton(true)
    }else{
      setBlockButton(false)
    }
  }, [reverseTotal, conditionState])

  return(
    <div >
      {saleType !== 5 ? 
        <SaleAmountReverse
          cashAmount={cashAmount}
          cardAmount={cardAmount}
          saleType={saleType}
          reverseTotal={reverseTotal}
          total={total}
          prePaymentAmount={prePaymentAmount}
          conditionState={conditionState}
          setConditionState={setConditionState}
          totalCounter={totalCounter}
          handleChangeInput={handleChangeInput}
        />:
        <PrepaymentAmountReverse 
          cashAmount={cashAmount}
          cardAmount={cardAmount}
          saleType={saleType}
          reverseTotal={reverseTotal}
          total={total}
          prePaymentAmount={prePaymentAmount}
          conditionState={conditionState}
          setConditionState={setConditionState}
          totalCounter={totalCounter}
          receiptAmountForPrepayment={receiptAmountForPrepayment}
          handleChangeInput={handleChangeInput}

        />
      }
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

    </div>
  )
};

export default memo(ReverseAmountFields);