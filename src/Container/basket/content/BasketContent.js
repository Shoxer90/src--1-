import { Divider } from "@mui/material";
import React from "react";
import { memo } from "react";
import styles from "../index.module.scss";
import BasketContentItem from "./BasketContentItem";

const BasketContent = ({
  basketContent, 
  changeCountOfBasketItem, 
  deleteBasketItem,
  screen,
  avail,
  setAvail,
  flag,
  createMessage,
  freezeCount,
  setOpenEmarkInput,
  setOpenBasket,
  setFrom,

  globalStorageList,
blockTheButton,
setBlockTheButton
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
          screen={screen}
          flag={flag}
          createMessage={createMessage}
          freezeCount={freezeCount}
          setOpenEmarkInput={setOpenEmarkInput}
          setOpenBasket={setOpenBasket}
          setFrom={setFrom}
          globalStorageList={globalStorageList}

          blockTheButton={blockTheButton}
          setBlockTheButton={setBlockTheButton}

        />
        <Divider sx={{backgroundColor:"gray"}} color="black" />
      </span>
    ))}
  </div>
)
}

export default memo(BasketContent);
