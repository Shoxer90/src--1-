import React, { useEffect, useState } from "react";
import { memo } from "react";
import styles from "../index.module.scss"

  const AdvancePayment = ({t,paymentInfo, setPaymentInfo, flag, setSingleClick}) => {

  const [val,setVal] = useState();

const handleChangePrepayment = async(event) => {
    setSingleClick({})
    const valid = /^\d*\.?(?:\d{1,2})?$/;
    const text = event.target.value;  
    if(valid.test(text)){
      console.log(event.target.value,"VALUE")
      setVal(text)
    }else{
      return 
    }
  };

  useEffect(() => {
    setPaymentInfo({
    ...paymentInfo,
    cashAmount:+val - paymentInfo?.cardAmount || 0,
    cardAmount: paymentInfo?.cardAmount || 0,
  })
  }, [val]);

useEffect(() => {
  setPaymentInfo({
    discount: 0,
    discountType: 0,
    cashAmount: 0,
    cardAmount: 0,
    prePaymentAmount: 0,
    partialAmount: 0,
    partnerTin: "",
    sales: [],
    phoneNumber: ""
  })
}, [flag]);

  return(
    <div className={styles.saleInfoInputs}>
      <h5>
        {t("basket.prepaymentTitle")}
      </h5>
      <div>
      <span>{t("basket.useprepayment")}</span>
      <input
        // style={{border:!empty ? "red solid 2px": null}}
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
            setSingleClick({})
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
 