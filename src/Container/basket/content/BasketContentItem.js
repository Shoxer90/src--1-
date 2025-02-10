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
  setAvail, 
  deleteBasketItem,
  changeCountOfBasketItem,
  screen,
  flag,
  createMessage,
  freezeCount,
}) => {
  const [notAvailable, setNotAvailable] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [errRed, setErrRed] = useState(false);
  const [ownCount, setOwnCount] = useState(0);

  const ref = useRef();
  const {t} = useTranslation();

  const removeOneProduct = async() => {
    notAvailable && setAvail(avail.filter(item => item !== el.id))
    deleteBasketItem(el.id)
    setOpenDialog(false)
  };

  const getErrorStyle = (isErr) => {
    if(isErr) {
      ref.current.style.border="solid red 2px"
      ref.current.style.color="red"
      return ref
    }else {
      ref.current.style.color="";
      ref.current.style.border="";
    }
  };

  const newFunction = (target) => {
    getErrorStyle(false)
    let isValid = false;
    if(el?.measure === "հատ" || el?.measure === "pcs" || el?.measure === "шт") {
      const needSymb = /^[0-9]*$/;
      isValid = needSymb.test(target);
      if(isValid || target === "") {
        checkPriceChangeV2(+target)
      }else{
        return
      }
    }else {
      const needSymb = /^\d+(\.\d{0,3})?$/
      isValid = needSymb.test(target)
      if(isValid || target === "") {
        if(target[`${target}`.length - 1] === ".") {
          return checkPriceChangeV2(target)
        }else { 
          return checkPriceChangeV2(+target)
        }
      }else if (target === "0" || target === "."){
        return checkPriceChangeV2( "0.")
      }else{
        return
      }
    }
  };

  const lastFunc = (val) => {
    let count = {count:0}
    if(freezeCount?.length) {
      count = freezeCount.find(item => item?.productId === el?.productId)
      if(count === undefined) {
        count = {count:0}
      }
    }
    if(+val > (+count?.count + el?.remainder)) {
      return setErrRed(true)
    }
    else {
      newFunction(val)
    }
  };
  
  const checkPriceChangeV2 = async(val) => {
      let count = {count:0}
      if(freezeCount?.length) {
        count = freezeCount.find(item => item?.productId === el?.productId)
        if(count === undefined) {
          count = {count:0}
        }
      }
      if(+val > count?.count) {
      cheackProductCountnPrice([{
        "id": el?.productId || el?.id,
        "count": val - count?.count,
        "price": el?.price
      }]).then((result) => {
        if(!result[0]?.countStatus) {
          getErrorStyle(true)
          return createMessage("error", `${t("dialogs.havenot")} ${el?.name} ${ val - count?.count} ${t(`${el?.measure}`)}`)
        }else if(!result[0]?.priceStatus) {
          getErrorStyle(true)
          return createMessage("error", t("basket.price_change"))
        }
        else{
          changeCountOfBasketItem( el?.id, val)
        }
      })
    }else {
      changeCountOfBasketItem( el?.id, val)
    }
  };
  
  useEffect(() => {  
    setNotAvailable(false)
  }, [flag]);

  useEffect(() => {
    avail?.length ? 
    avail.map((item) =>{
      return item === el?.id ? setNotAvailable(true) : setNotAvailable(false)
    }): setNotAvailable(false)
  }, [avail]);

  const getFreezedCount= () => {
    let count = 0
    if(freezeCount?.length) {
      count = freezeCount.find(item => item?.productId === el?.productId)
      if(count === undefined) {
        return setOwnCount(0)
      }else{
        return setOwnCount(count?.count)
      }
    }
  };

  useEffect(() => {
    getFreezedCount()
  }, [freezeCount]);

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
              <span 
                style={{
                  color:!el?.remainder || errRed ? "red": null,
                  fontWeight:!el?.remainder || errRed ? 700: null
                }}
              > 
                <div>
                  {t("basket.maxCount")} {el?.remainder + ownCount} {t(`units.${el?.unit || el?.measure}`)}
                </div>
              </span>
        
            </div>
          </div> 
        </div>
        <div className={styles.basketContent_item_quantity}>
          <input
            ref={ref}
            style={{ width:"100%",border: !el?.count? "red solid 2px":null}}
            value={el?.count}
            onChange={(event) => {
              setErrRed(false)
              lastFunc(event.target.value)
            }} 
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
