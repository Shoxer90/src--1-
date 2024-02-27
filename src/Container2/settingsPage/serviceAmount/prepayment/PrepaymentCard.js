import React, { memo } from "react";
import styles from "../index.module.scss";
import { Button, Card } from "@mui/material";
import CardTravelIcon from '@mui/icons-material/CardTravel';
import { t } from "i18next";


 const PrepaymentCard = ({internalPayments,payData,setOpenPrepayment}) => {
  return (
 
      <Button 
        variant="contained" 
        size="small"
        sx={{borderRadius:1,background:"#def7ee", color:"blue", margin:1}}
        startIcon={ <CardTravelIcon fontSize="small" />}
        onClick={()=>{
          delete payData?.isBinding
          delete payData?.attach
          return setOpenPrepayment(true)
        }}
      >
        {t("cardService.prepayment")}  {internalPayments?.balance} {t("units.amd")}
      </Button>
  //    <Card className={styles.attachCardContainer} sx={{borderRadius:4,background:"#def7ee"}}>
  //    <div>
  //      <CardTravelIcon fontSize="large" />
  //      <span style={{fontWeight: 600}}>
  //        {t("cardService.balance")} {internalPayments?.balance} {t("units.amd")}
  //      </span>
  //    </div>
  //    <Button variant="outlined" 
  //      style={{ color: "rgba(26,61,48,1)", border:"solid rgba(26,61,48,1) 2px"}}
  //      onClick={()=>{
  //        delete payData?.isBinding
  //        delete payData?.attach
  //        return setOpenPrepayment(true)
  //      }}
  //    >
  //      {t("cardService.prepayment")}
  //    </Button>
  //  </Card>
  )
 };

export default memo(PrepaymentCard);
