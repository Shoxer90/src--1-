import { memo, useEffect, useState } from "react";
import QrCode2Icon from '@mui/icons-material/QrCode2';
import SearchBarcode from "../../../SearchBarcode";
import { getInputChangeFunction } from "../../../Container/emarkScanner/ScannerManager";
import { setSearchBarCodeSlice } from "../../../store/searchbarcode/barcodeSlice";
import { useDispatch, useSelector } from "react-redux";
import useDebonce from "../../hooks/useDebonce";
import { useTranslation } from "react-i18next";
import { Button, Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

import DialogActions from '@mui/material/DialogActions';
import { replaceGS } from "../../../services/baseUrl";
const EmarkInput = ({
  open,
  close,
  chooseFuncForSubmit,
  // submitSendEmark,
  emarkQrList, setEmarkQrList,
  emarksForReverse,
  setEmarksForReverse
}) => {

  const emarkInput = useSelector(state=>state?.barcode?.reverse);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [emarkQr, setEmarkQr] = useState("");
  const [message, setMessage] = useState({
    message:"",
    type:""
  });
  
  const fillEmarkQrs = (e) => {
    dispatch(setSearchBarCodeSlice({
      name:"reverse",
      value: e.target.value
    }))
  };

const submitSendEmark = () => {
  if(!emarkQrList?.length && emarksForReverse?.length) {
    chooseFuncForSubmit()
  }else {
    setMessage({type:"error",message:"Duq vochinch cheq skaanavorel"})
  }
}

  const registerEmarksForReverse = async(emark) => {
    const scannedEmark = await replaceGS(emark)
    console.log(scannedEmark,"scannes")
  let flag = 0
  if(scannedEmark){
    emarkQrList && emarkQrList?.forEach((item) => {
       console.log(item === scannedEmark,"item === scannedEmark")
       if(item === scannedEmark) {
        flag+=1
         setEmarksForReverse([
           scannedEmark,
           ...emarksForReverse
         ])
       }
     })
     if(flag) {
      setEmarkQrList(emarkQrList.filter((item) => item !==scannedEmark))
       setMessage({
         type:"success",
         message: t("settings.removed")
       })
     }else{
       setMessage({
         type:"error",
         message: t("mainnavigation.searchEmarkconcl")
       })

     }
    setTimeout(()=>{
       setMessage({
         type:"",
         message: ""
       })
     cleanInput()
    }, 3000)
  }
}


  const cleanInput = () => {
    dispatch(setSearchBarCodeSlice({
      name:"reverse",
      value: ""
    }))
  };

  useEffect(() => {
    registerEmarksForReverse(emarkInput)
  }, [emarkInput]);

  console.log(emarkQrList,"emarkQrList")
  console.log(emarksForReverse,"emarksForReverse")
  return (
    <Dialog open={open} onClose={close}> 
       <DialogTitle>{t("mainnavigation.scanEmarkForReverse")}</DialogTitle>
        <DialogContent sx={{ paddingBottom: 0}}>
        {emarkQrList?.length ? <>
          <DialogContentText>Սկանավորեք վերադարձվող ապրանքի կոդերը</DialogContentText>
          <div style={{ display:"flex"}}>
            <QrCode2Icon fontSize="large" />
            <SearchBarcode
              searchValue={emarkQr}
              setSearchValue={setEmarkQr}
              byBarCodeSearching={fillEmarkQrs}
              setFrom={""}
              stringFrom="reverse"
              dataGroup={""}
            />
          </div>
          <div style={{height:"50px"}}>
            {message?.message ? 
              <span style={{color:message?.type==="error"?"red":"green"}}>
                {message?.message}
              </span>: ""
            }
          </div>
        </>:""}
        <div>{t("basket.remainder2")} {emarkQrList?.length} {t("units.pcs")}</div>
        <DialogActions>
          {emarkQrList?.length? <Button onClick={chooseFuncForSubmit}>{t("buttons.noEmark")}</Button>: ""}
          <Button onClick={submitSendEmark}>{t("buttons.submit")}</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
};

export default memo(EmarkInput);
