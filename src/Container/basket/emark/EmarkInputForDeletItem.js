import { Box, Button, Card, Dialog, Divider, TextField } from "@mui/material"
import { memo, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next";
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import useDebonce from "../../../Container2/hooks/useDebonce";
import { useDispatch, useSelector } from "react-redux";
import { getInputChangeFunction } from "../../emarkScanner/ScannerManager";
import { setSearchBarCodeSlice } from "../../../store/searchbarcode/barcodeSlice";
import { replaceGS } from "../../../services/baseUrl";

const EmarkInputForDeleteItem = ({
  open,
  close,
  count,
  operation,
  setOperation,
  bCode,
  setChange,
  change,
  setOpenBasket,
  name,
  checkPriceChangeV2,
  productCount,
  isLessThanQr,
  completeFunc,
  setFrom,
  setToBasket,
  product,
  quantity
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [emark, setEmark] = useState("");
  const [message, setMessage] = useState({});
  const scannedEmark = useSelector(state => state.barcode.emarkConfig)
  const debounceBasket = useDebonce(scannedEmark, 1000);
  const [openInput, setOpenInput] = useState(false);
  const {t} = useTranslation();
  const fromStorage = JSON.parse(localStorage.getItem("emarkList")) || []
  const emarksNewList = JSON.parse(localStorage.getItem("emarkNewList")) || [];
  const scannedEmark2 = useSelector(state => state.barcode);
  const ref = useRef();

  const addEmarkList = async(input) => {
    const newData = await replaceGS(input)

    setMessage({type:1, message:""})
    setLoading(true)
    if(operation==="decr") {
      minusQr(newData)
    }
    setLoading(false)
  };

  const firstButtonClick = () => {
    if(operation === "decr") {
      setOpenInput(!openInput)
    }else {
      setFrom("basket")
      setOpenBasket(true)
      close()
    }
  };
  const closeAfterAllCleaned = () => {
    emarksNewList && emarksNewList.map((item) => {
      if(item?.barcode === bCode && !item?.emarks?.length ) {
        close()
        // completeFunc()
      }
    })
  };

  const minusQr = async(input) => {
    if(input?.substring(0, 2) === "01" && input?.substring(16, 18) === "21") {
      const currentBarcode = input?.slice(3,16)
      const filtered = fromStorage && fromStorage.filter((item) => item !== input);
      let flag = 0;
      const emarksNewListCleaned = emarksNewList?.map((item, index) => {
        if(item?.emarks.includes(input) && item?.barcode === bCode) {
          flag+=1
          let newEmarks = item?.emarks?.filter((emark) => emark !==input )
          !isLessThanQr && checkPriceChangeV2(productCount - 1)
          setChange(!change)
          return {
            ...item,
            emarks: newEmarks
          }
        }else{
          return item
        }
      })

      if(!flag && currentBarcode !== bCode) {
        return setMessage({t:1,message:`${t("emark.notForThisProd")} ${name}`})
      }
      if (filtered?.length < fromStorage?.length) {
        localStorage.setItem("emarkNewList", JSON.stringify(emarksNewListCleaned))
        localStorage.setItem("emarkList", JSON.stringify(filtered))
        ref?.current?.focus();
        dispatch(setSearchBarCodeSlice({
          name: "emarkConfig",
          value: ""
        }))
        return setMessage({type:1, message:t("settings.removed")})
      }else{
        dispatch(setSearchBarCodeSlice({
          name: "emarkConfig",
          value: ""
        }))
        setMessage({
          type: 0,
          message: t("mainnavigation.searchEmarkconcl")
        })
      }
      setLoading(false)
    }else {
     return setMessage({type:1, message:t("emark.wrongFormat")})
    }
  };

  const changeScanRequired = () => {

    let dataLS = JSON.parse(localStorage.getItem("emarkNewList")) || [];
    let flag = 0
    let newDataLS = dataLS?.map((item) => {
      if(item?.barcode === bCode) {
        flag+=1
        return {
          ...item,
          scanRequired: false
        }
      }else {
        return item
      }
    })
    if(!flag) {
      localStorage.setItem("emarkNewList", JSON.stringify([...newDataLS, {
        barcode: bCode,
        scanRequired: false,
        emarks: []
      }]))
      setToBasket(product, quantity, false)

      return close()
    }
    
    localStorage.setItem("emarkNewList", JSON.stringify(newDataLS))
    setChange(!change)
    close()
  }

  useEffect(() => {
    setMessage({type:null,message:""})
    debounceBasket && addEmarkList(debounceBasket)
  }, [debounceBasket]);

  useEffect(() => {
    setOpenInput(false)
    setEmark("")
    setChange(!change)
  }, [open]);

  useEffect(() => {
    if(!count && operation ==="decr") {
      setOpenInput(false)
    }
    closeAfterAllCleaned()
  },[count]);

  useEffect(() => {
    getInputChangeFunction("emarkConfig")
    if(count > productCount) {
      return setOperation("decr")
    }
  }, []);

  useEffect(() => {
    setMessage({type:1, message:""})
    dispatch(setSearchBarCodeSlice({
      name: "emarkConfig",
      value: ""
    }))

  }, [open,close,completeFunc]);

  useEffect(() => {
    ref?.current?.focus();
  }, [scannedEmark,openInput,debounceBasket]);

  return(
    <Dialog open={open} fullWidth>
      <Card 
        style={{
          display:"flex",
          justifyContent:"center",
          flexFlow:"column"
        }}
      >
        <Box style={{display:"flex", justifyContent:"space-between", alignItems: "center", gap:"20px" }}>
          <h6 style={{padding:"10px 25px"}}>{`${name} ${t("emark.emarkMarked")}`}</h6>
          <Button onClick={close} style={{textTransform: "capitalize"}}><CloseIcon /></Button>
          {/* <Button onClick={completeFunc} style={{textTransform: "capitalize"}}><CloseIcon /></Button> */}
        </Box>
        <Divider color="black" />
          <div style={{alignSelf:"center", padding:"10px",fontWeight:600, display:"flex", flexFlow:"column"}}>
            <div> {count ? `${t("emark.emark1")} ${count} ${t("emark.emark2")}`: ""}</div>
            <div> {count>productCount ? `${t("emark.butHave")} ${productCount} ${t("units.pcs")} ${name} ` :""}</div>
             {operation === "incr" ? <Button 
              size="small"
              variant="contained" 
              sx={{background:"orange", color:"white", m:2}}
              onClick={firstButtonClick} 
            >
              {t("emark.plusEmark")}
            </Button>: ""}

             {(operation === "decr" && count) ? <Button 
              size="small"
              variant="contained" 
              sx={{background:"orange", color:"white", m:2}}
              onClick={firstButtonClick} 
            >
               { count<productCount ?t("emark.minusEmark1"): t("emark.minusEmark2")}
            </Button>:""}
                <div style={{height:"40px", alignSelf:"center"}}>
              { openInput && 
                <div>
                  <TextField
                    ref={ref}
                    onFocus={()=>getInputChangeFunction("emarkConfig")}
                    focused={true}
                    autoComplete="off"
                    size="small"
                    type="text"
                    value={scannedEmark}
                    onChange={(e)=>{
                      dispatch(setSearchBarCodeSlice({
                        name: "emarkConfig",
                        value: e.target.value
                      }))
                    }}
                    style={{width:"100%"}}
                  />
                </div>
                
              }
            </div>
            {/* { operation === "decr" && productCount < count ?
              <Button 
                size="small"
                variant="contained" 
                sx={{background:"orange", color:"white", m:2}}
                onClick={completeFunc} 
              >
                {t("emark.makeCount")} {count} {t("units.pcs")}
              </Button>:""
            } */}
            

            { (!openInput &&  operation === "incr") ?
              <Button size="small" onClick={changeScanRequired} variant="contained" sx={{background:"#3FB68A", color:"white", m:2,}}>
                {t("emark.withoutScan")}      
              </Button>: ""
            }
            { (!openInput &&  operation === "decr") && count && productCount === count ?
              <Button size="small" onClick={changeScanRequired} variant="contained" sx={{background:"#3FB68A", color:"white", m:2,}}>
                { t("emark.minusWithoutScan")}      
              </Button>:""
            }
          </div>
          {message?.message && <div style={{color:message?.type?"green":"red", alignSelf:"center"}}>{message?.message}</div>}

        
          <div style={{height:"40px", margin:"30px",display:"flex", justifyContent:"end"}}>
            <Button
              onClick={close}
              // onClick={completeFunc}
              endIcon={loading && <CircularProgress size="20px" color="inherit" />}
              variant="contained"
              disabled={loading}
            >
            {t("buttons.close")}
          </Button>
        </div>
      </Card>
    </Dialog>
  )
};

export default memo(EmarkInputForDeleteItem);
