import React, {memo}  from "react";
import styles from "./index.module.scss";

const ReceiptFooter = ({receiptInfo}) => {
  return(
  <div>
      {receiptInfo?.receiptType !== 3 ?

      <div className={styles.receiptFooter}>
        <div> Վճարման ենթակա  {receiptInfo?.totalAmount.toFixed(2)} դրամ </div>
        <div> Առձեռն  {(receiptInfo?.cashAmount.toFixed(2))} դրամ </div>
        <div> Անկանխիկ  {(receiptInfo?.cardAmount.toFixed(2))} դրամ</div>
        <div> Կանխավճարի օգտագործում  {(receiptInfo?.prePayment.toFixed(2))} դրամ</div>
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
