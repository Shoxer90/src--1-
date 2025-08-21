import { memo } from "react";

const ProductSaleHistoryItem = ({ item, product, index}) => {
  return (
    <div>
      {index+1}. {item?.productName} - {item?.action} - {item?.createDate}
    </div>
  )
};

export default memo(ProductSaleHistoryItem);

