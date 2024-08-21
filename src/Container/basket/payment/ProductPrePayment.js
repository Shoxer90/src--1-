import React, { useEffect, useState, memo} from "react";
import styles from "../index.module.scss";
import { numberSpacing } from "../../../modules/numberSpacing";

const ProductPrePayment = ({
  t, 
  totalPrice,
  checkDiscountVsProdPrice, 
  paymentInfo, 
  setPaymentInfo,
  trsf,
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
        [e.target.name]:+e.target.value,
      })
      setFlag(e.target.value)
    }
};


  const initialPayment = () => {
    setPaymentInfo({
      ...paymentInfo,
      cashAmount: 0
    })
  };

  useEffect(() => {
    // !trsf && cashChanges()
    setVal(totalPrice)
  if(!paymentInfo?.cardAmount && !paymentInfo?.cashAmount){
    setBlockTheButton(true)

  }
  }, [totalPrice, flag, paymentInfo?.discount, paymentInfo?.cardAmount, paymentInfo?.cashAmount]);

  useEffect(() => {
    initialPayment()
  }, []);


  return(
    paymentInfo && <div className={styles.saleInfoInputs}>
      <div>
        <span>
          {t("history.total")} 
        </span>
        <input 
          value={numberSpacing(totalPrice.toFixed(2))}
          readOnly/>
      </div>

      <h6>{t("basket.prepaymentGenerate")}</h6>

      <div>
        <span>
          {t("history.cash")}
        </span>
        <input
          name="cashAmount"
          value={paymentInfo?.cashAmount || ""}
          autoComplete="off"

          onChange={(e)=> {
            if(+e.target.value + paymentInfo?.cardAmount <= val){
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
            if(+e.target.value + paymentInfo?.cashAmount <= val){
            handleChangeInput(e)
            }
          }}
        />
      </div>

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
     
      <h5 style={{marginTop:"13px", marginBottom:"13px", color:'orange'}}>
        <span>
          {t("basket.remainder")} 
        </span>
        <span style={{marginLeft:"20px"}}>
          {numberSpacing(totalPrice.toFixed(2)-paymentInfo?.cardAmount-paymentInfo?.cashAmount)}
        </span>
      </h5>
    </div>
  )
};

export default memo(ProductPrePayment);
