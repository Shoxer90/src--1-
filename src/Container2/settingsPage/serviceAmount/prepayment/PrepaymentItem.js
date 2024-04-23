import React, { memo } from "react" ;

import styles from "../paymentDialog/index.module.scss"
import { t } from "i18next";

const PrepaymentItem = ({
  index, 
  activateRow, 
  months, 
  price, 
  setPaymentData, 
  paymentData,
  activeStyle
}) => {
   
  const handleClick = (e) => {
     setPaymentData({
     ...paymentData,
      daysEnum:months,
    })
    activateRow(index+1)
  };

  return(
    <div 
      className={styles.subscription_item} 
      onClick={handleClick}
      style={paymentData?.daysEnum === months ? activeStyle :null}
    >
      <label style={{display:"flex",justifyContent:"space-between"}}>
        <input
          style={{marginRight:"17px"}}
          type="radio"
          value={months}
          checked={paymentData?.daysEnum === months}
          name="months"
          onChange={(e)=> handleClick(e)}
        />
          <div style={{width:"80px"}}>
            {months * 30} {t("cardService.dayCount2")} 
          </div>
          <div style={{margin: "2px 2px 2px 100px"}}>
            {price} {t("units.amd")}
          </div>
      </label>
      
  </div>
  )
};

export default memo(PrepaymentItem);
