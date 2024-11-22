import { Divider } from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import styles from "../index.module.scss";
import { useTranslation } from "react-i18next";
const HistoryDetailsItem = ({
unit,
name,
index,
brand,
count,
price,
discount,
discountType,
adgCode
}) => {
  const [prodPrice, setProdPrice] = useState();
  const {t} = useTranslation();
  useEffect(() => {
    if(discount) {
      discountType === 2 ? setProdPrice(price - discount):
      setProdPrice((price - price * discount / 100).toFixed(2))
      
    }else{
      setProdPrice(price)
    }
  }, []);

  return (
    <div style={{fontSize:"90%",padding:"1px 6px"}}>
      <div className={styles.rowFlexBetween}>
        <strong> {index+1}. {brand} {name} </strong> 
        <span>( { adgCode} ) </span>
      </div>  
      <div>
       <span >{t("productinputs.price")} {price} </span> 
        {discount ?
          <span >
            {discountType === 2 ?
              <>
                <span> / {t("productcard.discount")} {" "}{price - discount}  </span> 
              </>:
              <>
                <span> / {t("productcard.discount")}{" "} {discount} % = { (price *  discount / 100 ).toFixed(2)} {t("units.amd")} </span> 
              </>
            } 
          </span>
        : ""} 
      </div>
      <div className={styles.rowFlexBetween} style={{padding:" 0px 15px"}}>
        <span>
        {prodPrice} 
        </span>
        <span> x </span>
        <span>{count} {t(`units.${unit}`)} </span>
        <span>= </span>
        <span>{(count * prodPrice).toFixed(2)}{t("units.amd")}</span>
      </div>
      <Divider color="black" />
    </div>
  )
};

export default memo(HistoryDetailsItem);
