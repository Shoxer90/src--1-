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
  trsf,
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
      // setPaymentInfo({
      //   ...paymentInfo,
      //   [e.target.name]:+e.target.value,
      // })
      setFlag(e.target.value)
    }
};

  const payChanges = (e) => {
    if(e.target.name === "cashAmount") {
      setPaymentInfo({
        ...paymentInfo,
        cashAmount: +e.target.value,
        cardAmount: val-e.target.value
      })
    }else {
    if(e.target.name === "cardAmount")
      setPaymentInfo({
        ...paymentInfo,
        cardAmount: +e.target.value,
        cashAmount: val - e.target.value
      })
    }
  };

  useEffect(() => {
    // !trsf && cashChanges()
    setVal(totalPrice - prepayment)
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
          readOnly
        />
      </div>

      {prepayment ?
        <div style={{color:"orange", fontSize:"110%"}}>
          <span>
            {t("basket.useprepayment")}
          </span>
          <input
            value={`${prepayment} ${t("units.amd")}`}
            readOnly
            style={{border:"none",color:"orange",fontWeight: 600}}
          />
        </div>:""
      }
      <div>
        <span>
          {t("history.cash")}
        </span>
        <input
          autoComplete="off"
          name="cashAmount"
          value={paymentInfo?.cashAmount}
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
          value={paymentInfo?.cardAmount}
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
      {/* <Divider flexItem  sx={{bgcolor:"black"}} /> */}
      {/* new */}
      <span style={{marginTop:"13px", marginBottom:"13px", color:'orange'}}>
        <span>
          {t("basket.remainder")} 
        </span>
        <span style={{marginLeft:"20px"}}>
          {(totalPrice-paymentInfo?.cardAmount-paymentInfo?.cashAmount- paymentInfo?.prePaymentAmount).toFixed(2)}
        </span>
      </span>
      <Divider flexItem sx={{bgcolor:"black"}} />

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
    </div>
  )
};

export default memo(ProductPayment);
