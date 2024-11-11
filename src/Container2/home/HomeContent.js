import { Card } from "@mui/material";
import React from "react";
import { memo } from "react";

import HomeContentItem from "./HomeContentItem";

import styles from "./index.module.scss";

const HomeContent = ({
  t, i18n,
  setToBasket, 
  content, 
  deleteAndRefresh, 
  changeStatus,
  basketExist,
  deleteBasketItem,
  dataGroup,
  measure,
  selectContent,
  getSelectData,
  typeCode,
  setTypeCode,
  setFetching,
  user,
  setContent,
  // content
}) => {
  
  return (
    <Card className={styles.productContent}>
     
      { content && content.map((product, index) => {
        return <div key={index}>
          <HomeContentItem
            t={t} i18n={i18n} 
            measure={measure}
            setToBasket={setToBasket}
            basketExist={basketExist}
            deleteAndRefresh={deleteAndRefresh}
            changeStatus={changeStatus}
            deleteBasketItem={deleteBasketItem}
            product={product} 
            index={index}
            dataGroup={dataGroup}
            selectContent={selectContent}
            getSelectData={getSelectData}
            typeCode={typeCode}
            setTypeCode={setTypeCode}
            user={user}
            setFetching={setFetching}
            setContent={setContent}
            content={content}
          />
        </div>
      })
      // :<h1 style={{color:"lightgray",margin:"40px auto",height:"70dvh"}}>{t("productinputs.nonProduct")}</h1>
      }
    </Card>
  )
}

export default memo(HomeContent);
