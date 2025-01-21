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
  totalWithTaxes,
  additionalDiscount,
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
      <div> Զեղչ`  {discount?.toFixed(2) || 0} % </div>
      <div> Լրացուցիչ զեղչ՝ {additionalDiscount || 0} %</div>
      <div>
        <div className={styles.contentName_info}>
          <span>
            {totalWithTaxes?.toFixed(2)}
          </span>
          <span> x </span>
          <span> {quantity?.toFixed(2)} {unit}
          </span>
          <span> = </span>
          <span>
          {(totalWithTaxes*quantity)?.toFixed(2)} դրամ
          </span>
        </div>
        <Divider sx={{bgcolor:"black"}} />
      </div>
    </div>
  ) 
};

export default memo(ReceiptItem);
