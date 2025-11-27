import React, { useEffect, useState, memo} from "react";
import styles from "../index.module.scss";
import { numberSpacing } from "../../../modules/numberSpacing";
import { Button, ButtonGroup, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";

const ProductPrePayment = ({
  totalPrice,
  paymentInfo, 
  setPaymentInfo,
  setBlockTheButton,
}) => {
  const {t} = useTranslation()
  
  const [val, setVal] = useState(totalPrice);
  const [flag, setFlag] = useState();

  const handleChangeInput = (e) => {
  const valid =/^\d+(\.\d{1,2})?$/;
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
    setVal(totalPrice)
    !paymentInfo?.cardAmount && !paymentInfo?.cashAmount && setBlockTheButton(true)
  }, [totalPrice, flag, paymentInfo?.discount, paymentInfo?.cardAmount, paymentInfo?.cashAmount]);

  return(
    paymentInfo && <div className={styles.saleInfoInputs}>
      <div>
        <span>{t("history.total")}</span>
        <input value={numberSpacing(totalPrice?.toFixed(2))} readOnly />
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
        <ButtonGroup>
        <Button 
          size="small" 
          style={{background:"#F69221", color:"white", padding:"1px 3px"}} 
          onClick={()=>{
           setBlockTheButton(false)
            setPaymentInfo({
              ...paymentInfo,
              "cardAmount": 0,
              "cashAmount":totalPrice,
            })
          }
          }
        >
          100%
        </Button>
          <input
            name="cashAmount"
            value={paymentInfo?.cashAmount || ""}
            autoComplete="off"
            style={{width:window?.screenX>1100 && "110px", borderRadius:"0px 5px 5px 0px"}}
            onChange={(e)=> {
              if(+e.target.value + paymentInfo?.cardAmount <= val) handleChangeInput(e)
            }}
          />
        </ButtonGroup>
       
      </div>
    
      <div>
        <span>{t("history.card")}</span>
        <ButtonGroup>
        <Button 
          size="small" 
          style={{background:"#F69221", color:"white", padding:"1px 3px"}} 
          onClick={ () => {
            setBlockTheButton(false)
            setPaymentInfo({
              ...paymentInfo,
              "cashAmount": 0,
              "cardAmount":totalPrice,
            })
          }
        }
        >
          100%
        </Button>
        <input
          value={paymentInfo?.cardAmount || ""}
          name="cardAmount"
          autoComplete="off"
          style={{width:window?.screenX>1100 && "110px", borderRadius:"0px 5px 5px 0px"}}
          onChange={(e)=> {
            if(+e.target.value + paymentInfo?.cashAmount <= val) handleChangeInput(e)
          }}
        />
        </ButtonGroup>
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
          onChange={(e)=>limitChar(e,8)}
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
      <Divider flexItem sx={{bgcolor:"black"}} />
    </div>
  )
};

export default memo(ProductPrePayment);
