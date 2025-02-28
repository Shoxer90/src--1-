import { memo, useContext, useEffect, useState } from "react";
import ConfirmDialog from "../../dialogs/ConfirmDialog";
import { updateIsFavorite } from "../../../services/products/productsRequests";
import { LimitContext } from "../../../context/Context";
import SnackErr from "../../dialogs/SnackErr";
import { Box, Card, Dialog, Divider } from "@mui/material";
import UpdateProduct from "../product/UpdateProduct";
import styles from "./index.module.scss";
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import ModeIcon from '@mui/icons-material/Mode';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { useTranslation } from "react-i18next";
import { editPrepaymentCountsModule } from "../../../modules/editPrepayment";

const style = {
  display:"flex",
  justifyContent:"flex-start",
  alignItems:"center",
  padding:"5px",
  height:"135px",
  width:"300px",
  picture:{
    height:"125px",
    width:"110px",
    border:"solid lightgray 2px"
  },
  info:{
    margin:"20px 5px",
    fontSize:"80%",
    textAlign:"start",
    fontWeight: 600,
    item:{
      display:"flex",
      justifyContent:"space-between"
    }
  }
};

const HomeContentItem = ({
  setToBasket,
  basketExist,
  deleteAndRefresh,
  product,
  deleteBasketItem,
  measure,
  index,
  getSelectData,
  typeCode,
  setTypeCode,
  setFetching,
  setContent,
  content,
  setCurrentPage
}) => {
  const {t} = useTranslation();
  const {limitedUsing} = useContext(LimitContext);
  const [openUpdateProd, setOpenUpdateProduct] = useState(false);
  const [quantity,setQuantity] = useState("");
  const [starSynth,setStarSynth] = useState();
  const [message,setMessage] = useState();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [newPrice, setNewPrice] = useState(product?.price - (product?.price * product?.discount / 100));
  
  const handleStarChange = (bool) => {
    setStarSynth(bool)
    updateIsFavorite(product?.id, bool)
  };
 
  const clickToBascket = () => {
    if(localStorage.getItem("endPrePayment")) {
      setOpenConfirm(true)
      return
    }
    setToBasket(product, quantity, false)
    setQuantity("")
  };

  const addToBasketWithPrep = async() => {
    if(localStorage.getItem("isEditPrepayment")){
      await editPrepaymentCountsModule(product?.id,quantity || 1)
    }
    setToBasket(product, quantity, false)
    setOpenConfirm(false)
  };


  const onlyNumberAndADot = (event) => {
    let isValid = false;
    if(event.target.value === "+" || event.target.value === "-"){
      return setQuantity("")
    }else if(product?.otherLangMeasure === "հատ"){
      const needSymb = /^[0-9]*$/;
      isValid = needSymb.test(event.target.value);
      if(isValid && +event.target.value) {
       return setQuantity(+event.target.value)
      }else if(event.target.value === ""){
       return setQuantity("")
      }
    }else if(product?.otherLangMeasure !== "հատ"){
      const needSymb = /^\d+(\.\d{0,3})?$/
      isValid = needSymb.test(event.target.value)
      if((event.target.value ==="0" || event.target.value === 0) && `${event.target.value}`.length > `${quantity}`?.length) {
        return setQuantity("0.")
      }else 
      if(isValid || event.target.value=== "") {
        setQuantity(event.target.value)
      }else{
        return
      }
    }
  }

  useEffect(() => {
    setStarSynth(product?.isFavorite)
  },[]);


  return (
    <Card style={{ border:"solid orange 2px",padding:"7px", cursor:"pointer"}}>
        <div style={{display:"flex", justifyContent:"space-between", padding:"2px 5px"}}>
        <div 
          className={product?.name?.length > 22 ? styles.hovertext : undefined}
          style={{fontSize:"90%", fontWeight:700}}
          data-hover={`${product?.name} ${product?.brand}`}
        >
          {product?.name?.length > 25 ? `${product?.name.slice(0,24)}...` : `${product?.name}`} {" "}
          {product?.name?.length+product?.brand?.length < 25 && product?.brand ?`"${product?.brand}"`:""}
        </div>
        <span className={styles.productContent_item_icons}>
        {starSynth ?
          <StarIcon 
            onClick = {()=>handleStarChange(false)}
            fontSize="medium" 
            sx={{color:"orangered"}}
          /> : <StarOutlineIcon 
            onClick = {()=>handleStarChange(true)}
            fontSize="small"
            sx={{color:"orange"}}/>
          }
        { !limitedUsing && 
          <ModeIcon 
            fontSize="medium" 
            sx={{color:"orange"}}
            onClick={()=>setOpenUpdateProduct(true)}
          />
        }
      </span>
      </div>
      <Divider style={{margin:1, backgroundColor:"gray",width:"90%",alignSelf:"center",}}/>
        <Box style={style}>
          {/* <img style={style?.picture} src= "https://thefreshandnatural.com/wp-content/uploads/2020/05/APPLE-GREEN.jpg" alt={index} /> */}
          <img style={style?.picture} src={product?.photo ? product?.photo : "/default-placeholder.png"} alt={index} />
          <Box style={style.info}>
            <div style={{marginTop:"10px"}}> 
              {t("updates.price")}:  {product.price } {t("units.amd")}
              </div>
              <div>
                {product?.discount > 0 ? 
                  <div style={{color:"red", fontWeight:800}}>
                    {t("productcard.newprice")}
                    { (Boolean(newPrice%1) ? newPrice.toFixed(2): newPrice) } { t("units.amd") }
                  </div>: <div style={{height:"18px"}}>{""}</div>
                }
            </div>

            {product?.remainder || product?.remainderPrePayment ?
              <>
                <div style={{ margin:"1px", color: (quantity > product?.remainder  || !product?.remainder) && "red",fontWeight: quantity > product?.remainder && "700"}}>
                  {t("productcard.remainder")} {product?.remainder%1 ? product?.remainder.toFixed(3) : product?.remainder } {t(`units.${product?.measure}`)}
                </div>

                  { product?.remainderPrePayment > 0 ?
                    <div style={{margin:"1px", color:"#3FB68A",fontWeight:"700",minHeight:"17px"}}>
                      {t("productcard.remainderPrePayment")} {product?.remainderPrePayment%1  ? product?.remainderPrePayment.toFixed(3) : product?.remainderPrePayment } {t(`units.${product?.measure}`) }
                    </div>: <div style={{height:"18px"}}>{""}</div>
                  }
                  <div
                    className={product?.barCode?.length > 17 ? styles.hovertext : null }
                    data-hover={`${product?.barCode}`}
                  > 
                    {t("productinputs.code2")} : {product?.barCode?.length > 17 ? `${product?.barCode.slice(0,17)}...`: product?.barCode }
                  </div>
                {product?.remainder ? <div className={styles.productContent_item_addBasket}>
                  <input 
                    max={`${product.remainder}`}
                    placeholder="1"
                    value={quantity}  
                    onChange={(e)=>onlyNumberAndADot(e,3)} 
                    disabled={basketExist.includes(product?.id)}
                  />
                  <ShoppingBasketIcon 
                    style={{color: basketExist?.length && basketExist.includes(product?.id) ? "green" : "orange"}}
                    fontSize="large" 
                    onClick={clickToBascket}
                  />
                </div> :<div style={{height:"35px"}}>{""}</div>}
              </>: <>
                <div> {t("productinputs.code2")} {product?.barCode} </div>
                {/* <div> {t("productinputs.code2")} : {product?.barCode?.length > 20 ? `${product?.barCode.slice(20)}...`: product?.barCode }</div> */}
                <div style={{marginBottom:"14px",color:"red"}}>{t("productcard.outofstock")}</div>
              </>
            }
          </Box>
        </Box>
      {openUpdateProd && <UpdateProduct 
        openUpdateProd={openUpdateProd} 
        measure={measure}
        setOpenUpdateProduct={setOpenUpdateProduct}   
        product={product} 
        deleteAndRefresh={deleteAndRefresh}
        setNewPrice={setNewPrice}
        deleteBasketItem={deleteBasketItem}
        setFetching={setFetching}
        setContent={setContent}
        content={content}
        getSelectData={getSelectData}
        typeCode={typeCode}
        setTypeCode={setTypeCode}
        setCurrentPage={setCurrentPage}
      />}
      {message ? 
        <Dialog open={Boolean(message)}>
          <SnackErr message={message} type="info" close={setMessage} />
        </Dialog>
      :""}
      <ConfirmDialog
        func={addToBasketWithPrep}
        open={openConfirm}
        title={t("mainnavigation.newproduct")}
        close={setOpenConfirm}
        question={t("basket.add_to_prep")}
      />
    </Card>
  )
};

export default memo(HomeContentItem);

