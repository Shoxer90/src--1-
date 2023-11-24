import React, { useEffect, useState } from "react";
import { memo } from "react";
import styles from "../index.module.scss"

  const AdvancePayment = ({t,paymentInfo, setPaymentInfo, flag, basketContent, setSingleClick}) => {

  const [val,setVal] = useState("");

  const handleChangePrepayment = async(event) => {
    !event.target.value.length || !+event.target.value ?
     setSingleClick({pointerEvents:"none"}) : setSingleClick({})
    const valid = /^\d*\.?(?:\d{1,2})?$/;
    const text = event.target.value;  
    if(valid.test(text)){
      setVal(text)
    }else{
      return 
    }
  };
console.log(basketContent?.length,"CONTENT")
console.log(paymentInfo?.cashAmount,"cash")
  useEffect(() => {
   !basketContent?.length && !val && setSingleClick({pointerEvents:"none"}) &&
   setPaymentInfo({
      discount: 0,
      discountType: 0,
      cashAmount: "",
      cardAmount: "",
      prePaymentAmount: "",
      partialAmount: "",
      partnerTin: "",
      sales: [],
      phoneNumber: ""
    })
  }, [flag, val]);

  return(
    <div className={styles.saleInfoInputs}>
      <h5>
        {t("basket.prepaymentTitle")}
      </h5>
      <div>
      <span>{t("basket.useprepayment")}</span>
      <input
        type="number"
        value={val}
        name="cashAmount"
        onChange={(e)=>{
          setPaymentInfo({
            ...paymentInfo,
            cardAmount:""
          })
          handleChangePrepayment(e)
        }}
      />
      </div>
      <div>
       <span>{t("history.cash")}</span> 
        <input
          type="number"
          value={val-paymentInfo?.cardAmount || ""}
          name="cashAmount"
          readOnly
        />
      </div>
      <div>
      <span>{t("history.card")}</span>
        <input
          value={paymentInfo?.cardAmount || ""}
          name="cardAmount"
          onChange={(e)=> { 
            if((+e.target.value <= +val && val > 0) || +e.target.value  < +paymentInfo?.cardAmount){ 
              setPaymentInfo({
                ...paymentInfo,
                cardAmount:+ e.target.value.replace(/[^0-9]/g, "") || 0,
                cashAmount: val - ( e.target.value.replace(/[^0-9]/g, "") || 0),
              })
            }
          }}
        />
      </div>
    </div>
  )
};

export default memo(AdvancePayment);
 