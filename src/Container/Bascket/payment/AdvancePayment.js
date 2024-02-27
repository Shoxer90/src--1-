import React, { useEffect, useState, memo } from "react";
import styles from "../index.module.scss"

  const AdvancePayment = ({
    t,
    paymentInfo, 
    setPaymentInfo, 
    flag, 
    setSingleClick,
    blockTheButton,
    setBlockTheButton,
    val,
    setVal,
    setTotalPrice
  }) => {

  // const [val,setVal] = useState(0);
  
  const handleChangePrepayment = (event) => {
    const valid = /^\d+(\.\d{1,2})?$/;
    const text = event.target.value;  
    const isValid = valid.test(text)
    if(event.target.value === "." ||
      event.target.value.slice(-2) === ".." ||
      (`${paymentInfo?.cashAmount}`.includes(".") &&
      event.target.value[event.target.value.length-1] === "."
      && event.target.value.length > `${paymentInfo?.cashAmount}`.length)
    ){
      return
    }else if(event.target.value[event.target.value.length-1] === "." ||
     (event.target.value[event.target.value.length-1] === "0" && event.target.value[event.target.value.length-2] === ".")
    ) {
      setSingleClick({pointerEvents:"none"})
      setBlockTheButton(true)
      setVal(event.target.value)
    }else if(isValid || event.target.value === ""){
      setVal(+event.target.value)
      setBlockTheButton(false)
      setPaymentInfo({
        ...paymentInfo,
        cashAmount: +event.target.value,
        cardAmount:0
      })
    }if(event.target.value === "" || !val || !paymentInfo?.cashAmount){
      setSingleClick({pointerEvents:"none"})
    }else{
      return
    }
  };

  const changeCardAmount = (e) => {
    if((+e.target.value <= +val && val > 0) || +e.target.value  < +paymentInfo?.cardAmount){ 
      const valid =/^\d+(\.\d{1,2})?$/;
      const text = e.target.value;  
      const isValid = valid.test(text)
      if(e.target.value[e.target.value.length-1] === "." ||
        (e.target.value[e.target.value.length-1] === "0" && e.target.value[e.target.value.length-2] === ".")
      ){
        setSingleClick({pointerEvents:"none"})
        setBlockTheButton(true)
        setPaymentInfo({
          ...paymentInfo,
          cardAmount: e.target.value,
          cashAmount: (val - ( e.target.value || 0)),
        })
      }else if(isValid || e.target.value === "") {
        setBlockTheButton(false)
        setPaymentInfo({
          ...paymentInfo,
          cardAmount: Number(text),
          cashAmount: +(val - ( e.target.value || 0)).toFixed(2),
        })
      }else{
        return 
      }
    }
  };
  useEffect(() => {
    setVal(0)
    setTotalPrice(0)
  }, []);

  useEffect(() => {
    setPaymentInfo({
      ...paymentInfo,
      cashAmount: val,
    })
  }, [val, flag]);

  return(
    <div className={styles.saleInfoInputs}>
      <h5>
        {t("basket.prepaymentTitle")}
      </h5>
      <div>
      <span>{t("basket.useprepayment")}</span>
      <input
        autoComplete="off"
        value={val}
        name="cashAmount"
        onChange={(e)=> handleChangePrepayment(e)}
      />
      </div>
      <div>
       <span>{t("history.cash")}</span> 
        <input
          value={!paymentInfo?.cardAmount? val : (val - paymentInfo?.cardAmount).toFixed(2)}
          readOnly
        />
      </div>
      <div>
      <span>{t("history.card")}</span>
        <input
          autoComplete="off"
          value={paymentInfo?.cardAmount || ""}
          name="cardAmount"
          onChange={(e)=> changeCardAmount(e)}
        />
      </div>
    </div>
  )
};

export default memo(AdvancePayment);
 