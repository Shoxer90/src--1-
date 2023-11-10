import React, { memo, useRef, useState } from 'react';
import styles from "./index.module.scss"
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect } from 'react';

const BascketItem = ({el, avail, setAvail,t, deleteBasketItem, changeCountOfBasketItem, screen,flag,setSingleClick,singleClick}) => {
  const[quantity,setQuantity] = useState();
  const [notAvailable, setNotAvailable] = useState(false);

  const ref = useRef();

  const handleChangeInput = async(e) => {
    setSingleClick({
      "cash": false,
      "card": false,
      "qr": false,
      "link": false
    })
    ref.current.style.color=""
    ref.current.style.border=""
    ref.current.style.fontSize=""
    if(e.target.value === "" || e.target.value ===0){
      ref.current.style.border="solid red 2px"
      ref.current.style.color="red"
    }
   if(e.target.value.indexOf("-") !== -1 || e.target.value.indexOf("+") !== -1){
      setQuantity(+e.target.value * -1)
      changeCountOfBasketItem( el?.id, +e.target.value * -1)
      return
    }
    if(+e.target.value > el?.remainder){
    setQuantity(el?.remainder)
      ref.current.style.color="red"
      ref.current.style.fontSize="110%"
      ref.current.style.border="solid red 2px"
     return changeCountOfBasketItem( el?.id, el?.remainder)  
    }
    if (el?.otherLangMeasure === "հատ" && e.target.value.indexOf(".") !== -1 ) {
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
  }, [flag]);

  useEffect(() => {
    avail?.length ? 
    avail.map((item) =>{
      return item === el?.id ? setNotAvailable(true) : setNotAvailable(false)
    }): setNotAvailable(false)
  }, [avail]);
  return (
    <div className={styles.basketContent_item} style={{border:notAvailable? "red solid 2px":"none",background:notAvailable? "pink":"none"}}> 
      {screen > 500 && <div className={styles.basketContent_item_image}>
        <img
          src= {el?.photo || "/default-placeholder.png"}
          alt="img"
        />
      </div>}
        <div className={styles.basketContent_item_info}>
          <div 
            className={styles.basketContent_item_info_title} 
            style={{fontSize:el?.name?.length>14? "80%": "90%"}}
          >
            <span className={styles.hovertext} data-hover= {el.name}>
              {el?.name?.length>20 ? `${el?.name.slice(0,20)}...` : el?.name}
            </span>
          </div>
            <span> {t("productcard.remainder")} {el?.remainder} {t(`units.${el?.measure}`)} </span> 
          <div className={styles.basketContent_item_info_price}> 
            <span>{el?.price} {t("units.amd")} </span> 
            { el?.discount > 0 &&  
              <span style={{color:"red"}}> 
                /{(el?.discountPrice).toFixed(2)} {t("units.amd")}
              </span>
            }
          </div>
        </div>
        <div className={styles.basketContent_item_quantity}>
          <input
            ref={ref}
            style={{ minWidth:"100px"}}
            min={el?.otherLangMeasure === "հատ" ? "1" :"0.001"}
            step={el?.otherLangMeasure === "հատ" ? "1": "0.001"}
            max={`${el?.remainder}`}
            value={el?.count}
            onChange={(e) =>{
              if(isNaN(e.target.value))return
              handleChangeInput(e)
            }}
          />
          <div style={{margin:"3px"}}>
            {t(`units.${el?.measure}`)}
          </div>
        </div>
        <div 
          className={styles.basketContent_item_garbage}
          onClick={()=> {
            notAvailable && setAvail(avail.filter(item => item!==el.id))
            deleteBasketItem(el.id)
          }}
        >
          <DeleteIcon fontSize="medium" sx={{"&:hover":{color:"green"}}} />
        </div>
    </div>
  )
}

export default memo(BascketItem);
