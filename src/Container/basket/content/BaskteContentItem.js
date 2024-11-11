import React, { memo, useRef, useState } from 'react';
import styles from "../index.module.scss"
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect } from 'react';
import ConfirmDialog from '../../../Container2/dialogs/ConfirmDialog';
import { byBarCode } from '../../../services/products/productsRequests';
import { useTranslation } from 'react-i18next';

const BascketContentItem = ({
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
  totalPrice,
  freezeCount,
  index
}) => {
  const [notAvailable, setNotAvailable] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const ref = useRef();
  const {t} = useTranslation();
  const removeOneProduct = () => {
    notAvailable && setAvail(avail.filter(item => item!==el.id))
    deleteBasketItem(el.id)
    setOpenDialog(false)
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

  const checkPriceChange = (e) => {
    console.log( +e.target.value," e.target.value")
    if(+e.target.value > el?.count){
      byBarCode("GetAvailableProducts", el?.goodCode).then((res) => {
        if(res?.length) {
          res.forEach((item) => {
            if(item?.barCode === el?.goodCode){
              if(+e.target.value > item?.remainder) {
                return createMessage("error", t("dialogs.havenot"))
              }else if(el?.price !== item?.price) {
                return createMessage("error", t("dialogs.havenot"))
              }else{
                console.log(e,+e.target.value, "mtav 1")
               return handleChangeForClosePrePayment(e)
              }
            }else{
              return createMessage("error", t("dialogs.havenot"))
            }
          })
        }else{
          console.log("mtav 3")

           createMessage("error", t("dialogs.havenot"))
           return
        }
      })
    }else{
      console.log("mtav 4")

      return handleChangeForClosePrePayment(e)
    }
  };

  const handleChangeForClosePrePayment = (e) => {
    console.log(e.target.value , "mtav erkrord func")
    let isValid = false;
    const data = e.target.value;
    if(el?.unit === "հատ" || el?.unit === "pcs" || el?.unit === "шт"){
      const needSymb = /^[0-9]*$/;
      isValid = needSymb.test(data)
      if(isValid || e.target.value === "") {
        return changeCountOfBasketItem( el?.id,  Math.round(+e.target.value))
      }else{
      return changeCountOfBasketItem( el?.id, (e.target.value).toFixed())
      }
    }else{
      const needSymb = /^\d+(\.\d{0,3})?$/
      isValid = needSymb.test(data)
      if(isValid || e.target.value === "") {
        if (e.target.value[`${e.target.value}`.length - 1] === "."){
          return changeCountOfBasketItem( el?.id, e.target.value)
        }else{ 
          return changeCountOfBasketItem( el?.id, +e.target.value)
        }
      }else if (e.target.value === "0" || e.target.value === "."){
        return changeCountOfBasketItem( el?.id, "0.")
      }else{
        return
      }
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

  useEffect(() => {
    if(localStorage.getItem("endPrePayment") && totalPrice - paymentInfo?.prePaymentAmount < 0) {
      createMessage("error", t("history.reverseLimit"))
    };

  }, [totalPrice])

  return (
    <div className={styles.basketContent_item} style={{border:notAvailable? "red solid 2px":"none"}}> 
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
            min={el?.otherLangMeasure === "հատ" ? "1" :"0.001"}
            step={el?.otherLangMeasure === "հատ" ? "1": "0.001"}
            max={`${el?.remainder}`}
            value={el?.count}
            onChange={(event) => {
              if(localStorage.getItem("endPrePayment")) {
                checkPriceChange(event)
              }else{
                handleCountChange(event)
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

export default memo(BascketContentItem);
