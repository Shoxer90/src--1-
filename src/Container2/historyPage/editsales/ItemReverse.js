import React, { memo, useEffect } from "react";
import { t } from "i18next";

import styles from "./index.module.scss";

const ItemReverse = ({
  photo, brand, name, count, discountedPrice, unit, index,
  reverseContainer,
  setReverseContainer,
  checkedProduct,
  totalCounter
}) => {

  const handleChange = (e) => {
    let isValid = false;
    const data = e.target.value;
    setReverseContainer(reverseContainer.map((item ,i) => {
      if(i === index && +e.target.value <= +count){
        if(unit === "հատ"){
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
  };

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
            checkedProduct(index, e.target.name,e.target.checked)
          }}
          checked={reverseContainer[index]?.isChecked || false}
        />
        <img 
          src={photo || "/default-placeholder.png"} 
          alt="prod"
        />
        <p style={{fontSize:"80%"}}>{brand} {name}</p>
        <span style={{fontSize:"60%"}}>{count} {t(`units.${unit}`)} x {discountedPrice} {t("units.amd")}</span>
      </span>
      <label className={styles.reverse_quantity}>
        <input
          className={styles.reverse_quantity_input}
          autoComplete="off"
          name="quantity"
          value={reverseContainer[index]?.quantity}
          onChange={(e)=>handleChange(e)}
        />
        <span style={{minWidth:"60px"}}>
          {t(`units.${unit}`)}
        </span> 
      </label>
    </label> 
  )
};

export default memo(ItemReverse);
