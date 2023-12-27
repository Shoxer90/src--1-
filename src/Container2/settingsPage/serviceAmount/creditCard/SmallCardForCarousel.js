import React, { memo } from "react";
import { setActiveCard } from "../../../../services/internal/InternalPayments";

import styles from "./index.module.scss";

const SmallCardForCarousel = ({card, refresh, setRefresh}) => {
  return(
    <div className={styles.smallCard}>
      <div>{card?.bankName}</div>
      <div>{card?.pan}</div>
      <div className={styles.smallCard_checkbox}>
        <input
          type="radio"
          name="active card"
          value={card?.isActive}
          onChange={()=>{
            setActiveCard(card?.cardId)
            setRefresh(!refresh)
          }}
        />
      </div>
    </div>
  )
};

export default memo(SmallCardForCarousel);
