import React, { memo } from "react";
import ReverseItem from "../ReverseItem";

const ReverseContent = ({
  products,
  setReverseContainer,
  reverseContainer,
  checkedProduct,
  setReverseTotal,
  saleInfo
}) => {

 

  return(
    products.map((product,index) => (
      <ReverseItem 
        key={product?.id} 
        product={product} 
        checkedProduct={checkedProduct} 
        index={index} 
        products={products}
        setReverseContainer={setReverseContainer}
        reverseContainer={reverseContainer}
        setReverseTotal={setReverseTotal}
        saleInfo={saleInfo}
      />
    ))
  )
};

export default memo(ReverseContent);
