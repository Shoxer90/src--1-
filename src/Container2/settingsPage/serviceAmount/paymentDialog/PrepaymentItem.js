import React, { memo } from "react" ;
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';

import styles from "./index.module.scss";
import { t } from "i18next";

const PrepaymentItem = ({
  activeRow, 
  index, 
  activeStyle, 
  activateRow, 
  months, 
  price, 
  setPrice, 
  setPaymentData, 
  paymentData 
}) => {
   
  const handleClick = () => {
    setPaymentData({
      ...paymentData,
      months:months
    })
    activateRow(index+1)
    setPrice(price)
  };

  return(
    <div 
      className={styles.subscription_item} 
      onClick={handleClick}
      style={activeRow === index+1 ? activeStyle: null}
    >
      <span>
        <FileDownloadDoneIcon sx={{color:"green",mr:2}} />
        {months} {t("cardService.monthCount")} 
      </span>
      <span style={{width:"20%"}}></span>
      <span>
        {price} {t("units.amd")}
      </span>
  </div>
  )
};

export default memo(PrepaymentItem);
