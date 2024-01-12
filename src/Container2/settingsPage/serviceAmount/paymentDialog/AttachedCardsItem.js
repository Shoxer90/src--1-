import React, { memo } from "react";
import styles from "./index.module.scss";
import { t } from "i18next";

const AttachedCardsItem = ({
  circleBorder,
  card,
  payData,
  setActivateBtn,
  setPayData
}) => {
  return (
    <div style={circleBorder}>
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
          {card?.pan.slice(0,4)} **** **** {card?.pan.slice(-4)}
          {card?.isActive && 
          <span style={{fontSize:"70%",color:"green",marginLeft:"5px",letterSpacing:"1px"}}>({t("settings.active")})</span>}
        </span>
      </label>
    </div>
  )
};

export default memo(AttachedCardsItem);
