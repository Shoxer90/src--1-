import React, { memo } from "react";
import ServiceItemSecond from "./ServiceItemSecond";

import styles from "./index.module.scss";
import ServiceItemV2 from "./ServiceItemV2";

const ServicesV2 = ({
  content,
  isDelete,
  payData, 
  setPayData,
  serviceType,
  refresh, 
  setRefresh,
}) => {
  


  return(
    <div className={styles.allservices}>
      {content?.services && content?.services.map((service, index) => (
        <ServiceItemV2
          key={index}
          service={service}
          content={content}
          isDelete={isDelete}
          payData={payData}
          setPayData={setPayData}
          serviceType={serviceType}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      ))}
       {/* {content?.services && content?.services.map((service, index) => (
        <ServiceItemSecond 
          key={index}
          service={service}
          content={content}
          isDelete={isDelete}
          payData={payData}
          setPayData={setPayData}
          serviceType={serviceType}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      ))} */}
    </div>
  )
};

export default memo(ServicesV2);
