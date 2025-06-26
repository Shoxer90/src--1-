import React, { memo } from "react";

import styles from "./index.module.scss";
import paymentType from "../pay/paymentType";

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
      style={payData?.cardId === card?.cardId  && payData?.paymentType === 1 ? activeStyle :null}
    >
      <label>
        <input
          type="radio"
          checked={payData?.cardId === card?.cardId && payData?.paymentType === 1 }
          name="pay operation"
          onChange={() => {
            delete payData?.attach
            setActivateBtn(index)
            setMethod(1)
            setPayData({
              ...payData,
              cardId: card?.cardId,
              paymentType: 1
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
