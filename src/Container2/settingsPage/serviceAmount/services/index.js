import React, { memo } from "react";
import ServiceItemSecond from "./ServiceItemSecond";

import styles from "./index.module.scss";

const Services = ({
  content,
  isDelete,
  payData, 
  logOutFunc,
  setPayData,
  serviceType,
  refresh, setRefresh
}) => {

  return(
    <div className={styles.allservices}>
      {content?.services && content?.services.map((service, index) => (
        <ServiceItemSecond 
          key={index}
          service={service}
          content={content}
          isDelete={isDelete}
          payData={payData}
          logOutFunc={logOutFunc}
          setPayData={setPayData}
          serviceType={serviceType}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      ))}
    </div>
  )
};

export default memo(Services);
