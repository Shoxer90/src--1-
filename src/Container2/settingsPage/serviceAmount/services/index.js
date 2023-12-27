import React, { memo } from "react";
import ServiceItemSecond from "./ServiceItemSecond";
import styles from "./index.module.scss";

const Services = ({
  t,
  userCardInfo,
  content,
  changeActiveCard
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
              userCardInfo={userCardInfo}
              changeActiveCard={changeActiveCard}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(Services);
