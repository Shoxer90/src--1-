import { memo, useState } from "react";

import { Divider } from "@mui/material";

import CustomerFilterTab from "./filter/CustomerFilterTab";

 const CustomerPage = ({children}) => {
  const [filterVisibility, setFilterVisibility] = useState({
    statusSelect: true,
    collumnNames: true,
    datePicker: true
  })
  
  return (
    <div>
      <CustomerFilterTab filterVisibility={filterVisibility} />
      <Divider />
      {children}
    </div>
  )
};

export default memo(CustomerPage);
 