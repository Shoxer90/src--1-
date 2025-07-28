import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, InputBase } from "@mui/material";
import styles from "./index.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setSearchBarCodeSlice } from "../../../store/searchbarcode/barcodeSlice";
import { getInputChangeFunction } from "../../../Container/emarkScanner/ScannerManager";
import SearchBarcode from "../../../SearchBarcode";
import useDebonce from "../../hooks/useDebonce";
import QrCode2Icon from '@mui/icons-material/QrCode2';


const ReverseConditions = ({
  cashAmount,
  cardAmount,
  total,
  prePaymentAmount,

  reverseTotal,
  conditionState,
  setConditionState,
  receiptAmountForPrepayment,
  chooseFuncForSubmit,
  isAllSelected,
  defineEmarkQrs,
  checkEmarksOrSubmit
}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [blockButton,setBlockButton] = useState(false);
  const [emarkQr,setEmarkQr] = useState("");
  const [message,setMessage] = useState({
    type:"",
    message:""
  });
  const debounceEmark = useDebonce(emarkQr, 500);

  const [emarkQrList,setEmarkQrList] = useState([]);

  const emarkInput = useSelector(state=>state?.barcode?.reverse);
  console.log(emarkInput,"emarkInput");

  const fillEmarkQrs = (e) => {
    dispatch(setSearchBarCodeSlice({
      name:"reverse",
      value: e.target.value
    }))
  }

  const handleChangeInput = (e) => {
    const valid =/^\d*\.?(?:\d{1,2})?$/
    const text = e.target.value; 
    const isValid = valid.test(text);

    if(e.target.value > cardAmount || e.target.value > reverseTotal) return

    else if(isValid  || e.target.value === "" ) {
      return setConditionState({
        ...conditionState, 
        [e.target.name] : e.target.value === 0  ||
         e.target.value === "0" || 
           e.target.value[e.target.value.length -1]==="." 
         ? e.target.value : +e.target.value ,
        cashAmount: reverseTotal - conditionState?.cardAmount 
      })

    }else if(!isValid && `${e.target.value}`.length < `${conditionState?.cardAmount}`.length) {
      return setConditionState({
        ...conditionState,
        [e.target.name] : e.target.value,
        cashAmount: reverseTotal - conditionState?.cardAmount 
      })
    }
  };


  useEffect(() => {
    if( reverseTotal &&
         cashAmount + prePaymentAmount < conditionState?.cashAmount && 
        cardAmount < conditionState?.cardAmount) {
      setBlockButton(false)
    }else if(!reverseTotal || 
       cashAmount+prePaymentAmount < conditionState?.cashAmount || 
         cardAmount < conditionState?.cardAmount || 
         ( receiptAmountForPrepayment && 
        receiptAmountForPrepayment-reverseTotal < total &&
      !isAllSelected )
    ) {
      setBlockButton(true)
    }else{
      setBlockButton(false)
    }
  }, [reverseTotal, conditionState])
  
  useEffect(() => {
    if(reverseTotal >  cashAmount + prePaymentAmount) {
      setConditionState({
        cashAmount: +(cashAmount + prePaymentAmount).toFixed(2),
        cardAmount: +(reverseTotal-(+cashAmount + prePaymentAmount)).toFixed(2),
      })

    }else{
      setConditionState({
        cashAmount: reverseTotal ? +(reverseTotal)?.toFixed(2) : 0,
        cardAmount: 0,
      })
    }
    }, [reverseTotal]);
  
  
  
  useEffect(() => {
    setConditionState({
      ...conditionState,
      cashAmount: Math.floor(+(reverseTotal- conditionState?.cardAmount)*100)/100
    })
  }, [conditionState?.cardAmount]);

  useEffect(() => {
    emarkQr && debounceEmark && setEmarkQrList([
      ...emarkQrList,
      debounceEmark
    ])
  }, [emarkQr]);

console.log(emarkInput, emarkQrList, "qr, list")
  return (
    <div>
    <div className={styles.conditions}>
      <div style={{marginTop:"5px",width:"37%"}}>
        <div style={{color:"green", display:"flex", justifyContent:"space-between"}}>
          <span>{t("history.receiptPrice2")}</span>
          <span>{total} {t("units.amd")}</span>
        </div>
          <div style={{display:"flex", justifyContent:"space-between"}}>
            <span>{t("history.whichCash")}</span>
            <span>{cashAmount} {t("units.amd")}</span>
          </div>
          <div style={{display:"flex", justifyContent:"space-between"}}>
            <span>{t("history.whichCashless")}</span>
            <span>{cardAmount} {t("units.amd")}</span>
          </div>
          <div style={{display:"flex", justifyContent:"space-between"}}>
            <span>{t("history.whichPrepayment")}</span>
            <span>{prePaymentAmount} {t("units.amd")}</span>
          </div>
         
        </div>
        <div style={{width:"60%"}}>
        <div style={{display:"flex", justifyContent:"space-between", marginTop:"5px"}}>
          <span>{t("history.forReverse")}</span>
          {reverseTotal ? <span>
            <span style={{marginRight:"10px"}}>
              {reverseTotal ? reverseTotal.toFixed(2) : ""} 

            </span>
            {t("units.amd")}
          </span>: ""}
      
        </div>
        {cashAmount ?
          <div style={{display:"flex", justifyContent:"space-between"}}>
          <span>{t("history.getCash")}</span>
          <span>
            <input 
              style={{height:"20px"}}
              autoComplete="off"
              name="cashAmount"
              value={conditionState?.cashAmount || ""}
              readOnly
            />
            {t("units.amd")}
          </span>
        </div>: ""}
        {cardAmount ?
        <div style={{display:"flex", justifyContent:"space-between"}}>
          <span>{t("history.getCard")}</span>
          <span>
            <input 
              style={{height:"20px"}}
              className={styles.cardInput}
              autoComplete="off"
              name="cardAmount"
              value={conditionState?.cardAmount || ""}
              onChange={e => {
                if(!reverseTotal){
                  return
                }else{
                  handleChangeInput(e)
                }
              }}
            /> 
            {t("units.amd")}
          </span>
        </div>:""}
      </div>

      </div>
      
        {message?.message && <div style={{color:message?.type === "error"?"red": "green", fontWeight:600}}>{message?.message}</div>}
      <div style={{display:"flex", flexFlow:"column",alignItems:"center",justifyContent:"center"}}>
        <div style = {{color:"red",  padding:"0px 20px"}}> 
          {(conditionState?.cashAmount > cashAmount + prePaymentAmount) && `${t("dialogs.limitCash")} ${+cashAmount+ prePaymentAmount} ${t("units.amd")}`}
        </div>
      <div style = {{color:"red",  padding:"0px 20px"}}> 
        {(conditionState?.cardAmount > cardAmount) && `${t("dialogs.limitCard")} ${cardAmount} ${t("units.amd")}`}
      </div> 
      <div style = {{color:"red",  padding:"0px 20px"}}> 
        {(conditionState?.cardAmount > cardAmount) 
        }
      </div> 
        <Button 
          variant="contained" 
          sx={{background: "#3FB68A", width:"70%",textTransform: "capitalize"}}
          onClick={checkEmarksOrSubmit}
          // onClick={chooseFuncForSubmit}
          disabled={blockButton}
        >
        {t("buttons.submit")}
      </Button>
      </div>
  </div>

  )
};

export default memo(ReverseConditions);
