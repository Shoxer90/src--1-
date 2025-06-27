import { Box, Button, Card, Dialog, Divider, TextField } from "@mui/material"
import { memo, useEffect, useState } from "react"
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
  handleChangeBasketCount
}) => {
  const dispatch = useDispatch();
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
  handleChangeBasketCount
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [emark, setEmark] = useState("");
  const [message, setMessage] = useState({});
  const scannedEmark = useSelector(state => state.barcode.emarkConfig)
  const debounceBasket = useDebonce(scannedEmark, 1000);
  const [openInput, setOpenInput] = useState(false);
  const scannedEmark = useSelector(state => state.barcode.emarkConfig)
  const debounceBasket = useDebonce(scannedEmark, 1000);
  const [openInput, setOpenInput] = useState(false);
  const {t} = useTranslation();
  const fromStorage = JSON.parse(localStorage.getItem("emarkList")) || []
  const emarksNewList = JSON.parse(localStorage.getItem("emarkNewList")) || [];
  const scannedEmark2 = useSelector(state => state.barcode)
  const fromStorage = JSON.parse(localStorage.getItem("emarkList")) || []
  const emarksNewList = JSON.parse(localStorage.getItem("emarkNewList")) || [];
  const scannedEmark2 = useSelector(state => state.barcode)

  const addEmarkList = async(input) => {
    console.log(input,"input in func")
    const newData = replaceGS(input)

  const addEmarkList = async(input) => {
    console.log(input,"input in func")
    const newData = replaceGS(input)

    setMessage({type:1, message:""})
    setLoading(true)
    if(operation==="decr") {
      console.log("mtV ")
      minusQr(newData)
    }
    setLoading(false)
  };

  const firstButtonClick = () => {
    if(operation === "decr") {
      setOpenInput(!openInput)
    }else {
      setOpenBasket(true)
      close()
    }
  };
  const minusQr = async(input) => {
    if(input?.substring(0, 2) === "01" && input?.substring(16, 18) === "21") {
      const currentBarcode = input?.slice(3,16)
      const filtered = fromStorage && fromStorage.filter((item) => item !== input);
      let flag = 0;
      const emarksNewListCleaned = emarksNewList?.map((item, index) => {
        console.log(item,"item")
        if(item?.emarks.includes(input) && item?.barcode === bCode) {
          flag+=1
          let newEmarks = item?.emarks?.filter((emark) => emark !==input)
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
        return setMessage({t:1,message:`Տվյալ դրոշմը չի պատկանում ապրանքին ${name}`})
      }
        console.log(filtered?.length ,fromStorage?.length)

        if (filtered?.length < fromStorage?.length) {
        localStorage.setItem("emarkNewList", JSON.stringify(emarksNewListCleaned))
        localStorage.setItem("emarkList", JSON.stringify(filtered))
         dispatch(setSearchBarCodeSlice({
          name: "emarkConfig",
          value: ""
        }))
        // setEmark("")
        return setMessage({type:1, message:t("settings.removed")})
      }else{
        setMessage({
          type: 0,
          message: t("mainnavigation.searchEmarkconcl")
        })
      }
    if(operation==="decr") {
      console.log("mtV ")
      minusQr(newData)
    }
    setLoading(false)
  };

  const firstButtonClick = () => {
    if(operation === "decr") {
      setOpenInput(!openInput)
    }else {
      setOpenBasket(true)
      close()
    }
  };
  const minusQr = async(input) => {
    if(input?.substring(0, 2) === "01" && input?.substring(16, 18) === "21") {
      const currentBarcode = input?.slice(3,16)
      const filtered = fromStorage && fromStorage.filter((item) => item !== input);
      let flag = 0;
      const emarksNewListCleaned = emarksNewList?.map((item, index) => {
        console.log(item,"item")
        if(item?.emarks.includes(input) && item?.barcode === bCode) {
          flag+=1
          let newEmarks = item?.emarks?.filter((emark) => emark !==input)
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
        return setMessage({t:1,message:`Տվյալ դրոշմը չի պատկանում ապրանքին ${name}`})
      }
        console.log(filtered?.length ,fromStorage?.length)

        if (filtered?.length < fromStorage?.length) {
        localStorage.setItem("emarkNewList", JSON.stringify(emarksNewListCleaned))
        localStorage.setItem("emarkList", JSON.stringify(filtered))
         dispatch(setSearchBarCodeSlice({
          name: "emarkConfig",
          value: ""
        }))
        // setEmark("")
        return setMessage({type:1, message:t("settings.removed")})
      }else{
        setMessage({
          type: 0,
          message: t("mainnavigation.searchEmarkconcl")
        })
      }
      setLoading(false)
    }else{
     return setMessage({type:1, message:"Sxal format"})
    }
    }else{
     return setMessage({type:1, message:"Sxal format"})
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
        emarks:[]
      }]))
      return close()
    }
    localStorage.setItem("emarkNewList", JSON.stringify(newDataLS))
    setChange(!change)
    close()
  }

  const handleCloseDialog = () => {
    if(productCount < count) {
      return
      //  handleChangeBasketCount(count, true)
    }
    close()
  }

  useEffect(() => {
    setMessage({type:null,message:""})
    scannedEmark && debounceBasket && addEmarkList(debounceBasket)
    scannedEmark && debounceBasket && addEmarkList(debounceBasket)
  }, [debounceBasket]);

  useEffect(() => {
    setOpenInput(false)
    setOpenInput(false)
    setEmark("")
    setChange(!change)
  }, [open]);

   useEffect(() => {
    if(!count && operation ==="decr") {
      setOpenInput(false)
    }
   },[count])

   useEffect(() => {
    getInputChangeFunction("emarkConfig")
    if(count > productCount) {
      return setOperation("decr")
    }
   }, []);
    setChange(!change)
  }, [open]);

   useEffect(() => {
    if(!count && operation ==="decr") {
      setOpenInput(false)
    }
   },[count])

   useEffect(() => {
    getInputChangeFunction("emarkConfig")
    if(count > productCount) {
      return setOperation("decr")
    }
   }, []);

  return(
    <Dialog open={open} fullWidth>
    <Dialog open={open} fullWidth>
      <Card 
        style={{
          display:"flex",
          justifyContent:"center",
          flexFlow:"column"
        }}
      >
        <Box 
          style={{display:"flex", justifyContent:"space-between", alignItems: "center", gap:"20px" }}>
          <h6 style={{padding:"10px 25px"}}>{`${name}-ը խանութում գրանցված է որպես Է-մարկ դրոշմավորված։`}</h6>
          <Button onClick={handleCloseDialog} style={{textTransform: "capitalize"}}><CloseIcon /></Button>
          style={{display:"flex", justifyContent:"space-between", alignItems: "center", gap:"20px" }}>
          <h6 style={{padding:"10px 25px"}}>{`${name}-ը խանութում գրանցված է որպես Է-մարկ դրոշմավորված։`}</h6>
          <Button onClick={handleCloseDialog} style={{textTransform: "capitalize"}}><CloseIcon /></Button>
        </Box>
        <Divider color="black" />
          <div style={{alignSelf:"center", padding:"10px",fontWeight:600, display:"flex", flexFlow:"column"}}>
            <div>
              {count ? `Դուք սկանավորել եք տվյալ ապրանքի ${count} Է-մարկ դրոշմանիշ:`: ""}
            </div>
            <div>
               {count>productCount ? `Սակայն զամբյուղում առկա է ընդամենը ${productCount} հատ ${name} ` :""}
            </div>
             {operation === "incr" ? <Button 
              size="small"
              variant="contained" 
              sx={{background:"orange", color:"white", m:2}}
              onClick={firstButtonClick} 
            >
              Ավելացնել ապրանքի քանակը դրոշմանիշի սկանավորմամբ
            </Button>: ""}

             {(operation === "decr" && count) ? <Button 
              size="small"
              variant="contained" 
              sx={{background:"orange", color:"white", m:2}}
              onClick={firstButtonClick} 
            >
               { count<productCount ?`Պակասեցնել ապրանքի քանակը դրոշմանիշի սկանավորմամբ`:"Սկանավորել դուրս եկած ապրանքների դրոշմանիշները"}
            </Button>:""}
                <div style={{height:"40px", alignSelf:"center"}}>
              { openInput && 
                <div>
                  <TextField
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
            { operation === "decr" && productCount < count ?
              <Button 
                size="small"
                variant="contained" 
                sx={{background:"orange", color:"white", m:2}}
                onClick={completeFunc} 
              >
                Դարձնել {count} հատ
              </Button>:""
            }
            

            { (!openInput &&  operation === "incr") ?
              <Button size="small" onClick={changeScanRequired} variant="contained" sx={{background:"#3FB68A", color:"white", m:2,}}>
                { `Ավելացնել քանակը առանց սկանավորման`}      
              </Button>: ""
            }
            { (!openInput &&  operation === "decr") && count<productCount  && count ?
              <Button size="small" onClick={()=>changeScanRequired} variant="contained" sx={{background:"#3FB68A", color:"white", m:2,}}>
                { `Պակասեցնել քանակը առանց սկանավորման`}      
              </Button>:""
            }
          </div>
          <div style={{alignSelf:"center", padding:"10px",fontWeight:600, display:"flex", flexFlow:"column"}}>
            <div>
              {count ? `Դուք սկանավորել եք տվյալ ապրանքի ${count} Է-մարկ դրոշմանիշ:`: ""}
            </div>
            <div>
               {count>productCount ? `Սակայն զամբյուղում առկա է ընդամենը ${productCount} հատ ${name} ` :""}
            </div>
             {operation === "incr" ? <Button 
              size="small"
              variant="contained" 
              sx={{background:"orange", color:"white", m:2}}
              onClick={firstButtonClick} 
            >
              Ավելացնել ապրանքի քանակը դրոշմանիշի սկանավորմամբ
            </Button>: ""}

             {(operation === "decr" && count) ? <Button 
              size="small"
              variant="contained" 
              sx={{background:"orange", color:"white", m:2}}
              onClick={firstButtonClick} 
            >
               { count<productCount ?`Պակասեցնել ապրանքի քանակը դրոշմանիշի սկանավորմամբ`:"Սկանավորել դուրս եկած ապրանքների դրոշմանիշները"}
            </Button>:""}
                <div style={{height:"40px", alignSelf:"center"}}>
              { openInput && 
                <div>
                  <TextField
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
            { operation === "decr" && productCount < count ?
              <Button 
                size="small"
                variant="contained" 
                sx={{background:"orange", color:"white", m:2}}
                onClick={completeFunc} 
              >
                Դարձնել {count} հատ
              </Button>:""
            }
            

            { (!openInput &&  operation === "incr") ?
              <Button size="small" onClick={changeScanRequired} variant="contained" sx={{background:"#3FB68A", color:"white", m:2,}}>
                { `Ավելացնել քանակը առանց սկանավորման`}      
              </Button>: ""
            }
            { (!openInput &&  operation === "decr") && count<productCount  && count ?
              <Button size="small" onClick={()=>changeScanRequired} variant="contained" sx={{background:"#3FB68A", color:"white", m:2,}}>
                { `Պակասեցնել քանակը առանց սկանավորման`}      
              </Button>:""
            }
          </div>
          {message?.message && <div style={{color:message?.type?"green":"red", alignSelf:"center"}}>{message?.message}</div>}

        
            <div style={{height:"40px", margin:"30px",display:"flex", justifyContent:"end"}}>
              {/* {openInput &&  */}
                <Button
                  onClick={completeFunc}
                  endIcon={loading && <CircularProgress size="20px" color="inherit" />}
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? "Send" : "Complete"}
                </Button>
              {/* } */}
            </div>
        
            <div style={{height:"40px", margin:"30px",display:"flex", justifyContent:"end"}}>
              {/* {openInput &&  */}
                <Button
                  onClick={completeFunc}
                  endIcon={loading && <CircularProgress size="20px" color="inherit" />}
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? "Send" : "Complete"}
                </Button>
              {/* } */}
            </div>
      </Card>
    </Dialog>
  )
};

export default memo(EmarkInputForDeleteItem);
