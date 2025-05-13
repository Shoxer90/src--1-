import { memo, useEffect, useRef, useState } from "react";
import { payForOrderList } from "../../../services/pay/pay";
import { Dialog } from "@mui/material";
import Loader from "../../loading/Loader";
import styles from "./index.module.scss";

 const BankButton = ({
  title, 
  paymentType, 
  saleId, 
  icon, 
  createActiveBtn, 
  activeBtn}) => {

  const activeStyle={
    transform: "scale(1.15)", /* немного увеличиваем */
    boxShadow: "0 4px 12px rgba(63, 182, 138, 0.85)"
  }

  return (
    <div className={styles.payItem} style={activeBtn === paymentType? activeStyle: null} onClick={()=>createActiveBtn(paymentType)}>
    
        <img src={icon} alt={title} style={{height: "20px"}} />
   
   
  </div>
  )

};
export default memo(BankButton);
