import { memo } from "react";

const ProductHistory =({item, product, index, dateFormat}) => {
  
  return (
    <div style={{fontWeight: "bold"}}>
     <div> {index+1}. {product?.name}  "{product?.brand}" {dateFormat(item?.createDate)}</div>
     <div> changedDiscount {item?.changedDiscount}</div>
     <div> changedDiscountedPrice {item?.changedDiscountedPrice}</div>
     <div> changedPrePaymentRemainder {item?.changedPrePaymentRemainder}</div>
     <div> changedPrice { item?.changedPrice}</div>
     <div> finalDiscount { item?.finalDiscount}</div>
     <div> finalDiscountedPrice { item?.finalDiscountedPrice}</div>
     <div> finalPrePaymentRemainder { item?.finalPrePaymentRemainder}</div>
     <div> finalPrice { item?.finalPrice}</div>
     <div> finalRemainder { item?.finalRemainder}</div>
     <div> initialDiscount { item?.initialDiscount}</div>
     <div> initialDiscountedPrice { item?.initialDiscountedPrice}</div>
     <div> initialPrePaymentRemainder { item?.initialPrePaymentRemainder}</div>
     <div> initialPrice { item?.initialPrice}</div>
     <div> initialRemainder { item?.initialRemainder}</div>
    </div>
  )
};

export default memo(ProductHistory);
