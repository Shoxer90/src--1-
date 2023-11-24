import { Divider } from "@mui/material";
import React from "react";
import { memo } from "react";
import styles from "../index.module.scss";
import BascketContentItem from "./BaskteContentItem";

const BasketContent = ({t,
  basketContent, 
  changeCountOfBasketItem, 
  deleteBasketItem,
  screen,
  setFlag,
  flag,
  setSingleClick,
  singleClick,
  avail,
  paymentInfo, 
  setAvail,
  loadBasket,
  setIsEmpty,
  createMessage}) => {
  
  return(
    <div className={styles.bask_container_body}>
      <Divider style={{margin:1,backgroundColor:"gray"}} />
      {basketContent && basketContent?.map((el, i) => (
        <span key={i}>
          <BascketContentItem 
            changeCountOfBasketItem={changeCountOfBasketItem}
            deleteBasketItem={deleteBasketItem}
            loadBasket={loadBasket}
            el={el}
            t={t}
            index={i}
            screen={screen}
            setFlag={setFlag}
            flag={flag}
            setSingleClick={setSingleClick}
            singleClick={singleClick}
            avail={avail}
            setAvail={setAvail}
            paymentInfo={paymentInfo}
            createMessage={createMessage}
            setIsEmpty={setIsEmpty}
          />
          <Divider sx={{backgroundColor:"gray"}} color="black" />


        </span>
      ))}
    </div>
  )
};

export default memo(BasketContent);
