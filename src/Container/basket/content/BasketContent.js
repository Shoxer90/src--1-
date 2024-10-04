import { Divider } from "@mui/material";
import React from "react";
import { memo } from "react";
import styles from "../index.module.scss";
import BascketContentItem from "./BaskteContentItem";

const BasketContent = ({
  t,
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
  createMessage}) => {

    
  
  return(
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
            t={t}
            setIsEmpty={setIsEmpty}
            deleteBasketItem={deleteBasketItem}
            changeCountOfBasketItem={changeCountOfBasketItem}
            screen={screen}
            flag={flag}
            setSingleClick={setSingleClick}
            createMessage={createMessage}
            //unused props
            loadBasket={loadBasket}

          
          />
          <Divider sx={{backgroundColor:"gray"}} color="black" />


        </span>
      ))}
    </div>
  )
};

export default memo(BasketContent);
