import { Divider } from "@mui/material";
import React from "react";
import { memo } from "react";
import styles from "../index.module.scss";
import BascketContentItem from "./BaskteContentItem";

const BasketContent = ({
  avail,
  paymentInfo, 
  setAvail,
  basketContent, 
  changeCountOfBasketItem, 
  deleteBasketItem,
  screen,
  flag,
  setSingleClick,
  loadBasket,
  setIsEmpty,
  createMessage,
  totalPrice,
  freezeCount
}) => {

  return (
  <div className={styles.bask_container_body}>
    <Divider style={{margin:1,backgroundColor:"gray"}} />
    {basketContent && basketContent?.map((el, i) => (
      <span key={i}>
        <BascketContentItem 
          index={i}
          el={el}
          avail={avail}
          setAvail={setAvail}
          paymentInfo={paymentInfo}
          setIsEmpty={setIsEmpty}
          deleteBasketItem={deleteBasketItem}
          changeCountOfBasketItem={changeCountOfBasketItem}
          screen={screen}
          flag={flag}
          setSingleClick={setSingleClick}
          createMessage={createMessage}
          //unused props
          loadBasket={loadBasket}
          totalPrice={totalPrice}
          freezeCount={freezeCount}
        />
        <Divider sx={{backgroundColor:"gray"}} color="black" />
      </span>
    ))}
  </div>
)
}


export default memo(BasketContent);
