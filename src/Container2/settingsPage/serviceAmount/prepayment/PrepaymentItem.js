import React, { memo } from "react" ;

import { useTranslation } from "react-i18next";
import { formatNumberWithSpaces } from "../../../../modules/modules";

import styles from "../paymentDialog/index.module.scss";

const PrepaymentItem = ({
  index, 
  activateRow, 
  months, 
  price, 
  setPaymentData, 
  paymentData,
  activeStyle,
  id
}) => {
  const {t} = useTranslation();
   
  const handleClick = (e) => {
     setPaymentData({
     ...paymentData,
      daysEnum: months,
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
          {id !==6 ? <div style={{width:"80px"}}>
              {months * 30} {t("cardService.dayCount2")} 
            </div>:
            <div style={{width:"80px"}}>
              {months * 100} SMS
            </div>
          } 
          <div style={{margin: "2px 2px 2px 100px"}}>
            {formatNumberWithSpaces(price)} {t("units.amd")}
          </div>
      </label>
      
  </div>
  )
};

export default memo(PrepaymentItem);
