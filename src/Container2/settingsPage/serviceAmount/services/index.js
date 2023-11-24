import React, { useState, memo, useEffect } from "react";
import { getServiceHistoryAndPayAmount } from "../../../../services/cardpayments/internalPayments";
import ServiceItemSecond from "./ServiceItemSecond";
import { Checkbox, FormControlLabel } from "@mui/material";

import styles from "./index.module.scss";

const Services = ({
  t,
  payForSeveralServices,
  paymentAmount,
  setPaymentAmount
}) => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [payData,setPayData] = useState();
  
  const getServiceAmountHistory = async() => {
    await getServiceHistoryAndPayAmount().then((res) => {
    res.forEach((item, index) => {
      if(index === 0) {
        setPayData({
          "serviceType": 0,
          "price": +item?.price - item?.serviceChargeBalance,
          "isBinding": true
        })
      }
    })
    setServiceTypes(res)
   })
  }

console.log(serviceTypes,"SERVICE TYPES")
console.log(payData,"PAY DATA")

  useEffect(() => {
    getServiceAmountHistory()
  }, []);

  return (
    <div >
      <div className={styles.allservices}>
      {serviceTypes && serviceTypes.map((service,index) => (
        <ServiceItemSecond 
          key={index}
          t={t} 
          service={service}
          payForSeveralServices={payForSeveralServices}
          paymentAmount={paymentAmount}
          setPaymentAmount={setPaymentAmount}
        />
      ))}
      </div>
    </div>
  );
};

export default memo(Services);
