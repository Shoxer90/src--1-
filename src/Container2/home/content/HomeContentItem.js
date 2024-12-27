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
  const style = {
    display:"flex",
    justifyContent:"flex-start",
    alignItems:"center",
    padding:"5px",
    height:"125px",
    width:"300px",
    picture:{
      height:"110px",
      width:"110px",
      border:"solid lightgray 2px"
    },
    info:{
      paddingLeft:"5px",
      fontSize:"80%",
      textAlign:"start",
      fontWeight: 600,
      item:{
        display:"flex",
        justifyContent:"space-between"
      }
    }
  }

  return (
    <>
    
    <div style={{position:"relative", border:"solid orange 2px",borderRadius:"5px", margin:"5px", cursor:"pointer"}}>
      <Card>
        <div style={{display:"flex", justifyContent:"space-between", padding:"2px 5px", }}>
        <span 
          className={product?.name?.length > 5 ? styles.hovertext : undefined}
          style={{fontSize:"90%",fontWeight:700}}
          data-hover={product?.name}
        >
          {product?.name?.length > 25 ? `${product?.name.slice(0,24)}...` : product?.name}
        </span>
        <span className={styles.productContent_item_icons}>
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
      </span>
      </div>
      <Divider style={{margin:1, backgroundColor:"gray",width:"90%",alignSelf:"center",}}/>
        <Box style={style}>
          {/* <img style={style?.picture} src= "https://thefreshandnatural.com/wp-content/uploads/2020/05/APPLE-GREEN.jpg" alt={index} /> */}
          <img style={style?.picture} src={product?.photo ? product?.photo : "/default-placeholder.png"} alt={index} />
          <Box style={style.info}>
            <div> 
              {t("updates.price")}:  {product.price } {t("units.amd")}
              <span style={{fontSize:"90%", color:"orangered"}}>
                {product?.discount > 0 && 
                  <span>
                    / {t("productcard.newprice")}
                    <strong>
                      { (Boolean(newPrice%1) ? newPrice.toFixed(2): newPrice) }
                      {/* { t("units.amd") } */}
                    </strong>
                  </span>
                }
              </span>
            </div>

            {product?.remainder ?
        <>
          <div style={{ margin:"1px", color: quantity > product?.remainder && "red",fontWeight: quantity > product?.remainder && "700"}}>
            {t("productcard.remainder")} {product?.remainder%1 ? product?.remainder.toFixed(3) : product?.remainder } {t(`units.${product?.measure}`)}
          </div>

          <div style={{margin:"1px", color:"blue",fontWeight:"700", minHeight:"17px"}}>
            { product?.remainderPrePayment ?
             <span>
              {t("productcard.remainderPrePayment")} {product?.remainderPrePayment%1 ? product?.remainderPrePayment.toFixed(3) : product?.remainderPrePayment } {t(`units.${product?.measure}`) }
             </span>: " "}
          </div>
          <div>code {product?.barCode} </div>
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
          <div> code : {product?.barCode}</div>
          <div style={{marginBottom:"14px",color:"red"}}>{t("productcard.outofstock")}</div>
        </>
      }

          </Box>
        </Box>
      </Card>
    </div>
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

