import React, { memo } from 'react';
import styles from "./index.module.scss";
import { Button, Divider } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
const OrderListPayInfo = ({basketContent,t}) => {
  return (
      <div className={styles.orderContainer_payContainer}>

        <div className={styles.orderContainer_payContainer_item}>
         {t("basket.recieptPrice")}  
         <span style={{margin:"0px 7px"}}> {basketContent?.total}{t("units.amd")} </span> 
        </div>

        <div  className={styles.orderContainer_payContainer_item}>
        {t("history.cash")} 
        <span style={{margin:"0px 7px"}}> {basketContent?.cashAmount}  {t("units.amd")}</span> 
        </div>

        <div  className={styles.orderContainer_payContainer_item}>
         {t("basket.useprepayment")} 
         <span style={{margin:"0px 7px"}}> {basketContent?.prePayment}  {t("units.amd")} </span>
        </div>

        <Divider sx={{bcolor:"black"}} />
        <div style={{fontSize:"110%",color:"EE8D1C"}} className={styles.orderContainer_payContainer_item}>
          <strong> 
            {t("history.card")} 
          </strong> 
          <strong> 
            <span style={{margin:"0px 7px"}}>
              {basketContent?.cardAmount} 
              {t("units.amd")} 
            </span> 
          </strong>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"250px"}}>
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
            <Button
              // startIcon={<CreditScoreIcon />} 
              variant="contained" style={{color:"white",letterSpacing:"3px", background:"#63B48D",width:"200px"}}>
              {t("basket.linkPayment")} 
            </Button> 
          </a>
        </div>
    </div>
  )
}

export default memo(OrderListPayInfo);
