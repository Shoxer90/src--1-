import React from "react";
import { memo } from "react";
import styles from "./index.module.scss";
import { Divider } from "@mui/material";

const ReceiptItem = ({
  goodName,
  brand,
  adgCode,
  goodCode,
  price,
  discount,
  unit,
  quantity,
  i,
}) => {

  return(
    <div> 
      <div>
        {i+1}. ( { adgCode} )  Ն/Կ {goodCode}
      </div>
      <div>
        {goodName}{ brand}
      </div>
      <div>Գին: { price} դրամ</div> 
      {discount ?
        <div > 
          Զեղչված գին: {(price -  price *  discount / 100).toFixed(2)} դրամ
        </div> :""
      } 
      <div>
        <div className={styles.contentName_info}>
          <span>
            {(price -  price *  discount / 100).toFixed(2)}
          </span>
          <span> x </span>
          <span> {quantity} 
          </span>
          <span> = </span>
          <span>
          {Math.floor((price - price*discount/100)*quantity*100)/100} դրամ
          </span>
        </div>
        <Divider sx={{bgcolor:"black"}} />
      </div>
    </div>
  ) 
};

export default memo(ReceiptItem);
