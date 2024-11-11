import React, { memo } from "react";
import styles from "./index.module.scss";


const ReceiptPartners = ({partner, userName,taxCount, date, saleData,buildedData}) => {
  return(
    <div className={styles.receiptPartner}>
      {partner?.printResponse?.commercial_name && <span>"{partner?.printResponse?.commercial_name} "</span>}
      {partner?.printResponse?.commercial_address && <span>{partner?.printResponse?.commercial_address}</span>}
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <div style={{display:"flex",flexFlow:"column"}}>
          <span>{partner?.printResponse?.taxpayer}</span>
          <span>{partner?.printResponse?.address}</span>
        </div>
        {partner?.printResponse?.logo && <img alt="" src={partner?.printResponse?.logo} style={{height:"50px",width:"50px"}}/>}
      </div>
      <span>{window.location.origin}</span>
      <div style={{display:'flex', justifyContent:"space-between"}}>
        <div style={{display:'flex', justifyContent:"flex-start",flexDirection:"column"}}>
          <span>ՀՎՀՀ: {partner?.printResponse?.tin}</span>
          <span> ՍՀ: {partner?.printResponse?.sn} </span>
          <span> Գ/Հ։ {partner?.printResponse?.crn} </span>
          <span style={{width:"120px"}}> {`${date.slice(0,10)} ${date.slice(11,19)}  `}</span>
        </div>
        <div>{"  "}</div>
        <div style={{display:'flex', justifyContent:"flex-start", flexDirection:"column"}} >
          <span> ԿՀ : {partner?.recieptId}</span>
          <span> Դրամարկղ: 1 </span>
          <span> Գանձապահ։ {userName}</span>
          <span>{` Գնորդի ՀՎՀՀ`}։ {partner?.printResponseInfo?.partnerTin} </span>
        </div>  
      </div>
      <span style={{border:"dashed black 1px", width:"100%"}}></span> 
       
    </div>
  )
};

export default memo(ReceiptPartners);
