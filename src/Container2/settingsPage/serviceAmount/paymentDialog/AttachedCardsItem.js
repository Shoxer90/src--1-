import React, { memo } from "react";
import { t } from "i18next";

import styles from "./index.module.scss";

const AttachedCardsItem = ({
  card,
  payData,
  setActivateBtn,
  setPayData
}) => {
  return (
    <div className={styles.circleBorder}>
      <label>
        <input
          type="radio"
          name="pay operation"
          
          onChange={() => {
            delete payData?.attach
            setActivateBtn(1)
            setPayData({
              ...payData,
              cardId: card?.cardId
            })
          }}
        />
        <span className={styles.inputLabel}>
          {card?.pan.slice(0,4)} **** **** {card?.pan.slice(-4)} <strong style={{letterSpacing:"0.5px"}}> {card?.bankName}</strong>
        </span>
      </label>
    </div>
  )
};

export default memo(AttachedCardsItem);
