

import { memo } from "react";

import HomeContentItem from "./HomeContentItem";

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
}) => {
  return (
    content && <div className={styles.productContent} style={{marginLeft:"25px"}}>
     
      {content?.map((product, index) => {
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
