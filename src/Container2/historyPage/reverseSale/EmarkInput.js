import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useDispatch, useSelector } from "react-redux";
import { setSearchBarCodeSlice } from "../../../store/searchbarcode/barcodeSlice";

import { replaceGS } from "../../../services/baseUrl";

import QrCode2Icon from '@mui/icons-material/QrCode2';
import DialogActions from '@mui/material/DialogActions';
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";

import SearchBarcode from "../../../SearchBarcode";

const EmarkInput = ({
  open,
  close,
  chooseFuncForSubmit,
  emarksForReverse,
  setEmarksForReverse,
  checkedEmarkQRs,
  setCheckedEmarkQRs
}) => {

  const emarkInput = useSelector(state=>state?.barcode?.reverse);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [emarkQr, setEmarkQr] = useState("");
  const [from, setFrom] = useState("");
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
    if(!checkedEmarkQRs?.length && emarksForReverse?.length) {
      chooseFuncForSubmit()
    }else {
      setMessage({type:"error",message:t("emark.noEmark")})
    }
  }

  const registerEmarksForReverse = async(emark) => {
    const scannedEmark = await replaceGS(emark)
    let flag = 0
    if(scannedEmark){
      checkedEmarkQRs && checkedEmarkQRs?.forEach((item) => {
        if(item === scannedEmark) {
          flag+=1
          setEmarksForReverse([
            scannedEmark,
            ...emarksForReverse
          ])
        }
      })
      if(flag) {
        setCheckedEmarkQRs(checkedEmarkQRs.filter((item) => item !== scannedEmark))
        setMessage({
          type:"success",
          message: t("settings.removed")
       })
      } else {
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
  };


  const cleanInput = () => {
    dispatch(setSearchBarCodeSlice({
      name:"reverse",
      value: ""
    }))
  };

  useEffect(() => {
    registerEmarksForReverse(emarkInput)
  }, [emarkInput]);

  return (
    <Dialog open={open} onClose={close} > 
      { checkedEmarkQRs?.length ?
        <DialogTitle>{t("emark.scanForReverse")}</DialogTitle>:
        <DialogTitle>{t("emark.cantFindEmark")}</DialogTitle>
      }
        <DialogContent sx={{ paddingBottom: 0}}>
        {checkedEmarkQRs?.length ? <>
          <div style={{ display:"flex",justifyContent:"center", margin:"10px",alignItems:"center"}}>
            <QrCode2Icon fontSize="large" sx={{p:0}}/>
            <SearchBarcode
              searchValue={emarkQr}
              setSearchValue={setEmarkQr}
              byBarCodeSearching={fillEmarkQrs}
              setFrom={setFrom}
              from={from}
              stringFrom="reverse"
              dataGroup={""}
            />
            <div style={{margin:"10px"}}>{t("mainnavigation.available")} {checkedEmarkQRs?.length} {t("units.pcs")}</div>
          </div>
          <div style={{height:"50px"}}>
            {message?.message ? 
              <span style={{color:message?.type==="error"?"red":"green"}}>
                {message?.message}
              </span>: ""
            }
          </div>
        </>:""}
        <DialogActions>
          {checkedEmarkQRs?.length ? 
            <Button onClick={chooseFuncForSubmit} variant="contained" sx={{background:"#F69221"}}>
              {t("buttons.noEmark")}
            </Button>: ""
          }
          <Button onClick={submitSendEmark} variant="contained" sx={{background:"#3FB68A"}}>
            {t("buttons.submit")}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
};

export default memo(EmarkInput);
