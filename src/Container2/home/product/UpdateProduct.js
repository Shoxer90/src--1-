import { useEffect, memo, useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { updateProduct, uniqueBarCode, uniqueInnerCode } from "../../../services/products/productsRequests";
import { Box } from "@mui/system";
import { Checkbox, Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, Tab, Tabs, TextField, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

import CloseIcon from '@mui/icons-material/Close';

import moment from "moment";
import { forwardRef } from "react";
import { getMeasureByNum, getMeasureByStr } from "../../../modules/modules";
import SnackErr from "../../dialogs/SnackErr";

import styles from ".././index.module.scss";
import ConfirmDialog from "../../dialogs/ConfirmDialog";
import ImageLoad from "./ImageLoad";
import Barcode from "react-barcode";
import { useTranslation } from "react-i18next";
import { useSuccessSound } from "../../../modules/PlaySound";
import BarcodeInput from "./BarcodeInput";
import ProductCategorySelect from "./ProductCategorySelect";
import { useDispatch, useSelector } from "react-redux";
import { setSearchBarCodeSlice } from "../../../store/searchbarcode/barcodeSlice";
import useDebouncedUniqueness from "../../hooks/useDebouncedUniqueness";
import MarketXFields, { normalizeMarketXFields, toPhotoList } from "./MarketXFields";

const isShownInMarketX = (item) => {
  const flag = item?.showInMarketX ?? item?.ShowInMarketX;
  return flag === true || flag === "true" || flag === 1 || flag === "1";
};

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UpdateProduct = ({
  openUpdateProd,
  measure,
  setOpenUpdateProduct,
  product, 
  deleteAndRefresh, 
  setNewPrice, 
  setContent,
  content,
  getSelectData,
  typeCode,
  setTypeCode,
  setCurrentPage,
  deleteBasketItem
}) => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const playSuccess = useSuccessSound();
  const dispatch = useDispatch()
  const [isMarketXActive] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("isMarketXActive") || "false") === true;
    } catch {
      return false;
    }
  });
  const [marketXPrompt, setMarketXPrompt] = useState(false);
  const [editTab, setEditTab] = useState("storex");
  const [currentProduct,setCurrentProduct] = useState();
  const [confirmation, setConfirmation] = useState(false);
  const [message, setMessage] =  useState({message:"",type:""});
  const [validPrice, setValidPrice] = useState(true);
  const [isEmptyField,setIsEmptyField] = useState(false);
  const [fixMessage,setFixMessage] = useState();
  const [metric,setMetric] = useState();
  const [flag,setFlag] = useState(0);

    const [isUniqBarCode, setIsUniqBarcode] = useState(true);
    const [isUniqInnerCode, setIsUniqInnerCode] = useState(true);
    const [emptyValidate, setEmptyValidate] = useState(false);
    const barInput = useSelector(state => state?.barcode?.newProd);

  const applyBarCodeUniq = (res) => {
    if (res === false) {
      setIsUniqBarcode(false);
      setMessage({ message: t("dialogs.unicBarCode"), type: "error" });
    } else if (res === true) {
      setIsUniqBarcode(true);
    } else {
      setMessage({ message: t("dialogs.wrong"), type: "error" });
    }
  };

  const applyInnerCodeUniq = (res) => {
    if (res === false) {
      setIsUniqInnerCode(false);
      setMessage({ message: t("dialogs.unicInnerCode"), type: "error" });
    } else if (res === true) {
      setIsUniqInnerCode(true);
    } else {
      setMessage({ message: t("dialogs.wrong"), type: "error" });
    }
  };

  useDebouncedUniqueness(currentProduct?.barCode, uniqueBarCode, {
    skip: (value) => value === String(product?.barCode ?? "").trim(),
    onResult: applyBarCodeUniq,
  });
  useDebouncedUniqueness(currentProduct?.innerCode, uniqueInnerCode, {
    skip: (value) => value === String(product?.innerCode ?? "").trim(),
    onResult: applyInnerCodeUniq,
  });
  

  const updateImage = (e) => {
    let reader = new FileReader();
    const file = e.target.files[0]
    reader.readAsDataURL(file)
    reader.onload = function(){
      setCurrentProduct({
        ...currentProduct,
        photo: reader.result,
      })
    }
  };

  const onlyNumberAndADot = (event,num) => {
    setFixMessage("")
    const valid = num === 2 ? /^\d*\.?(?:\d{1,2})?$/ : /^\d*\.?(?:\d{1,3})?$/ ;
    let text = event.target.value; 
    if(event.target.value === "0" || event.target.value === "."){
      if(`${event.target.value}`.length > currentProduct?.[event.target.name].length){
        text = "0."; 
      }else{
        text= "";
      }
    }
    if(valid.test(text)){
      if(event.target.value && event.target.name === "remainder" && currentProduct?.measure === "հատ" ){
        if(event.target.value === "."){
          return
        }else{
          return setCurrentProduct({
            ...currentProduct,
            [event.target.name]: Math.round(event.target.value.trim())
          })
        }
      }else{
        setCurrentProduct({
          ...currentProduct,
          [event.target.name]: text
        })
      }
    }else{
      return
    };
  };

  const handleChangeInput = async(e) => {
    setIsEmptyField(false)
    setMessage({message:"", type:""})
    setFixMessage("")
    if(e.target.name === "innerCode") {
      setIsUniqInnerCode(true)
    }
    if(e.target.name === "measure") {
      setMetric(e.target.value)
      await getMeasureByNum(e.target.value).then((res) => {
        if(res === "հատ") {
         setCurrentProduct({
              ...currentProduct,
            [e.target.name]: res,
            remainder: Math.round(currentProduct?.remainder)
         })
        }else{
          setCurrentProduct({
            ...currentProduct,
            [e.target.name]: res,
          })
        }
     })
    }else{
      setCurrentProduct({
        ...currentProduct,
        [e.target.name]: e.target.value,
      })
    }
	};
  
  const handleClose = () => {
    setOpenUpdateProduct(!openUpdateProd);
  };

  const handleMarketXClick = () => {
    if (!isMarketXActive) {
      setMarketXPrompt(true);
      return;
    }
    const next = !isShownInMarketX(currentProduct);
    setCurrentProduct({
      ...currentProduct,
      showInMarketX: next,
    });
    setEditTab(next ? "marketx" : "storex");
  };

  const goActivateMarketX = () => {
    setMarketXPrompt(false);
    handleClose();
    navigate("/setting/services");
  };

  const handleDelete = async() => {
    if(currentProduct?.remainderPrePayment) {
      return setMessage({message:t("productinputs.prodInPrepayment"), type:"info"})
    }else{
      playSuccess()
      deleteAndRefresh(currentProduct.id).then(()=> {
        setFlag(!flag)
      })
      handleClose()
    }
  };

  const productEmptyValidation = () => {

    if(currentProduct?.name && currentProduct?.measure && currentProduct?.price ){
      handleUpdate()
    }else{
      setMessage({message:t("authorize.errors.emptyfield"), type:"error"})
      setIsEmptyField(true)
    }
  };

  const changeUpdatedProdInBasket = (id) => {
    const currBasket = JSON.parse(localStorage.getItem("bascket1")) || []
    const newBasketContent = currBasket?.map((prodInBasket) => {
      if(prodInBasket?.id === id) {
        return {
          ...currentProduct,
          count:prodInBasket?.count
        }
      }else{
        return prodInBasket
      }
    })
    localStorage.setItem("bascket1", JSON.stringify(newBasketContent))
  }

  const handleUpdate = async() => {
    const bc = String(currentProduct?.barCode ?? "").trim()
    if (!bc) {
      setIsEmptyField(true)
      setMessage({ message: t("authorize.errors.emptyfield"), type: "error" })
      return
    }
    const originalBc = String(product?.barCode ?? "").trim()
    if (bc !== originalBc) {
      const isUniq = await uniqueBarCode(bc)
      if (isUniq === false) {
        setIsUniqBarcode(false)
        setMessage({ message: t("dialogs.unicBarCode"), type: "error" })
        return
      }
      setIsUniqBarcode(true)
    }

    const inner = String(currentProduct?.innerCode ?? "").trim()
    const originalInner = String(product?.innerCode ?? "").trim()
    if (inner && inner !== originalInner) {
      const isUniqInner = await uniqueInnerCode(inner)
      if (isUniqInner === false) {
        setIsUniqInnerCode(false)
        setMessage({ message: t("dialogs.unicInnerCode"), type: "error" })
        return
      }
      if (isUniqInner !== true) {
        setMessage({ message: t("dialogs.wrong"), type: "error" })
        return
      }
      setIsUniqInnerCode(true)
    }

     const newArr = await content.map((item) => {
      if(item?.id === currentProduct?.id){
           return currentProduct
      }else{
        return item
      }
    });
    setContent(newArr)
    updateProduct(currentProduct).then((res) => {
      if(res === 200) {
        playSuccess()
        setCurrentPage(1)

        // changeUpdatedProdInBasket(currentProduct?.id)
        deleteBasketItem(currentProduct?.id, currentProduct?.isEmark,currentProduct?.barCode)
        setFlag(!flag)
        setMessage({message:t("dialogs.welldone"),type:"success"});
        setTimeout(() => {
          handleClose()  
        },2000)
      }else if(res === 400) {
        setIsEmptyField(true)
        setFixMessage(t("authorize.errors.emptyfield"))
        setMessage({message:t("authorize.errors.emptyfield"), type:"error"})
      }else {
        setMessage({message:t("dialogs.wrong"), type:"error"})
      }
    })
  };

  const priceValidate = async (price, discount, type) => {
    if(price === "") return
    if(`${type}` === "1" || `${type}` === "0") {
      return price - discount / 100 * price < 1 ? (
        setValidPrice(false),
        setFixMessage(t("dialogs.discountlimit"))
      ) : ( 
        setMessage({message:"", type:""}),
        setValidPrice(true)
      )
    }else if(`${type}` === "2") {
      return price - discount < 1 ? (
        setValidPrice(false),
        setFixMessage(t("dialogs.discountlimit"))
      ):(
        setFixMessage(""),
        setValidPrice(true)
      )
    }
  };

  const getMeasure = async() => {
    await getMeasureByStr(product?.measure).then((res)=>{
      setMetric(res)
    })
  };

  const functionInit = async() => {
    if(flag === 0 && currentProduct){
      setTypeCode(currentProduct?.type)
      await getSelectData()
      setFlag(1)
    }else{
      getSelectData()
    }
  };

  const sourcePhotos = toPhotoList(product).join("\n");

  useEffect(() => {
    getMeasure()
    setCurrentProduct({
      ...product,
      showInMarketX: isShownInMarketX(product) || toPhotoList(product).length > 0,
      ...normalizeMarketXFields(product),
    })
    setEditTab("storex")
    priceValidate(product?.price, product?.discount, product?.discountType)
    setNewPrice(product?.price - (product?.price * product?.discount / 100))

  }, [product?.id, product?.discount, product?.price, product?.showInMarketX, product?.ShowInMarketX, sourcePhotos]);

    const barcodeValidation = (event) => {
      const valid = /^[a-zA-Z0-9_]+$/
      const text = event.target.value;  
      if(valid.test(text)){
        dispatch(setSearchBarCodeSlice({
          name: "newProd",
          value: event.target.value
        }))
        setCurrentProduct({
          ...currentProduct,
          barCode: event.target.value
        })
      }else if(event.target.value.trim() === ""){
        setCurrentProduct({
          ...currentProduct,
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
    currentProduct && functionInit()
  }, [typeCode]);

  return (
    <Dialog
      open={!!openUpdateProd}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth={isShownInMarketX(currentProduct) ? "md" : "sm"}
      id="live" aria-live="polite" 
    >
      <Box 
        style={{
          display:"flex", 
          justifyContent:"space-between",
        }}
      >
        <h3 style={{padding:"10px 25px"}}>
          {t("productinputs.updatetitle")} 
        </h3>
        <Button onClick={handleClose} sx={{textTransform: "capitalize"}}>
          <CloseIcon />
        </Button>
      </Box>
      <Divider/>
      { metric && <DialogContent>
        <h6>{t("productinputs.typeurl3")} {currentProduct?.type} </h6>
        {isShownInMarketX(currentProduct) && (
          <Tabs
            value={editTab}
            onChange={(_, value) => setEditTab(value)}
            sx={{
              minHeight: 40,
              mb: 1,
              "& .MuiTab-root": { textTransform: "none", fontWeight: 700, minHeight: 40 },
              "& .Mui-selected": { color: "#3FB68A" },
              "& .MuiTabs-indicator": { backgroundColor: "#3FB68A" },
            }}
          >
            <Tab value="storex" label={t("settings.StoreX")} />
            <Tab value="marketx" label={t("settings.MarketX")} />
          </Tabs>
        )}
        {(!isShownInMarketX(currentProduct) || editTab === "storex") && <>
        <Box className={styles.update}>
        <TextField 
          autoComplete="off"
            error={isEmptyField && !currentProduct?.name}
            size="small"
            name="name" 
            value={currentProduct?.name}
            label={`${t("productinputs.name")} (${50-(currentProduct?.name)?.length})`}
            onChange={(e)=>handleChangeInput(e)} 
            inputProps={{ maxLength: 50 }}
          />
          <TextField 
            autoComplete="off"
            size="small"
            name="brand" 
            value={currentProduct?.brand}
            label={t("productinputs.brand")}
            onChange={(e)=>handleChangeInput(e)} 
          />
          <Box sx={{ gridColumn: "1 / -1", justifySelf: "start", width: "100%" }}>
            <ProductCategorySelect
              value={currentProduct?.categoryIds}
              onChange={(categoryIds) => setCurrentProduct({
                ...currentProduct,
                categoryIds
              })}
            />
          </Box>
          <TextField 
            error={isEmptyField && !currentProduct?.remainder}
            size="small"
            autoComplete="off"
            name="remainder" 
            value={currentProduct?.remainder}
            label={t("productinputs.count")}
            onChange={(e)=>onlyNumberAndADot(e,3)} 
          />
          <FormControl >
            <InputLabel>{t("productinputs.measure")}</InputLabel>
            <Select
              error={isEmptyField && !currentProduct?.measure}
              size="small"
              autoComplete="off"
              name="measure"
              value={metric}
              label={t("productinputs.measure")}
              onChange={(e)=>handleChangeInput(e)}
            >
              {measure && measure.map((item, index) => (
                <MenuItem key={index} value={index+1}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
            <TextField 
              autoComplete="off"
              size="small"
              name="purchasePrice" 
              value={currentProduct?.purchasePrice || ""}
              placeholder="0"
              label={t("productinputs.purchase")}
              onChange={(e)=> onlyNumberAndADot(e,2)} 
            />
              <TextField 
                error={isEmptyField && !currentProduct?.price}
                size="small"
                autoComplete="off"
                name="price" 
                InputProps={{
                  inputProps: { 
                    min: 1,
                    step: 0.01
                  }
                }}
                value={currentProduct?.price}
                label={t("productinputs.price")}
                onChange={(e)=>{
                  onlyNumberAndADot(e,2)
                  priceValidate(e.target.value, currentProduct?.discount, currentProduct?.discountType ,e)
                }}
              />
              <Box className={styles.inputGroup}>
                <TextField 
                  error={isEmptyField && currentProduct?.discount === ""}
                  size="small"
                  autoComplete="off"
                  sx={{
                    "& fieldset": { border: 'none' },
                    width: "60%",
                  }}
                  name="discount" 
                  value={currentProduct?.discount || ""}
                  label={<div style={{backgroundColor:"white",paddingRight:"2px"}}>{t("productinputs.discount")} {"%"}</div>}
                    onChange={(e)=>{
                      if(+e.target.value > 99){
                        return
                      }
                      onlyNumberAndADot(e,2)
                      priceValidate(currentProduct?.price, e.target.value, currentProduct?.discountType ,e)
                    }}
                />
                <span style={{alignSelf:"center",margin:"3px",fontSize:"80%",flexFlow:"nowrap",display:"flex", width:"60px"}}>
                  {currentProduct?.discount ? `${(currentProduct?.discount/100*currentProduct?.price).toFixed(2)} ${t("units.amd")}`: ""}
                </span> 
              </Box>
              {/* { currentProduct?.barCode && 
                <Barcode value={currentProduct?.barCode} height={30} width={1} margin={1} fontSize={12} textAlign={"center"} />
              } */}

    
                <TextField
                  error={!isUniqInnerCode}
                  size="small"
                  variant="outlined"
                  name="innerCode"
                  value={currentProduct?.innerCode || ""}
                  label={t("productinputs.code2")}
                  onChange={(e)=>handleChangeInput(e)}
                  autoComplete="off"
                />
                <TextField 
                  error={(emptyValidate && !currentProduct?.barCode) || !isUniqBarCode}
                  style={{marginBottom:"10px",width:"250px"}}
                  size="small"
                  variant="outlined"
                  name="barCode" 
                  value={currentProduct?.barCode}
                  label={`${t("productinputs.barcode")} (max 20 ${t("productinputs.symb")})*`}
                  onChange={(e)=>{
                    if(e.target.value?.length>20) return
                    setIsUniqBarcode(true)
                    barcodeValidation(e)
                  }} 
                />
        </Box>
          <div style={{height:"60px",color:"red",fontSize:"80%", width:"100%"}}>
           {fixMessage && fixMessage}
          </div>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 2 }}>
              <FormControlLabel 
                style={{alignSelf:"center", margin: 0}}
                name="isEmark"
                control={<Checkbox />} 
                label={t("productinputs.isEmark")}
                checked={!!currentProduct?.isEmark}
                onChange={(e)=> setCurrentProduct({
                  ...currentProduct,
                  [e.target.name]: e.target.checked
                })}
              />
              <Tooltip
                title={isMarketXActive ? t("productinputs.marketXHover") : ""}
                placement="top"
                arrow
                disableHoverListener={!isMarketXActive}
              >
                <FormControlLabel
                  style={{ margin: 0 }}
                  control={
                    <Switch
                      checked={isShownInMarketX(currentProduct)}
                      onChange={handleMarketXClick}
                    />
                  }
                  label={t("settings.MarketX")}
                  labelPlacement="start"
                />
              </Tooltip>
            </Box>
          <Box>
            {currentProduct?.dep === 2 && 
              <FormControlLabel 
                style={{alignSelf:"start"}}
                name="dep"
                control={<Checkbox />} 
                label={t("productinputs.ndsNone")}
                checked={currentProduct?.dep === 2}
              />
            }
          </Box>
          <Box>
            <div style={{margin:"0px"}}>
              {t("productinputs.updatedate")} 
              {moment(currentProduct?.lastUpdate).format('DD.MM.YYYY')}{"  "} 
              {moment(currentProduct?.lastUpdate).format('HH:mm:ss')}
            </div>

            <ImageLoad 
            setCurrentProduct={setCurrentProduct}
            currentProduct={currentProduct}
            func={updateImage} 
            content={currentProduct?.photo} 
            />
          </Box>
        </>}
        {isShownInMarketX(currentProduct) && editTab === "marketx" && (
          <>
            <p style={{ margin: "4px 0 8px", color: "#3FB68A", fontSize: 14, lineHeight: 1.45, maxWidth: 420 }}>
              {t("productinputs.marketXAvailable")}
            </p>
            <MarketXFields
              value={currentProduct}
              onChange={setCurrentProduct}
              onWarn={(text) => setMessage({ message: text, type: "error" })}
            />
          </>
        )}
        <Box className={styles.update_btns}>
          <Button 
            variant="contained" 
            style={{backgroundColor:"red",textTransform: "capitalize"}}
            onClick={()=>setConfirmation(true)}
          >
            {t("productinputs.delete_btn")}
          </Button>
          <Button 
            disabled={!validPrice || !currentProduct?.barCode}
            variant="contained" 
            style={{
              backgroundColor:(
                !validPrice || !currentProduct?.barCode ? "grey": "green"
              ),
              textTransform: "capitalize"
            }} 
            onClick={productEmptyValidation}
          >
            {t("buttons.save")}
          </Button>
        </Box>
        {message?.message &&
          <Dialog open={!!message.message}>
            <SnackErr
              message={message?.message}
              type={message?.type}
              close={()=>{
                setMessage({message:"", type:""})
                setConfirmation(false)
              }}
            />
          </Dialog>
        }
      </DialogContent>}
      <Dialog open={marketXPrompt} onClose={() => setMarketXPrompt(false)}>
        <DialogContent sx={{ maxWidth: 440, textAlign: "center", px: 3, py: 3 }}>
          <img src="/mx.png" alt="MarketX" style={{ width: 72, height: 72, objectFit: "contain" }} />
          <h3 style={{ margin: "12px 0 8px", color: "#1f2937" }}>
            {t("productinputs.marketXImportTitle")}
          </h3>
          <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6, fontSize: 15 }}>
            {t("productinputs.marketXImportText")}
          </p>
          <Box sx={{ display: "flex", gap: 1.5, mt: 3, justifyContent: "center" }}>
            <Button
              variant="outlined"
              onClick={() => setMarketXPrompt(false)}
              sx={{ textTransform: "capitalize", minWidth: 120 }}
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              variant="contained"
              onClick={goActivateMarketX}
              sx={{ textTransform: "capitalize", minWidth: 120, background: "#3FB68A" }}
            >
              {t("settings.activate")}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      {confirmation &&
        <ConfirmDialog
          open={confirmation}
          title={t("settings.remove")}
          func={handleDelete}
          question={t("settings.remove_prod")}
          content={currentProduct?.name}
          close={setConfirmation}
          t={t}
        />
      }
    </Dialog>
  );
};

export default memo(UpdateProduct);
