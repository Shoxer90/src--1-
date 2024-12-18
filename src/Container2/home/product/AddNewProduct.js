import React from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { memo } from "react";
import { useState } from "react";
import { createProduct, uniqueBarCode } from "../../../services/products/productsRequests";
import { useEffect } from "react";
import { Box } from "@mui/system";
import { Checkbox, DialogContent, Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Slide, TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SnackErr from "../../dialogs/SnackErr"
import { getMeasureByNum } from "../../../modules/modules";
import styles from "../index.module.scss";
import ImageLoad from "./ImageLoad";
import ProductAdg from "./ProductAdg";
import ProductAdg2 from "./ProductAdg2";
import BarcodeInput from "./BarcodeInput";
import ConfirmDialog from "../../dialogs/ConfirmDialog";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddNewProduct = ({
  setOpenNewProduct,
  changeStatus,
  openNewProd,
  newProduct,
  setProduct,
  measure,
  t,
  typeCode,
  setTypeCode,
  getSelectData,
  selectContent,
  setFetching,
  content,
  setContent,
  setGlobalMessage,
  setGlobalType
}) => {

  const [type, setType] = useState("success");
  const [regime, setRegime] = useState();
	const [message, setMessage] = useState("");
  const [measureStr, setMeasure] = useState("");
  const [openForSave, setOpenForSave] = useState(false);
  const [emptyValidate, setEmptyValidate] = useState(false);
  const [isUniqBarCode, setIsUniqBarcode] = useState(true);
  
  const onlyNumberAndADot = (event,num) => {
    const valid = num === 2 ? /^\d*\.?(?:\d{1,2})?$/ : /^\d*\.?(?:\d{1,3})?$/ ;
    let text = event.target.value; 
    if(event.target.value === "0"){
      if(`${event.target.value}`.length > newProduct?.[event.target.name].length){
        text = "0."; 
      }else{
        text= "";
      }
    }
    if(valid.test(text)){
      if(event.target.value && event.target.name === "remainder" && newProduct?.measure === "հատ" ){
        setProduct({
          ...newProduct,
          [event.target.name]: Math.round(event.target.value.trim())
        })
      }else{
        setProduct({
          ...newProduct,
          [event.target.name]: text.trim()
        })
      }
    }else{
      return 
    }
  };

  const newProductEmptyValidation = () => {
    if(newProduct?.type && newProduct?.name && newProduct?.measure && newProduct?.price && newProduct?.barCode){
      create()
    }else{
      setType("error")
      setMessage(t("authorize.errors.emptyfield"))
      setEmptyValidate(true)
    }
  };

  const create = async() => {
    if(!newProduct?.barCode ||
      !newProduct?.name ||
      !newProduct?.price ||
      !newProduct?.type ||
      !newProduct?.measure
    ) {
      setEmptyValidate(true)
      setType("error")
      setMessage(t("authorize.errors.emptyfield"))
      return
    }else if(newProduct?.price < 1){
      setType("error")
      setMessage(t("dialogs.pricezero")) 
      return
    }
    setFetching(true)
    await uniqueBarCode(newProduct?.barCode).then((res) => {
      if(res){
        setIsUniqBarcode(true)
        createProduct(newProduct).then((res)=> {
          setEmptyValidate(true)
          if(res === 400){
            setType("error")
            setMessage(t("authorize.errors.emptyfield"))
          }else if(res === 500) {
            setType("error")
            setMessage(t("dialogs.wrong"))
          }else if(newProduct.price < 1){
            setType("error")
            setMessage(t("dialogs.pricezero")) 
            return
          }else{
            setContent([])
           setFetching(true)

            setEmptyValidate(false)
            setMessage(t("productinputs.productadded"))
            setType("success")
            changeStatus("GetAvailableProducts")
            // setContent([
            //   newProduct,
            //   ...content
            // ])
            setTimeout(() => {
              handleClose()
              setType()
            },3000)
          }
        })
      }else if(!res){
        setIsUniqBarcode(false)
        setMessage(t("dialogs.unicBarCode"))
        setType("error")
        return
      }
    })
  };

	const setImage = (e) => {
    let reader = new FileReader();
    const file = e.target.files[0]
    reader.readAsDataURL(file)
    reader.onload = function(){
      setProduct({
        ...newProduct,
        photo: reader.result,
      })
    }
	};
	
  const handleChangeInput = async(e) => {
    setMessage("")
    setType()
    if(e.target.name === "measure") {
      setMeasure(e.target.value)
      await getMeasureByNum(e.target.value).then((res) => {
        if(res === "հատ") {
          setProduct({
            ...newProduct,
            [e.target.name]: res,
            remainder: Math.round(newProduct?.remainder)
          })
        }else{
          setProduct({
            ...newProduct,
            [e.target.name]: res,
          })
        }
      })
    }else{
      setProduct({
        ...newProduct,
        [e.target.name]: e.target.value,
      })
    }
  };

  const handleClose = async() => {
    setTypeCode("")
    setFetching(true)
    setOpenNewProduct(!openNewProd);
  };

  const saveData = async() => {
    await localStorage.setItem("newProduct", JSON.stringify(newProduct))
    setType("success")
    handleClose()
    setGlobalMessage(t("dialogs.done"))
    setGlobalType("success")
    setTimeout(()=>{
      setGlobalType("")
      setGlobalMessage("")
    },3000)
  };
  
  const closeSaver = () => {
    setOpenForSave(false)
    handleClose()
    setProduct({
      purchasePrice: "",
      price: "",
      type: "",
      brand: "",
      name: "",
      discount: "",
      remainder: "",
      barCode: "",
      photo:"",
      measure:"",
      pan: 0,
      dep: 0
    })
    localStorage.removeItem("newProduct")
  };

  const checkStorageSavedData = async() => {
    const savedData = await JSON.parse(localStorage.getItem("newProduct"))
    if(savedData) {
      setProduct(savedData)
      setTypeCode(savedData?.type)
    } 
  }
  useEffect(() => {
    openNewProd && getSelectData()
  }, [typeCode]);

  useEffect(() => {
    checkStorageSavedData()
    setTypeCode(newProduct?.type)
    setRegime(localStorage.getItem("taxRegime"))
  }, []);

  return (
    <Dialog
      open={!!openNewProd}
      TransitionComponent={Transition}
      keepMounted
      width="lg"
      id="live" aria-live="polite" 
    >
      <DialogTitle 
        style={{
          display:"flex", 
          justifyContent:"space-between",
          alignContent:"center", 
          padding:"0px", 
          margin:"10px 20px"
        }}
      >
        <div>{t("productinputs.createtitle")}</div>
        <CloseIcon 
          sx={{":hover":{background:"#d6d3d3",borderRadius:"5px"}}}
          onClick={()=>setOpenForSave(true)}
        /> 
      </DialogTitle>
      <DialogContent
        style={{
          display:"flex",
          justifyContent:"space-between", 
          flexFlow:"column nowrap"
        }}
      >
        <Divider style={{backgroundColor:"gray"}} /> 
        <div className={styles.newProdForm}>
          <ProductAdg2
          // <ProductAdg
            t={t}
            emptyValidate={emptyValidate}
            typeCode={typeCode}
            setTypeCode={setTypeCode}
            newProduct={newProduct}
            handleChangeInput={handleChangeInput}
            selectContent={selectContent}
          />
          <TextField 
            error={emptyValidate && !newProduct?.name}
            size="small"
            variant="outlined"
            style={{width:"90%",margin:"15px"}}
            name="name" 
            value={newProduct?.name}
            label={`${t("productinputs.name")} (${50-(newProduct?.name)?.length || 50} ${t("productinputs.symb")}) *`}
            onChange={(e)=>handleChangeInput(e)} 
            inputProps={{ maxLength: 50 }}
            autoComplete="off"

          /> 
          <TextField 
            size="small"
            variant="outlined"
            style={{width:"90%"}}
            name="brand" 
            value={newProduct?.brand}
            label={`${t("productinputs.brand")}`}
            onChange={(e)=>handleChangeInput(e)} 
            autoComplete="off"

          />
          <div className={styles.duoInput}>
            <TextField 
              error={emptyValidate && !newProduct?.remainder}
              size="small"
              variant="outlined"
              autoComplete="off"

              style={{width:"50%", height:"40px",}}
              InputProps={{
                inputProps: { 
                  min: newProduct?.measure !== "հատ" ? 0.001 : 1,
                  step: newProduct?.measure !== "հատ" ? 0.01 : 1
                }
              }}
              // type="number"
              name="remainder" 
              value={newProduct?.remainder}
              label={t("productinputs.count")}
              onChange={(e)=>onlyNumberAndADot(e,3)} 
            />
            <FormControl sx={{ width: "50%"}}>
              <InputLabel>{t("productinputs.measure")}</InputLabel>
              <Select
                error={emptyValidate && !measureStr}
                size="small"
                name="measure"
                value={measureStr}
                label={`${t("productinputs.measure") }*`}
                onChange={(e)=>handleChangeInput(e)}
              >
                {measure && measure.map((item, index) => (
                  <MenuItem 
                    key={index} 
                    value={index+1}
                  >
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className={styles.duoInput}>
            <TextField 
              size="small"
              variant="outlined"
              // style={{width:"45%", height:"30px"}}
              name="purchasePrice"
              autoComplete="off"
              InputProps={{
                inputProps: { 
                  min: 1,
                  step: 0.1
                }
              }}
              // type="number" 
              value={newProduct?.purchasePrice}
              label={t("productinputs.purchase")}
              onChange={(e)=>onlyNumberAndADot(e,2)}
            />
            {/* <div style={{margin:"auto"}}>
              {(parseInt(newProduct?.price/(newProduct?.purchasePrice/100))-100) || 0} %
            </div> */}
          <TextField
            error={emptyValidate && !newProduct?.price}
            size="small"
            variant="outlined"
            autoComplete="off"
            // style={{width:"40%", height:"40px"}}
            InputProps={{
              inputProps: { 
                min: 1,
                step: 1
              }
            }}
            type="number"
            name="price" 
            value={newProduct?.price}
            label={`${t("productinputs.price")} *`}
            onChange={(e)=>onlyNumberAndADot(e,2)}
          />
          </div>
          <Box style={{display:"flex",width:"90%",justifyContent:"space-between"}}>
            <ImageLoad 
              func={setImage} 
              newProduct={newProduct}
              setProduct={setProduct} 
              content={newProduct?.photo}
             />
            <BarcodeInput
              emptyValidate={emptyValidate}
              newProduct={newProduct}
              handleChangeInput={handleChangeInput}
              isUniqBarCode={isUniqBarCode}
              setIsUniqBarcode={setIsUniqBarcode}
              t={t}
              setProduct={setProduct}
            />
          </Box>
          {(regime !== "3" || regime !== "7")  &&
            <div className={styles.duoInput}>
              <FormControlLabel 
                style={{alignSelf:"start"}}
                name="dep"
                control={<Checkbox />} 
                label={t("productinputs.ndsNone")}
                checked={newProduct?.dep}
                onChange={(e)=> setProduct({
                  ...newProduct,
                  [e.target.name]: e.target.checked? 2 : 0,
                })}
              />
            </div>
          }
        </div>
      </DialogContent>
      <Dialog open={message}>
        <SnackErr  
          type={type} 
          message={message} 
          close={()=>setMessage("")}
        />
      </Dialog>
      <ConfirmDialog
        question={t("dialogs.saveData")}
        func={saveData}
        title={""}
        open={openForSave}
        close={closeSaver}
        content={""}
        t={t}
        nobutton={t("buttons.no")}
      />
      <Button 
        variant="contained" 
        style={{backgroundColor:"#FFA500",margin:"10px auto", width:"60%"}} 
        onClick={newProductEmptyValidation}
      >
        {t("buttons.create")}
      </Button>
     
    </Dialog>
  );
}

export default memo(AddNewProduct);
