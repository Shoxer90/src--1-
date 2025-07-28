import { Box, Button, Card, debounce, Dialog, Divider, InputBase, TextField } from "@mui/material"
import { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchBarCodeSlice } from "../../../store/searchbarcode/barcodeSlice";
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from "react-i18next";
import { getInputChangeFunction } from "../../emarkScanner/ScannerManager";
import useDebonce from "../../../Container2/hooks/useDebonce";
import { replaceGS } from "../../../services/baseUrl";
import SearchBarcode from "../../../SearchBarcode";


const PrepaymentEmarkDialog = ({open, close, setFrom, setGlobalStorageList}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [openInput, setOpenInput] = useState(false);
  const scannedEmark = useSelector(state => state.barcode.endPrepayment);
  const [message, setMessage] = useState({});
  const [loading, setLoading] = useState(false);
  const emarkList = JSON.parse(localStorage.getItem("emarkList")) || [];
  const emarksNewList = JSON.parse(localStorage.getItem("emarkNewList")) || [];
  const basket = JSON.parse(localStorage.getItem("bascket1"));
  const inputDebounce = useDebonce(scannedEmark,500);
  const needEmark = JSON.parse(localStorage.getItem("needEmark"))
  const inputRef = useRef(null);

  const addEmarks = () => {
    setLoading(true)
    const emarkGS = replaceGS(inputDebounce)
    if (emarkList?.includes(emarkGS)){
      setLoading(false)
      dispatch(setSearchBarCodeSlice({
        name: "endPrepayment",
        value: ""
      }))
      return setMessage({type:"error", message:t("emark.qrInBasket")})
    }else if(inputDebounce?.substring(0, 2) === "01" && inputDebounce?.substring(16, 18) === "21") {
      const currentBarcode = inputDebounce?.slice(3,16)
      let flag = 0;
      let flag2 = 0;
      basket?.map((item) => {
        if(item?.isEmark && item?.barCode === currentBarcode) {
            flag += 1;
            localStorage.setItem("emarkList",JSON.stringify([emarkGS, ...emarkList]))
            let changedList = [] 
            changedList = emarksNewList?.map((item) => {
              if(item?.barcode === currentBarcode) {
                flag2+=1
                return {
                  ...item,
                  emarks: [emarkGS, ...item?.emarks]
                }
              }else{
                return item
              }
            })
            if(!flag2) {
              changedList = [
                {
                  barcode: currentBarcode,
                  emarks:[emarkGS],
                  scanRequired: true
                },
                ...emarksNewList
              ]
            }
            setLoading(false)
            localStorage.setItem("needEmark", JSON.stringify(needEmark-1))
            inputRef?.current?.focus();
            dispatch(setSearchBarCodeSlice({
              name: "endPrepayment",
              value: ""
            }))
            if(!needEmark) {
              setMessage({type:"info",message:t("emark.canOverSale")})
            }else{
              setMessage({type:"info",message:t("emark.done")})
            } 
           return localStorage.setItem("emarkNewList", JSON.stringify(changedList))
          }
      })
      if(!flag) {
        setLoading(false)
        return setMessage({type:"error",message:t("mainnavigation.searchEmarkconcl")})
      }
    } else {
      setLoading(false)
      return setMessage({type:1, message:t("emark.wrongFormat")})
    }
  };

  useEffect(() => {
    setFrom("endPrepayment")
  }, []);
  
  useEffect(() => {
    inputDebounce && addEmarks()
  }, [inputDebounce]);
  
  useEffect(() => {
    const ff = JSON.parse(localStorage.getItem("emarkNewList"))
    setGlobalStorageList(ff)
    !needEmark && close() 
  }, [needEmark]);

  useEffect(() => {
      inputRef?.current?.focus();
  }, [scannedEmark,openInput,inputDebounce]);

  return (
    <Dialog open={open} fullWidth>
      <Card 
        style={{
          display:"flex",
          justifyContent:"center",
          flexFlow:"column"
        }}
      >
        <Box style={{display:"flex", justifyContent:"space-between", alignItems: "center", gap:"20px" }}>
            <h6></h6>
          <Button onClick={close} style={{textTransform: "capitalize"}}><CloseIcon /></Button>
        </Box>
        <Divider color="black" />
          {needEmark ? <div style={{alignSelf:"center", padding:"10px",fontWeight:600, display:"flex", flexFlow:"column"}}>
            <div>
              <div style={{padding:"10px 25px"}}>{t("basket.endPrepaymentEmark")} ({`${needEmark} ${t("units.pcs")}`})</div>
            </div>
             <Button 
              size="small"
              variant="contained" 
              sx={{background:"orange", color:"white", m:2,}}
              onClick={()=>setOpenInput(!openInput)} 
            >
              {t("emark.scan")}
              
            </Button>
                <div style={{height:"40px", alignSelf:"center"}}>
              { openInput && 
                <div>
                  <TextField
                    inputRef={inputRef}
                    onFocus={()=>getInputChangeFunction("endPrepayment")}
                    autoComplete="off"
                    value={scannedEmark}
                    size="small"
                    onChange={(e)=>{
                      dispatch(setSearchBarCodeSlice({
                        name: "endPrepayment",
                        value: e.target.value
                      }))
                    }}
                    style={{width:"100%"}}
                  />
                </div>
              }
            </div>
          </div> :""}
            {message?.message && <div style={{color:message?.type !== "error" ?"green":"red", alignSelf:"center"}}>{message?.message}</div>}
            <div style={{height:"40px", margin:"30px",display:"flex", justifyContent:"end", gap:"10px"}}>
              {needEmark ? 
                <Button onClick={close} variant="contained">
                  {t("buttons.cancel2")}   
                </Button>
              :""}
                <Button
                  onClick={()=>close()}
                  endIcon={loading && <CircularProgress size="20px" color="inherit" />}
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? t("buttons.send") : t("basket.completeSale")}
                </Button>
            </div>
      </Card>
    </Dialog>
  )
};

export default memo(PrepaymentEmarkDialog);
