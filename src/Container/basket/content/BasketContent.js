import { Divider } from "@mui/material";
import React from "react";
import { memo } from "react";
import styles from "../index.module.scss";
import BasketContentItem from "./BasketContentItem";

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
  createMessage,
  freezeCount,
}) => {

  return (
  <div className={styles.bask_container_body}>
    <Divider style={{margin:1,backgroundColor:"gray"}} />
    {basketContent && basketContent?.map((el, i) => (
      <span key={i}>
        <BasketContentItem 
          el={el}
          avail={avail}
          setAvail={setAvail}
          deleteBasketItem={deleteBasketItem}
          changeCountOfBasketItem={changeCountOfBasketItem}
          paymentInfo={paymentInfo}
          screen={screen}
          flag={flag}
          createMessage={createMessage}
          //unused props
          setSingleClick={setSingleClick}
          freezeCount={freezeCount}
        />
        <Divider sx={{backgroundColor:"gray"}} color="black" />
      </span>
    ))}
  </div>
)
}

export default memo(BasketContent);
