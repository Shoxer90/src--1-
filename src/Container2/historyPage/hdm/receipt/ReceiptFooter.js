import React, {memo}  from "react";
import styles from "./index.module.scss";

const ReceiptFooter = ({totalPrice, receiptInfo}) => {
  return(
  <div>
      {receiptInfo?.receiptType !== 3 ?

      <div className={styles.receiptFooter}>
        {/* <div> Ընդամենը  {totalPrice?.toFixed(2)} դրամ </div> */}
        {/* {receiptInfo?.items && */}
           {/* <div> Ընդհանուր զեղչ։ {receiptInfo?.items[0]?.additionalDiscount || 0} % = {(totalPrice - receiptInfo?.totalAmount).toFixed(2)} դրամ </div>
           <div> Ընդհանուր զեղչ  {receiptInfo?.items[0]?.additionalDiscount || 0} % = {(totalPrice - receiptInfo?.totalAmount).toFixed(2)} դրամ </div>
        } */}
        <div> Վճարման ենթակա  {receiptInfo?.totalAmount.toFixed(2)} դրամ </div>
        <div> Առձեռն  {(receiptInfo?.cashAmount.toFixed(2))} դրամ </div>
        <div> Անկանխիկ  {(receiptInfo?.cardAmount.toFixed(2))} դրամ</div>
        <div> Կանխավճար  {(receiptInfo?.prePayment.toFixed(2))} դրամ</div>
        {/* <div> Փոխհատուցում  {(receiptInfo?.partialAmount.toFixed(2))} դրամ </div> */}
      </div> : 
      <div className={styles.receiptFooter}>
        <div> Ընդամենը {receiptInfo?.totalAmount.toFixed(2)} դրամ </div>
        <div> Առձեռն  {(receiptInfo?.cashAmount.toFixed(2))} դրամ </div>
        <div> Անկանխիկ  {(receiptInfo?.cardAmount.toFixed(2))} դրամ</div>
      </div> 
      }
  </div>
   );
}

export default memo(ReceiptFooter);
