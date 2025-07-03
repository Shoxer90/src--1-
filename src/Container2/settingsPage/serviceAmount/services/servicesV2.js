import { memo, useEffect, useState } from "react";
import ServiceItemV2 from "./ServiceItemV2";

import styles from "./index.module.scss";
import { getPaymenTypesArcaOther } from "../../../../services/internal/InternalPayments";

const ServicesV2 = ({
  content,
  isDelete,
  payData, 
  setPayData,
  serviceType,
  refresh, 
  setRefresh,
}) => {
  const [paymentType, setPaymentType] = useState([]);

  useEffect(() => {
    !paymentType?.length && getPaymenTypesArcaOther().then((res) => {
      setPaymentType(res)
    });
  }, []);
  

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
          paymentType={paymentType}
          setPaymentType={setPaymentType}
        />
      ))}
    </div>
  )
};

export default memo(ServicesV2);
