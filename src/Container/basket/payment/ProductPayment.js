import React, { useEffect, useState, memo} from "react";
import styles from "../index.module.scss";
import { numberSpacing } from "../../../modules/numberSpacing";
import { Divider } from "@mui/material";

const ProductPayment = ({
  t, 
  totalPrice,
  paymentInfo, 
  setPaymentInfo,
  setBlockTheButton,
  prepayment
}) => {
  const [val, setVal] = useState(totalPrice);
  const [flag, setFlag] = useState();

  const handleChangeInput = (e) => {
    setBlockTheButton(false)

    const valid =/^\d*\.?(?:\d{1,2})?$/
    const text = e.target.value;  
    const isValid = valid.test(text);
    if(e.target.value[e.target.value.length-1] === "." || e.target.value === 0 ||
     (e.target.value[e.target.value.length-1] === "0" && e.target.value[e.target.value.length-2] === ".")
    ){
      setBlockTheButton(true)
      setPaymentInfo({
        ...paymentInfo,
        [e.target.name]:e.target.value,
      })
    }else if(isValid || e.target.value === ""){
      setBlockTheButton(false)
      payChanges(e)
      setFlag(e.target.value)
    }
};

  const payChanges = (e) => {
    if(e.target.name === "cashAmount") {
      setPaymentInfo({
        ...paymentInfo,
        cashAmount: 
        e.target.value === 0  ||
        e.target.value === "0" || 
        e.target.value[e.target.value.length -1]==="." ?
        e.target.value : 
        + e.target.value ,

        cardAmount: +(val - e.target.value)?.toFixed(2)
      })
    }else {
    if(e.target.name === "cardAmount")
      setPaymentInfo({
        ...paymentInfo,
        cardAmount:
         e.target.value === 0  ||
        e.target.value === "0" || 
        e.target.value[e.target.value.length -1]==="." ?
        e.target.value :
         + e.target.value ,
        cashAmount: +(val - e.target.value).toFixed(2)
      })
    }
  }; 

  const limitChar = (e,val) => {
    const text = e.target.value;  
      const valid = /^[0-9]*$/;
      if(valid.test(text) &&  text.length <= val) {
        return setPaymentInfo({
          ...paymentInfo,
          [e.target.name]:e.target.value
        })
      }else {
        e.preventDefault(); 
      }
  };

  useEffect(() => {
    setVal(totalPrice - prepayment)
  }, [totalPrice, flag, paymentInfo?.discount, paymentInfo?.cardAmount, paymentInfo?.prePaymentAmount]);

  return(
    paymentInfo && <div className={styles.saleInfoInputs}>
      <div>
        <span>
          {t("history.total")} 
        </span>
        <input 
          value={totalPrice && numberSpacing(totalPrice.toFixed(2))}
          readOnly
        />
      </div>

      {prepayment ?
        <div>
          <span style={{fontSize:"95%"}}>
            {t("history.combo")}
          </span>
          <input
            value={prepayment.toFixed(2)}
            readOnly
          />
        </div>:""
      }
      {paymentInfo?.prePaymentAmount ? <div style={{color:'orangered',fontSize:"100%",fontWeight:"800", marginTop:"10px"}}>
        <span>
          {t("basket.amount")} {`${( totalPrice - paymentInfo?.prePaymentAmount).toFixed(2)}  ${t("units.amd")}`}
        </span>
      </div>:""}
      <div>
        <span>
          {t("history.cash")}
        </span>
        <input
          autoComplete="off"
          name="cashAmount"
          value={paymentInfo?.cashAmount || ""}
          onChange={(e)=> {
            if(+e.target.value <= val){
              handleChangeInput(e)
            }
          }}
        />
      </div>

      <div>
        <span>
          {t("history.card")}
        </span>
        <input
          value={paymentInfo?.cardAmount || ""}
          name="cardAmount"
          autoComplete="off"
          onChange={(e)=> {
            if(+e.target.value <= val){
              handleChangeInput(e)
            }
          }}
        />
      </div>
      <div>
        <span>
          {t("basket.partner")}{" "} 
        </span>
        <input
          value={paymentInfo?.partnerTin}
          autoComplete="off"
          name="partnerTin"
          placeholder={`8 ${t('productinputs.symb')}`}
          onChange={(e)=>limitChar(e,8)}
        />
      </div>
        <div style={{height:"20px", color:"orange", display:"flex", justifyContent:"flex-start"}}>
          <span>{paymentInfo?.customer_Name}</span> <span style={{marginLeft:"10px"}}> {paymentInfo?.customer_Phone}</span>
        </div>
      <Divider flexItem sx={{bgcolor:"black"}} />
    </div>
  )
};

export default memo(ProductPayment);
