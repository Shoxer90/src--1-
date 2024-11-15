import React, { memo, useRef, useState } from 'react';
import styles from "../index.module.scss"
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect } from 'react';
import ConfirmDialog from '../../../Container2/dialogs/ConfirmDialog';
import {cheackProductCountnPrice } from '../../../services/products/productsRequests';
import { useTranslation } from 'react-i18next';

const BasketContentItem = ({
  el, 
  avail, 
  paymentInfo, 
  setAvail, 
  setIsEmpty, 
  deleteBasketItem,
  changeCountOfBasketItem,
  screen,
  flag,
  setSingleClick,
  createMessage,
  message,
  freezeCount,
}) => {
  const [notAvailable, setNotAvailable] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProd, setCurrentProd] = useState({});
  const ref = useRef();
  const {t} = useTranslation();

  const removeOneProduct = async() => {
    notAvailable && setAvail(avail.filter(item => item!==el.id))
    deleteBasketItem(el.id)
    setOpenDialog(false)
  }

  const getErrorStyle = (isErr) => {
    if(isErr) {
      ref.current.style.border="solid red 2px"
      ref.current.style.color="red"
      return ref
    }else {
      ref.current.style.color="";
      ref.current.style.border="";
    }
  }

  const handleChangeInput = async(e) => {
      setNotAvailable(false) 
      setIsEmpty(false)
      setSingleClick({
        "cash": false,
        "card": false,
        "qr": false,
        "link": false
      })
      ref.current.style.color="";
      ref.current.style.border="";
      ref.current.style.fontSize="";
      if(e.target.value === "" || +e.target.value === 0){
        ref.current.style.border="solid red 2px"
        ref.current.style.color="red"
      }
      if(e.target.value[0] === "0" && e.target.value[1] !== "."){
        return changeCountOfBasketItem( el?.id, (+e.target.value).toFixed())
      }
      if((+e.target.value > el?.remainder) || (el?.price <= 1 && paymentInfo?.discount)){
        ref.current.style.color="red"
        ref.current.style.fontSize="110%"
        ref.current.style.border="solid red 2px"
        createMessage("error", t("dialogs.havenot"))
      }
      changeCountOfBasketItem( el?.id, e.target.value)
  };

  const handleCountChange = (event) => {
    setSingleClick({})
    let isValid = false;
    const data = event.target.value;
    if (el?.otherLangMeasure === "հատ"){
      const needSymb = /^[0-9]*$/;
      isValid = needSymb.test(data)
      if(isValid) {
        handleChangeInput(event)
      }else{
        return
      }
    }else{
      const needSymb = /^\d+(\.\d{0,3})?$/
      isValid = needSymb.test(data)
      if(isValid || event.target.value=== "") {
        handleChangeInput(event)
      }else{
        return
      }
    }
  };


  const newFunction = (target) => {
    getErrorStyle(false)
    if(+target > currentProd?.count && message)return
    let isValid = false;
    if(el?.measure === "հատ" || el?.measure === "pcs" || el?.measure === "шт") {
      // if(el?.unit === "հատ" || el?.unit === "pcs" || el?.unit === "шт") {
      const needSymb = /^[0-9]*$/;
      isValid = needSymb.test(target);
      if(isValid || target === "") {
        setCurrentProd({
          ...currentProd,
          count: target
        });
        checkPriceChangeV2(target)
      }else{
        return
      }
    }else {
      const needSymb = /^\d+(\.\d{0,3})?$/
      isValid = needSymb.test(target)
      if(isValid || target === "") {
        setCurrentProd({
          ...currentProd,
          count: target
        })
        if(target[`${target}`.length - 1] === ".") {
          return checkPriceChangeV2(target)
        }else { 
          return checkPriceChangeV2(+target)
        }
      } else if (target === "0" || target === "."){
        return checkPriceChangeV2( "0.")
      }else{
       return
      }
    }
  };

  const checkPriceChangeV2 = async(val) => {
      console.log(freezeCount,"count freex")
      let count = {count:0}
      if(freezeCount?.length) {
        count = freezeCount.find(item => item?.productId === el?.productId)
        if(count === undefined) {
          count = {count:0}
        }
      }
      console.log(count,"count")
      console.log(count === undefined,"count")
      if(+val > count?.count) {
      cheackProductCountnPrice([{
        "id": currentProd?.productId || currentProd?.id,
        "count": val - count?.count,
        "price": currentProd?.price
      }]).then((result) => {
        if(!result[0]?.countStatus) {
          getErrorStyle(true)
         return createMessage("error", t("dialogs.havenot"))
        }else if(!result[0]?.priceStatus) {
          getErrorStyle(true)
          return createMessage("error", t("basket.price_change"))
        }else{
          changeCountOfBasketItem( el?.id, val)
        }
      })
    }else {
      changeCountOfBasketItem( el?.id, val)
    }
  };
  
  useEffect(() => {  
    setNotAvailable(false)
    setCurrentProd(el)
  }, [flag]);

  useEffect(() => {
    avail?.length ? 
    avail.map((item) =>{
      return item === el?.id ? setNotAvailable(true) : setNotAvailable(false)
    }): setNotAvailable(false)
  }, [avail]);

  return (
    <div className={styles.basketContent_item} ref={ref} style={{border:notAvailable? "red solid 2px":"none"}}> 
      {screen > 500 && <div className={styles.basketContent_item_image}>
        <img
          src= {el?.photo || "/default-placeholder.png"}
          alt="img"
        />
      </div>}
        <div className={styles.basketContent_item_info}>
          <div 
            className={styles.basketContent_item_info_title} 
            style={{fontSize:el?.name?.length>14 ? "80%": "100%"}}
          >
            <span className={styles.hovertext} data-hover={el?.name} >
              {el?.name?.length>30 ? `${el?.name.slice(0,30)}...` : el?.name }
            </span>
          </div>
          <div style={{fontSize:"80%"}}>

            <div className={styles.basketContent_item_info_price}> 
          
              <div>
                <span>{el?.price} {t("units.amd")} </span> 
                { el?.discount > 0 &&  
                  <span style={{color:"red"}}> 
                    /{(el?.discountPrice)?.toFixed(2)} {t("units.amd")}
                  </span>
                }
              </div>
            </div>
            <div style={{fontSize:"90%"}}>
              <strong>{el?.barCode || el?.goodCode? `bar ${el?.barCode || el?.goodCode} /  `: ""}</strong>
              <span style={{color:!el?.remainder? "red": null}}> {`${t("productcard.remainder")} ${el?.remainder}`} {el?.measure ? t(`units.${el?.measure}`): t(`units.${el?.unit}`)} </span>
        
            </div>
          </div> 
        </div>
        <div className={styles.basketContent_item_quantity}>
          <input
            ref={ref}
            style={{ width:"100%",border: !el?.count? "red solid 2px":null}}
            // value={el?.count}
            value={currentProd?.count}
            onChange={(event) => {
              if(localStorage.getItem("endPrePayment")) {
                newFunction(event.target.value)
              }else{
                // handleCountChange(event)
                newFunction(event.target.value)
              }}
            } 
          />
          <div style={{margin:"3px",width:"40px", fontSize:"80%"}}>
            {el?.measure ? t(`units.${el?.measure}`) : t(`units.${el?.unit}`)}
            
          </div>
        </div>
        <div 
          className={styles.basketContent_item_garbage}
          onClick={()=> setOpenDialog(true)}
        >
         <DeleteIcon fontSize="medium" sx={{"&:hover":{color:"green"}}} />
        </div>
        <ConfirmDialog 
          question={t("basket.removeoneprod")}
          func={removeOneProduct}
          title={t("settings.remove")}
          open={openDialog}
          close={setOpenDialog}
          content={" "}
          t={t}
        />
        {}
    </div>
  )
}

export default memo(BasketContentItem);
