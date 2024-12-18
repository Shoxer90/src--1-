import React, { useEffect, useState, memo} from "react";
import styles from "../index.module.scss";
import { numberSpacing } from "../../../modules/numberSpacing";
import { Divider } from "@mui/material";

const ProductPrePayment = ({
  t, 
  totalPrice,
  checkDiscountVsProdPrice, 
  paymentInfo, 
  setPaymentInfo,
  setBlockTheButton,
}) => {
  const [val, setVal] = useState(totalPrice);
  const [flag, setFlag] = useState();

  const discountChange = (e) => {
    checkDiscountVsProdPrice(e.target.value)
    if(e.target.value > 99) {
      return setPaymentInfo({
        ...paymentInfo,
        [e.target.name]:99,
        cardAmount: 0,
        prePaymentAmount: 0,
      }) 
    }else{
      setPaymentInfo({
        ...paymentInfo,
        [e.target.name]: +Math.round(e.target.value)
      })
    }
  };

  const handleChangeInput = (e) => {
  const valid =/^\d+(\.\d{1,2})?$/;
    const text = e.target.value;  
    const isValid = valid.test(text);
    
    if(e.target.value[e.target.value.length-1] === "." ||
     (e.target.value[e.target.value.length-1] === "0" && e.target.value[e.target.value.length-2] === ".")
    ){
      setBlockTheButton(true)
      setPaymentInfo({
        ...paymentInfo,
        [e.target.name]:e.target.value,
      })
    }else if(isValid || e.target.value === ""){
      
      setBlockTheButton(false)
      setPaymentInfo({
        ...paymentInfo,
        [e.target.name]:Math.floor(+e.target.value*100)/100,
      })
      setFlag(e.target.value)
    }
};

  useEffect(() => {
    setVal(totalPrice)
    !paymentInfo?.cardAmount && !paymentInfo?.cashAmount && setBlockTheButton(true)
  }, [totalPrice, flag, paymentInfo?.discount, paymentInfo?.cardAmount, paymentInfo?.cashAmount]);

  return(
    paymentInfo && <div className={styles.saleInfoInputs}>
      <div>
        <span>{t("history.total")}</span>
        <input value={numberSpacing(totalPrice.toFixed(2))} readOnly />
      </div>
      <div style={{margin:"10px 0px", color:'orange', fontWeight:700}}>
        <span>
          {t("basket.remainder")} 
          <span style={{marginLeft:"10px",display:"inline-block"}}>
            {(totalPrice-paymentInfo?.cardAmount-paymentInfo?.cashAmount).toFixed(2)}
          </span>
        </span>
      </div>
      <h6>{t("basket.prepaymentGenerate")}</h6>
      <div>
        <span>{t("history.cash")}</span>
        <input
          name="cashAmount"
          value={paymentInfo?.cashAmount || ""}
          autoComplete="off"
          onChange={(e)=> {
            if(+e.target.value + paymentInfo?.cardAmount <= val) handleChangeInput(e)
          }}
        />
      </div>
    
      <div>
        <span>{t("history.card")}</span>
        <input
          value={paymentInfo?.cardAmount || ""}
          name="cardAmount"
          autoComplete="off"
          onChange={(e)=> {
            if(+e.target.value + paymentInfo?.cashAmount <= val) handleChangeInput(e)
          }}
        />
      </div>

{/* PHONE AND NAME */}
      <h6>{t("basket.customer")}</h6>
      <div>
        <span >
          {t("basket.partner")}{" "}
        </span>
        <input
          value={paymentInfo?.partnerTin}
          autoComplete="off"
          name="partnerTin"
          placeholder={`8 ${t('productinputs.symb')}`}
          onChange={(e)=> {
            if(`${e.target.value}`?.length <= 8){
              setPaymentInfo({
                ...paymentInfo,
                [e.target.name]:e.target.value.replace(/[^1-9]+/g,"")
              })
            }
          }}
        />
      </div>

      <div>
        <span>{t("authorize.notes")} </span>
        <input
          value={paymentInfo?.customer_Name}
          autoComplete="off"
          name="customer_Name"
          onChange={(e)=> {
            setPaymentInfo({
              ...paymentInfo,
              [e.target.name]:e.target.value
            })
          }}
        />
      </div>
      {/* <div>
        <span >
        {t('authorize.phone')}
        </span>
        <input
          value={paymentInfo?.customer_Phone}
          autoComplete="off"
          name="customer_Phone"
          onChange={(e)=> {
            setPaymentInfo({
              ...paymentInfo,
              [e.target.name]:e.target.value.replace(/[^0-9]+/g,"")
            })
          }}
        />
      </div> */}
{/* PHONE AND NAME  IS OVER*/}
     
     
      <Divider flexItem sx={{bgcolor:"black"}} />

    </div>
  )
};

export default memo(ProductPrePayment);
