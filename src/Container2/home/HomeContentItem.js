import React, { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { memo } from "react";
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import { Alert, Card, Divider, Snackbar } from "@mui/material";
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import ModeIcon from '@mui/icons-material/Mode';

import UpdateProduct from "./product/UpdateProduct";

import {LimitContext} from "../../context/Context";

import styles from "./index.module.scss";
import { updateIsFavorite } from "../../services/products/productsRequests";

const HomeContentItem = ({
  t,
  setToBasket,
  basketExist,
  deleteAndRefresh,
  changeStatus,
  product,
  deleteBasketItem,
  measure,
  index,
  dataGroup,
  selectContent,
  getSelectData,
  typeCode,
  setTypeCode,

}) => {
  const {limitedUsing} = useContext(LimitContext);
  const [openUpdateProd, setOpenUpdateProduct] = useState(false);
  const [quantity,setQuantity] = useState();
  const [starSynth,setStarSynth] = useState();
  const [newPrice, setNewPrice] = useState(product?.price - (product?.price * product?.discount / 100));

  const handleStarChange = () => {
    setStarSynth(!starSynth)
    updateIsFavorite(product?.id, !product?.isFavorite)
  };
 
  const clickToBascket = () => {
    setToBasket(product,quantity)
    setQuantity("")
  };

  const createProdQuant = (e) => {
    if(e.target.value.indexOf("-") !== -1){
      setQuantity(+e.target.value * -1)
      return
    }
    if(e.target.value === "0" || e.target.value === 0){
    setQuantity("")
    return
    }
    if((e.target.value.indexOf(".") !== -1 && e.target.value.split('.')[1]?.length > 3)){
      return
    }else{
      if(e.target.value > product?.remainder) {
        setQuantity(e.target.value)
        return
      } 
      else if(quantity === 0 || quantity === "0"){
        setQuantity("")
        setQuantity(e.target.value.slice(-1))
      }else if(product?.otherLangMeasure === "հատ") {
        setQuantity(Math.round(e.target.value))
      }else{
        setQuantity(e.target.value)
      }
    }
  };

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
        {product?.brand || ""}
      </span>
      <div className={styles.productContent_item_info} style={{fontSize:"90%"}}>
        <p style={{margin:0}}>
          <strong>
            {product?.price} 
            <span style={{fontSize:"90%"}}> {t("units.amd")} / {t(`units.${product?.measure}`)}</span>
          </strong>
        </p>
        <div style={{height:"20px", margin:"5px",color:"red"}}>
          {product?.discount > 0 && 
            <span style={{fontSize:"90%"}}>
              <span>{t("productcard.newprice")} </span> 
              <strong>
                { product?.discountType === 1 && ( Boolean(newPrice%1) ? newPrice.toFixed(2): newPrice) }
                {/* { product?.discountType === 2 && (product?.price - product?.discount) } */}
                { product?.discountType === 0 && ( Boolean(newPrice%1) ? newPrice.toFixed(2): newPrice)  }

                { t("units.amd") }
              </strong>
            </span>
          }
        </div>
      </div>
      {product?.remainder ?
        <>
          <div style={{fontSize:quantity > product?.remainder ? "90%":"70%", margin:"5px", color: quantity > product?.remainder && "red"}}>
            {t("productcard.remainder")} {product?.remainder} {t(`units.${product?.measure}`)}
          </div>
          <div style={{fontSize:"80%",letterSpacing:"0.1px",padding:"3px"}}>
            {product?.barCode}
          </div>
          <div className={styles.productContent_item_addBasket}>
            <input 
              min={product?.otherLangMeasure === "հատ" ? "1" : "0.001"}
              step={product?.otherLangMeasure !== "հատ" ? "0.001" : "1"}
              max={`${product.remainder}`}
              placeholder="1"
              type="number" 
              value={quantity}  
              onChange={(e)=>createProdQuant(e)} 
              disabled={basketExist.includes(product?.id)}
            />
            <ShoppingBasketIcon 
              style={{color: basketExist?.length && basketExist.includes(product?.id) ? "green" : "orange"}}
              fontSize="large" 
              onClick={clickToBascket}
            />
          </div> 
        </>: <div style={{marginBottom:"14px",color:"red"}}>{t("productcard.outofstock")}</div>
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

    />}
  </>
  )
};

export default memo(HomeContentItem);

