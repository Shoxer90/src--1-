import { memo } from "react";
import { Card } from "@mui/material";

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
  setCurrentPage
}) => {
  return (
    <div className={styles.productContent} style={{marginLeft:"25px"}}>
     
      { content && content?.map((product, index) => {
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
        />
      })}
    </div>
  )
}

export default memo(HomeContent);
