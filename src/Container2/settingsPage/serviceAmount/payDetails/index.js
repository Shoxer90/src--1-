import React, { memo, useState } from "react";
import ActivateCreditCard from "../creditCard/ActivateCreditCard";

import { Button } from "@mui/material";
import PaymentIcon from '@mui/icons-material/Payment';

import styles from "./index.module.scss";

const ServicePayDetails = ({
  t,
  currentCard,
  userCardInfo,
  paymentAmount,
  changeActiveCard,
  payForSeveralServices,
  setPayForSeveralServices, 
}) => {

  const [ isOpen, setIsOpen] = useState(false);

  return (
    <div style={{display:"flex", flexFlow:"column",margin:"20px"}}>
      {userCardInfo?.length ? 
        <ActivateCreditCard 
          t={t} 
          currentCard={currentCard}
          userCardInfo={userCardInfo} 
          changeActiveCard={changeActiveCard}
        /> :
        <div 
          style={{justifyContent:"center",cursor:"pointer"}} 
          onClick={()=>setIsOpen(!isOpen)
        }>
          {t("cardService.createCard2")}
        </div>
      }
      <div style={{height:"60px"}}>

      </div>
      {/* checkbox for choosing pay for several services or for one,if you want use it change payForSeveralServices to false in useState */}
        {/* <FormControlLabel
        style={{alignSelf:"start"}} 
          sx={{m:0, mt:3}}
          labelPlacement="start"
          label={t("cardService.payForSimilarServices")} 
          control={<Checkbox
            onClick={(e)=>setPayForSeveralServices(e.target.checked)}
          />}
        /> */}
      <div className={styles.serviceAmount} >
        {payForSeveralServices && 
          <>
            <div style={{fontWeight:500}}>
              <span>{t("basket.totalndiscount")} </span>
              <span style={{marginLeft:"10px"}}> {paymentAmount} {t("units.amd")}</span>
            </div>
            <Button
              variant="contained" 
              startIcon={<PaymentIcon />}
              disabled={paymentAmount === 0}
              style={{
                marginLeft:"10px",
                letterSpacing:"3px", 
                background: !paymentAmount? "lightgrey": "#63B48D",
              }}>
              {t("basket.linkPayment")} 
            </Button> 
          </>
        }
      </div>
    </div>
  )
};

export default memo(ServicePayDetails);
