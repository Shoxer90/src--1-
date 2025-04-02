import React, { memo } from "react";

import styles from "./index.module.scss";

const AttachedCardsItem = ({
  card,
  payData,
  setActivateBtn,
  setPayData,
  setMethod,
  index,
  activeStyle
}) => {

  return (
    <div 
      className={styles.subscription_item}
      style={payData?.cardId === card?.cardId ? activeStyle :null}
    >
      <label>
        <input
          type="radio"
          checked={payData?.cardId === card?.cardId}
          name="pay operation"
          onChange={() => {
            delete payData?.attach
            setActivateBtn(index)
            setMethod(1)
            setPayData({
              ...payData,
              cardId: card?.cardId
            })
          }}
        />
        <span className={styles.inputLabel}  style={{textAlign:"center"}}>
          <span style={{marginRight:"5px"}}>
            {card?.pan[0] == 4 && <img src="/visaNew.png" alt="visaNew" style={{height: "14px", marginBottom:"5px"}} />}
            {card?.pan[0] == 5 && <img src="/master2New.png" alt="masterNew" style={{height: "14px", marginBottom:"5px"}} />}
            {card?.pan[0] == 9 && <img src="/arcaNew.png" alt="arcaNew" style={{height: "13px", marginBottom:"5px"}} />}

            
          </span>
          {" "} <span  style={{textAlign:"center", marginRight:"5px"}}>{card?.bankName} </span>
          <strong style={{letterSpacing:"0.2px",textAlign:"center"}}>{" "} {card?.pan.slice(0,4)} **** {card?.pan.slice(-4)}</strong>  
        </span>
      </label>
    </div>
  )
};

export default memo(AttachedCardsItem);
