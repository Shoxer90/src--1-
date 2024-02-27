import React, { useEffect, useState, memo} from "react";
import styles from "../index.module.scss";
import { numberSpacing } from "../../../modules/numberSpacing";

const ProductPayment = ({
  t, 
  totalPrice,
  checkDiscountVsProdPrice, 
  paymentInfo, 
  setPaymentInfo,
  setSingleClick,
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
    setSingleClick({})
};

  const cashChanges = () => {
    setPaymentInfo({
      ...paymentInfo,
      cashAmount:+( 
        totalPrice 
        - totalPrice * paymentInfo?.discount / 100
        - paymentInfo?.cardAmount 
        - paymentInfo?.prePaymentAmount 
      ).toFixed(2),
    })
  };

  useEffect(() => {
    !trsf && cashChanges()
    setVal(totalPrice)
    setBlockTheButton(false)
  }, [totalPrice, flag, paymentInfo?.discount, paymentInfo?.cardAmount,paymentInfo?.prePaymentAmount]);

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

      {/* Ժամակավոր կասեցնել զեղչային ինփութը*/}
      {/* <div >
        <span style={{width:"95px"}} >
          {`${t("productcard.discount")}  %`}
        </span>
         <div style={{width:"45%",marginBottom: "0px",marginTop:"0px"}}>
          <input
            style={{margin:"0px",marginRight: "6px"}}
            type="number"
            value={paymentInfo?.discount || ""}
            min={0}
            max={99}
            name="discount"
            onChange={(e)=>discountChange(e)}
          /> 
          <span style={{fontSize:"80%",width:"200px"}}> = {numberSpacing((totalPrice * paymentInfo?.discount / 100).toFixed(2))} {t("units.amd")} </span>
        </div>
      </div> */}

      {/* <div>
        <span>
          {t("basket.amount")}
        </span>
        <input
          value={numberSpacing((totalPrice - totalPrice * paymentInfo?.discount / 100).toFixed(2))}
          readOnly
        />
      </div> */}
  
      <div>
        <span>
          {t("history.cash")}
        </span>
        <input value={numberSpacing(paymentInfo?.cashAmount.toFixed(2))} readOnly />
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
            if(+e.target.value <= val - paymentInfo?.prePaymentAmount){
            handleChangeInput(e)
            }
          }}
        />
      </div>
      <div>
        <span>
          {t("basket.useprepayment")}
        </span>
        <input
          value={paymentInfo?.prePaymentAmount || ""}
          name="prePaymentAmount"
          autoComplete="off"
          onChange={(e)=> {
            if(+e.target.value <= val - paymentInfo?.cardAmount){
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
    </div>
  )
};

export default memo(ProductPayment);
