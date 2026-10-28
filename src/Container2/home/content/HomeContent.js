

import { memo } from "react";

import HomeContentItem from "./HomeContentItem";
import MarketXProductCard from "./MarketXProductCard";

import styles from "../index.module.scss";

const HomeContent = ({
  measure,
  setToBasket, 
  content, 
  deleteAndRefresh, 
  deleteBasketItem,
  basketExist,
  getSelectData,
  typeCode,
  setTypeCode,
  setFetching,
  setContent,
  setCurrentPage,
  setOpenBasket,
  setBasketContent,
  setFrom,
  selectMode,
  selectedProductIds,
  onToggleSelect,
  isMarketX,
}) => {
  return (
    content && <div className={styles.productContent} style={{marginLeft:"25px"}}>
     
      {content?.map((product, index) => {
        if (isMarketX) {
          return (
            <MarketXProductCard
              key={product?.id ?? index}
              product={product}
              index={index}
              measure={measure}
              deleteAndRefresh={deleteAndRefresh}
              deleteBasketItem={deleteBasketItem}
              getSelectData={getSelectData}
              typeCode={typeCode}
              setTypeCode={setTypeCode}
              setContent={setContent}
              content={content}
              setCurrentPage={setCurrentPage}
            />
          );
        }
        return   <HomeContentItem
          key={index}
          setToBasket={setToBasket}
          basketExist={basketExist}
          deleteAndRefresh={deleteAndRefresh}
          product={product} 
          deleteBasketItem={deleteBasketItem}
          measure={measure}
          index={index}
          getSelectData={getSelectData}
          typeCode={typeCode}
          setTypeCode={setTypeCode}
          setFetching={setFetching}
          setContent={setContent}
          content={content}
          setCurrentPage={setCurrentPage}
          setOpenBasket={setOpenBasket}

          setBasketContent={setBasketContent}
          setFrom={setFrom}
          selectMode={selectMode}
          isSelected={selectedProductIds?.includes(product?.id)}
          onToggleSelect={onToggleSelect}
        />
      })}
    </div>
  )
}

export default memo(HomeContent);
