import React , { memo } from "react";

import { TextField } from "@mui/material";
import Barcode from "react-barcode";
import { useTranslation } from "react-i18next";

const BarcodeInput = ({
  emptyValidate, 
  newProduct, 
  setProduct,
  isUniqBarCode,
  setIsUniqBarcode,
}) => {
  const {t}= useTranslation();
  
  const barcodeValidation = (event) => {
    const valid = /^[a-zA-Z0-9_]+$/
    const text = event.target.value;  
    if(valid.test(text)){
      setProduct({
        ...newProduct,
        barCode: event.target.value
      })
    }else if(event.target.value.trim() === ""){
      setProduct({
        ...newProduct,
        barCode: event.target.value.trim()
      })
      setIsUniqBarcode(false)
      return
    }else{
      return 
    }
  }
    
  return (
    <div>
      <div style={{display:"flex", justifyContent:"space-between",flexDirection:"column"}}>
        <TextField 
          error={(emptyValidate && !newProduct?.barCode) || !isUniqBarCode}
          style={{marginBottom:"10px",width:"250px"}}
          size="small"
          variant="outlined"
          name="barCode" 
          value={newProduct?.barCode}
          label={`${t("productinputs.barcode")} *`}
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
