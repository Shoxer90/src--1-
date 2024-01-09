import React, { memo } from "react";
import ServiceItemSecond from "./ServiceItemSecond";
import styles from "./index.module.scss";

const Services = ({
  t,
  content,
  changeActiveCard,
  payData, setPayData,
  logOutFunc
}) => {

  return (
    <div>
      <div className={styles.allservices}>
        {content?.services && content?.services.map((service,index) => (
          <div key={index}>
            <ServiceItemSecond 
              t={t} 
              service={service}
              content={content}
              changeActiveCard={changeActiveCard}
              payData={payData}
              setPayData={setPayData}
              logOutFunc={logOutFunc}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(Services);
