import React, { memo } from "react";

const ServiceTitle = ({title}) => {
  return(
    <div style={{width:"fit-content",fontSize:"130%", margin:"20px 30px 5px 30px"}}>
      <h3 style={{fontWeight:700}}>
        {title}
      </h3>
    </div>
  )
};

export default memo(ServiceTitle);
