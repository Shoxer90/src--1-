import React, { useState, memo, useEffect } from "react";
import { getServiceHistoryAndPayAmount } from "../../../../services/cardpayments/internalPayments";
import ServiceItemSecond from "./ServiceItemSecond";
import styles from "./index.module.scss";

const Services = ({
  t,
  userCardInfo,
  changeActiveCard
}) => {
  const [serviceTypes, setServiceTypes] = useState([]);
  
  const getServiceAmountHistory = async() => {
    await getServiceHistoryAndPayAmount().then((res) => {
      setServiceTypes(res)
    })
  }

  useEffect(() => {
    getServiceAmountHistory()
  }, []);

  return (
    <div >
      <div className={styles.allservices}>
      {serviceTypes && serviceTypes.map((service,index) => (
        <div key={index}>
          {service?.title !== "Attach" &&
            <ServiceItemSecond 
              t={t} 
              service={service}
              userCardInfo={userCardInfo}
              changeActiveCard={changeActiveCard}
            />
          }
        </div>
      ))}
      </div>
    </div>
  );
};

export default memo(Services);
