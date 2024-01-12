import React, { memo } from "react";
import ServiceItemSecond from "./ServiceItemSecond";

import styles from "./index.module.scss";

const Services = ({
  t,
  content,
  payData, 
  logOutFunc,
  setPayData,
  changeActiveCard,
}) => (

  <div className={styles.allservices}>
    {content?.services && content?.services.map((service, index) => (
      <ServiceItemSecond 
        t={t}  key={index}
        service={service}
        content={content}
        changeActiveCard={changeActiveCard}
        payData={payData}
        setPayData={setPayData}
        logOutFunc={logOutFunc}
      />
    ))}
  </div>
);

export default memo(Services);
