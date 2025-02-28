import { memo } from "react";
import SaleTypeSelect from "./SaleTypeSelect";
import CollumnSelect from "./CollumnSelect";

import styles from "../index.module.scss"

const CustomerFilterTab = ({filterVisibility}) => {
  return(
    <div className={styles.customer_filterPanel}>
      
      {filterVisibility?.collumnNames && <CollumnSelect />}
      {filterVisibility?.statusSelect && <SaleTypeSelect />}
      {filterVisibility?.datePicker && <div>DATEPICKER </div>}
      
    </div>
  )
};

export default memo(CustomerFilterTab);
