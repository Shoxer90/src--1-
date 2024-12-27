import { memo } from "react";
import { Card } from "@mui/material";

import HomeContentItem from "./content/HomeContentItem";

import styles from "./index.module.scss";

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
}) => {
  return (
    <Card className={styles.productContent}>
     
      { content && content.map((product, index) => {
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
        />
      })}
    </Card>
  )
}

export default memo(HomeContent);
