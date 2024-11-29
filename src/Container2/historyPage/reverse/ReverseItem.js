import React, { memo, useEffect } from "react";
import { t } from "i18next";

import styles from "./index.module.scss";

const ReverseItem = ({
  product,
  products,
  checkedProduct,
  index,
  setReverseContainer,
  reverseContainer,
  setReverseTotal,
  saleInfo
}) => {

  const totalCounter = async() => {
    if(saleInfo?.res?.printResponseInfo?.partialAmount) {
      setReverseTotal(saleInfo?.res?.printResponseInfo?.totalAmount)
      return
    }
    let total = 0;
    reverseContainer.map((item, i) => {
      if(item?.isChecked) {
       return total+= +(products[i]?.price - products[i]?.price * 0.01* products[i]?.discount  -
         ( products[i]?.price - products[i]?.price * 0.01 * products[i]?.discount) * 0.01 * saleInfo?.res?.printResponseInfo?.items[0]?.additionalDiscount) *
        reverseContainer[i]?.quantity
      }else{
        return item
      }
    })
    await setReverseTotal(total)
  }; 

  const handleChange = (e) => {
    let isValid = false;
    const data = e.target.value;
    setReverseContainer(reverseContainer.map((item ,i) => {
      if(i === index && !(+e.target.value > +product?.count)){
        if(product?.unit === "հատ"){
          const needSymb = /^[0-9]*$/;
          isValid = needSymb.test(data)
          if(isValid || e.target.value === "") {
            return{
              ...item,
              [e.target.name]: Math.round(+e.target.value)
            }
          }else{
            return item
          }
        }else{
          const needSymb = /^\d+(\.\d{0,3})?$/
          isValid = needSymb.test(data)
          if(isValid || e.target.value === "") {
            if (e.target.value[`${e.target.value}`.length - 1] === "."){
              return {
                ...item,
                [e.target.name]: e.target.value
              }
            }else{ 
              return{
              ...item,
              [e.target.name]: +e.target.value
              }
            }
          }else if (e.target.value === "0" || e.target.value === "."){
            return {
              ...item,
              [e.target.name]: "0."
            }
          }
          return item
        }
      }else{
        return item
      }
    }))
  }

  useEffect(() => {
    totalCounter()
  },[reverseContainer]);

  return(
    <label className={styles.radioDialog}>
      <span style={{display:"flex",alignItems:"center"}}>
        <input 
          type="checkbox"
          name="isChecked"
          onChange={(e)=>{
            if(saleInfo?.res?.printResponseInfo?.partialAmount > 0) return
            checkedProduct(index, e.target.name, e.target.checked)
          }}
          // checked={saleInfo?.res?.printResponseInfo?.partialAmount > 0 ? true: null}
          checked={reverseContainer[index]?.isChecked}
          readOnly={saleInfo?.res?.printResponseInfo?.partialAmount > 0 ? true : false}
        />
        <img 
          src={product?.photo || "/default-placeholder.png"} 
          alt="prod" 
          style={{width:"40px",height:"30px",border:"solid grey 1px",borderRadius:"2px",alignSelf:"center",margin:"2px"}} 
        />
        <p style={{fontSize:"80%"}}>{product?.brand} {product?.name}</p>
        <span style={{fontSize:"60%"}}>{product?.count}ԳԳԳԳԳԳԳԳԳԳԳԳԳ {t(`units.${product?.unit}`)} x {product?.discountedPrice} {t("units.amd")}</span>
      </span>
      <label className={styles.reverse_quantity}>
        <input
          autoComplete="off"
          name="quantity"
          value={reverseContainer[index]?.quantity}
          onChange={(e)=>handleChange(e)}
        />
        <div style={{width:"4px"}}>{" "}</div>
        <span style={{minWidth:"40px"}}>
          {t(`units.${product?.unit}`)}
        </span> 
      </label>
    </label> 
  )
};

export default memo(ReverseItem);
