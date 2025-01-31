import React, { memo } from 'react';
import { Button, Divider } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';

import styles from "./index.module.scss";

const OrderListPayInfo = ({basketContent,t}) => {
  return (
    <div className={styles.orderContainer_payContainer}>
        { basketContent?.partnerTin  && 
        <div className={styles.orderContainer_payContainer_item}>
          {t("basket.partner")}  
          <span style={{margin:"0px 7px"}}> 
            {basketContent?.partnerTin} 
          </span> 
        </div>
        }
      <div className={styles.orderContainer_payContainer_item}>
        <span>
          {t("basket.recieptPrice")}
          {basketContent?.isPrepayment ? <span style={{color:"green", fontWight:700}}>
             ({t("basket.useprepayment").toLowerCase()})
          </span>: ""}
        </span>
        <span style={{margin:"0px 7px"}}> {basketContent?.total}{t("units.amd")} </span> 
      </div>

      <div  className={styles.orderContainer_payContainer_item}>
      {t("history.cash")} 
      <span style={{margin:"0px 7px"}}> {basketContent?.cashAmount}  {t("units.amd")}</span> 
      </div>

      <div  className={styles.orderContainer_payContainer_item}>
        {t("history.card")} 
        <span style={{margin:"0px 7px"}}> {basketContent?.cardAmount}  {t("units.amd")} </span>
      </div>

      {!basketContent?.isPrepayment  && basketContent?.prePayment ? 
        <div className={styles.orderContainer_payContainer_item}>
          {/* {t("basket.useprepayment")}  */}
          {t("basket.prepaymentTitle")}
          <span style={{margin:"0px 7px"}}> {basketContent?.prePayment}  {t("units.amd")} </span>
        </div> : ""
      }

      <Divider style={{ background: '#343a40', width:"60%", fontWight:600, margin:"10px 0px" }} />
      <div style={{fontSize:"100%",color:"EE8D1C"}} className={styles.orderContainer_payContainer_item}>
        <strong> 
        {t("basket.orderPayment")}
        </strong> 
        <strong> 
          <span style={{margin:"0px 7px"}}>
            {basketContent?.cardAmount} 
            {t("units.amd")} 
          </span> 
        </strong>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h1>
        <PaymentIcon
          sx={{
            color:"#63B48D",
            fontSize:"2.2rem",
            marginTop:"5px"
          }} 
        />

        </h1>
        <a href={basketContent?.payXPaymentLink} style={{margin:"20px 0px",textDecoration:"none", color:"white", }} rel="noreferrer" >
          <Button variant="contained" style={{color:"white",letterSpacing:"5px", background:"#63B48D",width:"200px",textTransform: "capitalize"}}>
            {basketContent?.isPrepayment ? t("basket.useprepayment") :t("basket.linkPayment")} 
          </Button> 
        </a>
      </div>
    </div>
  )
}

export default memo(OrderListPayInfo);
