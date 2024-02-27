import React, { useEffect, memo, useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { updateProduct } from "../../../services/products/productsRequests";
import { Box } from "@mui/system";
import { Checkbox, Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';

import moment from "moment";
import { forwardRef } from "react";
import { getMeasureByNum, getMeasureByStr } from "../../../modules/modules";
import SnackErr from "../../dialogs/SnackErr";

import styles from ".././index.module.scss";
import ConfirmDialog from "../../dialogs/ConfirmDialog";
import ImageLoad from "./ImageLoad";
import Barcode from "react-barcode";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UpdateProduct = ({
  openUpdateProd,
  measure,
  setOpenUpdateProduct,
  product, 
  deleteAndRefresh, 
  changeStatus, 
  deleteBasketItem, 
  t,
  dataGroup,
  getSelectData,
  typeCode,setTypeCode
}) => {
  const [currentProduct,setCurrentProduct] = useState();
  const [confirmation, setConfirmation] = useState(false);
  const [message, setMessage] =  useState({message:"",type:""});
  const [validPrice, setValidPrice] = useState(true);
  const [isEmptyField,setIsEmptyField] = useState(false);
  const [titleName,setTitleName] = useState("");
  const [fixMessage,setFixMessage] = useState();
  const [metric,setMetric] = useState();
  const [flag,setFlag] = useState(0);

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

  const handleDelete = async() => {
    deleteAndRefresh(currentProduct.id).then(()=> {
      changeStatus(dataGroup)
    })
    handleClose()
  };

  const productEmptyValidation = () => {

    if(currentProduct?.name && currentProduct?.measure && currentProduct?.price ){
      handleUpdate()
    }else{
      setMessage({message:t("authorize.errors.emptyfield"), type:"error"})
      setIsEmptyField(true)
    }
  };

  const handleUpdate = async() => {
    updateProduct(currentProduct).then((res) => {
      if(res === 200) { 
        setMessage({message:t("dialogs.welldone"),type:"success"})
        setTimeout(() => {
          changeStatus("GetAvailableProducts")
          deleteBasketItem(currentProduct?.id)
          handleClose()  
        },2000)
      }else if(res === 400) {
        setIsEmptyField(true)
        setFixMessage(t("authorize.errors.emptyfield"))
      }
    })
  };

  const priceValidate = async (price, discount, type) => {
    if(price === "")return
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
  useEffect(() => {
    getMeasure()
    setCurrentProduct({
      ...product,
    })
    priceValidate(product?.price, product?.discount, product?.discountType)
    setTitleName(` ${product?.brand} ${product?.name} (${product?.type})`)
  }, []);


  useEffect(() => {
    currentProduct && functionInit()
  }, [typeCode]);

  return (
    <Dialog
      open={openUpdateProd}
      TransitionComponent={Transition}
      maxWidth="lg"
      PaperProps={{
        style: {
          position: 'fixed'
        }
      }}
    >
      <DialogTitle 
        style={{
          display:"flex", 
          justifyContent:"space-between",
        }}
      >
        <p>
          {t("productinputs.updatetitle")} 
          {titleName}
        </p>
        <Button onClick={handleClose}>
          <CloseIcon />
        </Button>
      </DialogTitle>
      <Divider style={{backgroundColor:"black",marginBottom:"5px"}}/>
      { metric && <DialogContent>
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
                <MenuItem 
                  key={index} 
                  value={index+1}
                >
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box style={{display:"flex",justifyContent:"space-between"}}>
            <TextField 
              autoComplete="off"
              size="small"
              name="purchasePrice" 
              value={currentProduct?.purchasePrice || ""}
              placeholder="0"
              label={t("productinputs.purchase")}
              onChange={(e)=> onlyNumberAndADot(e,2)} 
            />
            <div style={{margin:"auto",padding:"10px 0px"}}>
             {(parseInt(currentProduct?.price/(currentProduct?.purchasePrice/100))-100) || 0} %
            </div>
          </Box>
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
                width: "40%"
              }}
              name="discount" 
              placeholder="0"
              value={currentProduct?.discount || ""}
              label={<div style={{backgroundColor:"white"}}>{t("productinputs.discount")}</div>}
                onChange={(e)=>{
                  if(+e.target.value > 99){
                    return
                  }
                  onlyNumberAndADot(e,2)
                  priceValidate(currentProduct?.price, e.target.value, currentProduct?.discountType ,e)
                }}
            />
            <span style={{alignSelf:"center"}}><strong>{" %"}</strong></span> 
            <span style={{fontSize:"80%",alignSelf:"center"}}> = {(currentProduct?.discount/100*currentProduct?.price).toFixed(2) }{t("units.amd")}</span> 
            <Divider />
          </Box>
            {currentProduct?.barCode && 
              <Barcode value={currentProduct?.barCode} height={25} width={1.5} margin={0} fontSize={12} alignSelf={"center"} />
            }
          <div></div>
          {message?.message && 
          <Dialog open={message.message}>
            <SnackErr 
            message={message?.message} 
            type={message?.type} 
            close={()=>setMessage({message:"", type:""})} 
            />
          </Dialog>
          }
        </Box>
          <div style={{height:"40px",width:"98%",color:"red",fontSize:"80%"}}>
           {fixMessage && <p>{fixMessage}</p>}
          </div>
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
              {moment(currentProduct?.lastUpdate).format('DD MMM YYYY')}{" / "} 
              {moment(currentProduct?.lastUpdate).format('HH:mm:ss')}
            </div>
            <ImageLoad func={updateImage} content={currentProduct?.photo} />
          </Box>
        <Box className={styles.update_btns}>
          <Button 
            variant="contained" 
            style={{backgroundColor:"red"}} 
            onClick={()=>setConfirmation(true)}
          >
            {t("productinputs.delete_btn")}
          </Button>
          <Button 
            variant="contained" 
            style={{backgroundColor:"#FFA500"}} 
            onClick={handleClose}
            >
            {t("buttons.close")}
          </Button>
          <Button 
            disabled={!validPrice || !currentProduct?.barCode}
            variant="contained" 
            style={{
              backgroundColor:(
                !validPrice || !currentProduct?.barCode ? "grey": "green"
              )
            }} 
            onClick={productEmptyValidation}
          >
            {t("buttons.save")}
          </Button>
        </Box>
      </DialogContent>}
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
}

export default memo(UpdateProduct);
