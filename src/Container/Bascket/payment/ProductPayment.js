import React, { useEffect, useState, memo} from "react";
import styles from "../index.module.scss";
import { numberSpacing } from "../../../modules/numberSpacing";

const ProductPayment = ({t, 
  totalPrice,
  checkDiscountVsProdPrice, 
  paymentInfo, 
  setPaymentInfo,
  setSingleClick,
  trsf,
}) => {
  const [val, setVal] = useState(totalPrice);
  const [flag, setFlag] = useState();
  const [numberMind, setNumberMind] = useState();

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

  const cashChanges = (e) => {
    setPaymentInfo({
      ...paymentInfo,
      cashAmount:+( 
        totalPrice 
        - totalPrice * paymentInfo?.discount / 100
        - paymentInfo?.cardAmount 
        - paymentInfo?.prePaymentAmount 
      ).toFixed(2)
    })
  }

  const handleChangeInput = (e) => {
    setSingleClick({})
    if(+e.target.value <= +val){
      setPaymentInfo({
        ...paymentInfo,
        [e.target.name]:+e.target.value,
      })
    }
    if(+e.target.value < +paymentInfo?.[e.target.name]){ 
      setVal(numberMind)
      setPaymentInfo({
        ...paymentInfo,
        [e.target.name]:+e.target.value,
      })
    }
    setFlag(e.target.value)

    if(val-e.target.value < 1 && Boolean((val-e.target.value)%1)) {
      if(!(+e.target.value < +paymentInfo?.[e.target.name])){
        setPaymentInfo({
          ...paymentInfo,
          cashAmount: 0,
          [e.target.name]: val
        })
      }else {
        setPaymentInfo({
          ...paymentInfo,
          cashAmount: 0,
          [e.target.name]: 0
        })
      }
    } 
  };

  useEffect(() => {
    cashChanges()
  },[flag]);
 

  useEffect(() => {
    !val && setSingleClick({pointerEvents:"none"})
  },[])

  useEffect(() => {
    !trsf && setPaymentInfo({
      ...paymentInfo,
      cashAmount:+( 
        totalPrice 
        - totalPrice * paymentInfo?.discount / 100
      ).toFixed(2),  
      cardAmount: 0, 
      prePaymentAmount: 0,
      partialAmount: 0,
    })
    setVal(totalPrice)
  }, [totalPrice, paymentInfo?.discount]);

  return(
    <div className={styles.saleInfoInputs}>
      <div>
        <span>
          {t("history.total")} 
        </span>
        <input value={numberSpacing(totalPrice)} readOnly/>
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
        <input value={numberSpacing(paymentInfo?.cashAmount)} readOnly />
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
            handleChangeInput(e)
          }}
          onFocus={()=>{
            setVal(paymentInfo?.cashAmount)
            setNumberMind(+paymentInfo?.cardAmount+paymentInfo?.cashAmount)
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
            handleChangeInput(e)
           
          }}
          onFocus={()=>{
            setVal(paymentInfo?.cashAmount)
            setNumberMind(+paymentInfo?.prePaymentAmount+paymentInfo?.cashAmount)
          }}
        />
      </div>
      <div>
        <span>
          {t("basket.partner")}{" "}
        </span>
        <input
          type="number"
          value={paymentInfo?.partnerTin}
          name="partnerTin"
          onChange={(e)=> {
            if(`${e.target.value}`?.length <= 8){
              setPaymentInfo({
                ...paymentInfo,
                [e.target.name]:e.target.value
              })
            }
          }}
        />
      </div>
    </div>
  )
};

export default memo(ProductPayment);
