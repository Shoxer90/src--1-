import React, { useContext, useState, useEffect, memo } from "react";
import { Card, Dialog, Divider } from "@mui/material";
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import ModeIcon from '@mui/icons-material/Mode';
import { updateIsFavorite } from "../../services/products/productsRequests";

import UpdateProduct from "./product/UpdateProduct";

import {LimitContext} from "../../context/Context";

import styles from "./index.module.scss";
import SnackErr from "../dialogs/SnackErr";
import ConfirmDialog from "../dialogs/ConfirmDialog";
import { useTranslation } from "react-i18next";

const HomeContentItem = ({
  measure,
  setToBasket,
  basketExist,
  deleteAndRefresh,
  changeStatus,
  deleteBasketItem,
  product,
  index,
  dataGroup,
  selectContent,
  getSelectData,
  typeCode,
  setTypeCode,
  setFetching,
  setContent,
  content,


}) => {
  const {t} = useTranslation();
  const {limitedUsing} = useContext(LimitContext);
  const [openUpdateProd, setOpenUpdateProduct] = useState(false);
  const [quantity,setQuantity] = useState("");
  const [starSynth,setStarSynth] = useState();
  const [message,setMessage] = useState();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [newPrice, setNewPrice] = useState(product?.price - (product?.price * product?.discount / 100));
  const handleStarChange = () => {
    setStarSynth(!starSynth)
    updateIsFavorite(product?.id, !product?.isFavorite)
  };
 
  const clickToBascket = () => {
    if(localStorage.getItem("endPrePayment")) {
      setOpenConfirm(true)
      return
    }
    setToBasket(product, quantity, false)
    setQuantity("")
  };

  const addToBasketWithPrep = () => {
    setToBasket(product, quantity, false)
    setOpenConfirm(false)
  }

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
    <>
    <div style={{position:"relative", cursor:"pointer",}}>
      <Card className={styles.productContent_item} sx={{borderRadius:"8px", boxShadow:0}}>
      <div className={styles.productContent_item_icons}>
        {starSynth ?
          <StarIcon 
            onClick = {handleStarChange}
            fontSize="medium" 
            sx={{color:"orangered"}}
          /> : <StarOutlineIcon 
            onClick = {handleStarChange}
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
      </div>
      <Divider style={{margin:1, backgroundColor:"gray",width:"90%",alignSelf:"center",}}/>
      <div className={styles.productContent_item_img}>
        <img 
          style={{height:"74px"}}
          src={product?.photo ? product?.photo : "/default-placeholder.png"} 
          alt={index+1}
        />
      </div>
      <strong>
        <span 
          className={product?.name?.length > 19 ? styles.hovertext : undefined}
          style={{fontSize: product?.name?.length > 15? "70%": "100%",padding:"0px", margin:"0px"}}
          data-hover={product?.name}
        >
          {product?.name?.length > 19 ? `${product?.name.slice(0,20)}...` : product?.name}
        </span>
      </strong>
      <span 
        className={product?.brand?.length > 19 ? styles.hovertext: undefined}
        data-hover={product?.brand}
        style={{fontSize: product?.brand?.length > 15 ? "70%": "80%",minHeight:"20px"}}
      >
        {(product?.brand?.length > 19 ? `${product?.brand.slice(0,20)}...` : product?.brand) || ""}
      </span>
      <div className={styles.productContent_item_info} style={{fontSize:"90%"}}>
        <p style={{margin:0}}>
          <strong>
            {product?.price} 
            <span style={{fontSize:"90%"}}> {t("units.amd")} 
            {product?.discount > 0 && 
            <span style={{fontSize:"90%", color:"orangered"}}>
              <span> / {t("productcard.newprice")} </span> 
              <strong>
                { product?.discountType === 1 && ( Boolean(newPrice%1) ? newPrice.toFixed(2): newPrice) }
                { product?.discountType === 0 && ( Boolean(newPrice%1) ? newPrice.toFixed(2): newPrice)  }
                { t("units.amd") }
              </strong>
            </span>
          }
              </span>
          </strong>
        </p>
      
      </div>
      {product?.remainder ?
        <>
          <div style={{fontSize:"70%", margin:"1px", color: quantity > product?.remainder && "red",fontWeight: quantity > product?.remainder && "700"}}>
            {t("productcard.remainder")} {product?.remainder%1 ? product?.remainder.toFixed(3) : product?.remainder } {t(`units.${product?.measure}`)}
          </div>

          <div style={{fontSize:"70%", margin:"1px", color:"blue",fontWeight:"700", minHeight:"17px"}}>
            { product?.remainderPrePayment ?
             <span>
              {t("productcard.remainderPrePayment")} {product?.remainderPrePayment%1 ? product?.remainderPrePayment.toFixed(3) : product?.remainderPrePayment } {t(`units.${product?.measure}`) }
             </span>: " "}
          </div>
          <div style={{fontSize:"80%",letterSpacing:"0.1px",padding:"3px"}}>
            {product?.barCode}
          </div>
          <div className={styles.productContent_item_addBasket}>
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
          </div> 
        </>: <>
          <div style={{fontSize:"80%",letterSpacing:"0.1px",padding:"3px"}}>code : {product?.barCode}</div>
          <div style={{marginBottom:"14px",color:"red"}}>{t("productcard.outofstock")}</div>
        </>
      }
      </Card>
    </div>
    {openUpdateProd && <UpdateProduct 
      t={t}
      measure={measure}
      deleteBasketItem={deleteBasketItem}
      changeStatus={changeStatus}
      openUpdateProd={openUpdateProd} 
      setOpenUpdateProduct={setOpenUpdateProduct}   
      product={product} 
      deleteAndRefresh={deleteAndRefresh}
      dataGroup={dataGroup}
      selectContent={selectContent}
      getSelectData={getSelectData}
      typeCode={typeCode}
      setTypeCode={setTypeCode}
      setFetching={setFetching}
      setContent={setContent}
      content={content}
      setNewPrice={setNewPrice}
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
  </>
  )
};

export default memo(HomeContentItem);

