import React, { memo, useRef, useState } from 'react';
import styles from "../index.module.scss"
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect } from 'react';
import ConfirmDialog from '../../../Container2/dialogs/ConfirmDialog';

const BascketContentItem = ({el, 
  avail, 
  paymentInfo, 
  setAvail, 
  t, 
  setIsEmpty, 
  deleteBasketItem,
  changeCountOfBasketItem,
  screen,
  flag,
  setSingleClick, 
  createMessage}) => {

  const[quantity,setQuantity] = useState();
  const [notAvailable, setNotAvailable] = useState(false);
  const [openDialog,setOpenDialog] =useState(false);

  const ref = useRef();

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
    ref.current.style.color=""
    ref.current.style.border=""
    ref.current.style.fontSize=""
    if(e.target.value === "" || +e.target.value === 0){
      ref.current.style.border="solid red 2px"
      ref.current.style.
      color="red"
    }
    if(e.target.value[0] === "0" && e.target.value[1] !== "."){
      setQuantity((+(e.target.value.slice(1, e.target.value.length-1))).toFixed())
      return changeCountOfBasketItem( el?.id, (+e.target.value).toFixed())
    }
    if(e.target.value.indexOf("-") !== -1 || e.target.value.indexOf("+") !== -1){
      setQuantity(+e.target.value * -1)
      changeCountOfBasketItem( el?.id, +e.target.value * -1)
      return
    }
    if((+e.target.value > el?.remainder) || (el?.price <= 1 && paymentInfo?.discount)){
    setQuantity(+el?.remainder)
      ref.current.style.color="red"
      ref.current.style.fontSize="110%"
      ref.current.style.border="solid red 2px"
       createMessage("error", t("dialogs.havenot"))
    }
    if(el?.otherLangMeasure === "հատ" && e.target.value.indexOf(".") !== -1 ) {
      setQuantity((+e.target.value).toFixed())
      return changeCountOfBasketItem( el?.id, (+e.target.value).toFixed())

    }else if(el?.otherLangMeasure !== "հատ"){
      if(e.target.value[e.target.value?.length-5] === "." || e.target.value[e.target.value?.length-5] === ","){
        setQuantity((+e.target.value).toFixed(3))
        return changeCountOfBasketItem( el?.id, (+e.target.value).toFixed(3))
      }else{
        setQuantity(+e.target.value)
        return changeCountOfBasketItem( el?.id, e.target.value)
      }
    }else{
      setQuantity(+e.target.value)
      changeCountOfBasketItem( el?.id,  e.target.value)
    }
    setQuantity(+e.target.value)
    changeCountOfBasketItem( el?.id, e.target.value)
  }
  
  useEffect(() => {
    setQuantity(+el?.count)
    setNotAvailable(false)
  }, [flag]);

  useEffect(() => {
    avail?.length ? 
    avail.map((item) =>{
      return item === el?.id ? setNotAvailable(true) : setNotAvailable(false)
    }): setNotAvailable(false)
  }, [avail]);

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
                    /{(el?.discountPrice).toFixed(2)} {t("units.amd")}
                  </span>
                }
              </div>
            </div>
            <div style={{fontSize:"90%"}}><strong>bar {el?.barCode}</strong>/  <span> {t("productcard.remainder")} {el?.remainder} {t(`units.${el?.measure}`)} </span> </div>
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
            onChange={(event) =>{
              const valid = /^\d*\.?(?:\d{1,2})?$/;
              const text = event.target.value;  
              if(valid.test(text)){
                  handleChangeInput(event)
              }else{
                return 
              }
            }}
          />
          <div style={{margin:"3px",width:"40px", fontSize:"80%"}}>
            {t(`units.${el?.measure}`)}
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
    </div>
  )
}

export default memo(BascketContentItem);
