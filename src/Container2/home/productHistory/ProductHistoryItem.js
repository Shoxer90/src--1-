import { memo } from "react";

const ProductHistoryItem =({item, product, index}) => {
  return (
    <div style={{fontWeight: "bold"}}>
      {index+1}. {product?.name}  "{product?.brand}"- {item?.action} - {item?.createDate}

    </div>
  )
};

export default memo(ProductHistoryItem);
