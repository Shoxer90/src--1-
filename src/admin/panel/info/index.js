import { memo, useEffect, useState } from "react";

import styles from "./index.module.scss";
import RightInfo from "./RightInfo";
import LeftInfo from "./LeftInfo";
import { useSelector } from "react-redux";

const CustomerInfo = () => {
  const customerInfo = useSelector(state => state?.customer?.info);
  const [customer, setCustomer] = useState({})

  useEffect(() => {
    if(customerInfo?.length) {
      setCustomer(customerInfo)
    }else{
      setCustomer(JSON.parse(localStorage.getItem("customer")))
    }
  }, [])
  return (
    <div className={styles.info}>
      <LeftInfo customerInfo={customer} />
      <RightInfo customerInfo={customer} />
    </div>
  )
};

export default memo(CustomerInfo);
