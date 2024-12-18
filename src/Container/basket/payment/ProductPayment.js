import React, { useEffect, useState, memo} from "react";
import styles from "../index.module.scss";
import { numberSpacing } from "../../../modules/numberSpacing";
import { Divider } from "@mui/material";

const ProductPayment = ({
  t, 
  totalPrice,
  checkDiscountVsProdPrice, 
  paymentInfo, 
  setPaymentInfo,
  setBlockTheButton,
  prepayment
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
      payChanges(e)
      setFlag(e.target.value)
    }
};

  const payChanges = (e) => {
    if(e.target.name === "cashAmount") {
      setPaymentInfo({
        ...paymentInfo,
        cashAmount: +e.target.value,
        cardAmount: Math.floor((val-e.target.value)*100)/100
      })
    }else {
    if(e.target.name === "cardAmount")
      setPaymentInfo({
        ...paymentInfo,
        cardAmount: +e.target.value,
        cashAmount: Math.floor((val-e.target.value)*100)/100
      })
    }
  };

  useEffect(() => {
    // !trsf && cashChanges()
    setVal(totalPrice - prepayment)
    setBlockTheButton(false)
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
        <div style={{color:"orange", fontSize:"95%"}}>
          <span>
            {t("basket.prepaymentTitle")}
          </span>
          <input
            value={`${prepayment.toFixed(2)} ${t("units.amd")}`}
            readOnly
            style={{color:"orange",fontWeight: 600}}
          />
        </div>:""
      }
      {paymentInfo?.prePaymentAmount ? <div style={{color:'orange',fontSize:"95%", marginBottom:"20px"}}>
        <span>
          {t("basket.remainder")} 
        </span>
        <input
          value={`${( totalPrice- paymentInfo?.prePaymentAmount).toFixed(2)}  ${t("units.amd")}`}
          // value={`${(totalPrice-paymentInfo?.cardAmount-paymentInfo?.cashAmount- paymentInfo?.prePaymentAmount).toFixed(2)}  ${t("units.amd")}`}
          readOnly
          style={{color:"orange",fontWeight: 600}}
        />
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
          // value={paymentInfo?.cardAmount || ""}
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
        <div style={{height:"20px", color:"orange", display:"flex", justifyContent:"flex-start"}}>
          <span>{paymentInfo?.customer_Name}</span> <span style={{marginLeft:"10px"}}> {paymentInfo?.customer_Phone}</span>
        </div>
      {/* <span style={{marginTop:"13px", marginBottom:"13px", color:'orange'}}>
        <span>
          {t("basket.remainder")} 
        </span>
        <span style={{marginLeft:"20px"}}>
          {(totalPrice-paymentInfo?.cardAmount-paymentInfo?.cashAmount- paymentInfo?.prePaymentAmount).toFixed(2)}
        </span>
      </span> */}
      <Divider flexItem sx={{bgcolor:"black"}} />
    </div>
  )
};

export default memo(ProductPayment);
