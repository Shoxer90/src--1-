import React , { memo, useEffect } from "react";

import { TextField } from "@mui/material";
import Barcode from "react-barcode";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setSearchBarCodeSlice } from "../../../store/searchbarcode/barcodeSlice";
import { getInputChangeFunction } from "../../../Container/emarkScanner/ScannerManager";

const BarcodeInput = ({
  emptyValidate, 
  newProduct, 
  setProduct,
  isUniqBarCode,
  setIsUniqBarcode,
  from
}) => {
  const {t}= useTranslation();
  const barInput = useSelector(state => state?.barcode?.newProd);
  const dispatch = useDispatch();

  const barcodeValidation = (event) => {
    const valid = /^[a-zA-Z0-9_]+$/
    const text = event.target.value;  
    if(valid.test(text)){
      dispatch(setSearchBarCodeSlice({
        name: "newProd",
        value: event.target.value
      }))
      setProduct({
        ...newProduct,
        barCode: event.target.value
      })
    }else if(event.target.value.trim() === ""){
      setProduct({
        ...newProduct,
        barCode: event.target.value.trim()
      })
      dispatch(setSearchBarCodeSlice({
        name: "newProd",
        value: event.target.value.trim()
      }))

      setIsUniqBarcode(false)
      return
    }else{
      return 
    }
  }
  useEffect(() => {
    getInputChangeFunction("newProd")
  }, [])
    
  return (
    <div>
      <div style={{display:"flex", justifyContent:"space-between",flexDirection:"column"}}>
        <TextField 
          error={(emptyValidate && !newProduct?.barCode) || !isUniqBarCode}
          style={{marginBottom:"10px",width:"250px"}}
          size="small"
          variant="outlined"
          name="barCode" 
          value={barInput}
          // value={newProduct?.barCode}
          label={`${t("productinputs.barcode")} (max 20 ${t("productinputs.symb")})*`}
          onChange={(e)=>{
            if(e.target.value?.length>20) return
            setIsUniqBarcode(true)
            barcodeValidation(e)
          }} 
        />
        <div style={{height:"90px"}}>
          {newProduct?.barCode && 
            <Barcode value={newProduct?.barCode} height={45} width={1.5} />
          }
        </div>
      </div>
    </div>
  
  )
};

export default memo(BarcodeInput);
