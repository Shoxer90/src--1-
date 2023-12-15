import React, { memo, useState } from "react";
import ActivateCreditCard from "../creditCard/ActivateCreditCard";

const ServicePayDetails = ({
  t,
  currentCard,
  userCardInfo,
  changeActiveCard,
}) => {

  const [ isOpen, setIsOpen] = useState(false);

  return (
    <div>
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
      {/* <span className={styles.serviceAmount} style={{margin:"0px"}}>
        <span>{t("basket.totalndiscount")} </span>
        <span> {paymentAmount?.current} {t("units.amd")}</span>
      </span>
      <div className={styles.serviceAmount} >
        {payForSeveralServices && 
          <>
            <div style={{fontWeight:500}}>
              <span>{t("basket.linkPayment")}</span>
              <span style={{marginLeft:"10px"}}> {paymentAmount?.selected} {t("units.amd")}</span>
            </div>
            <Button
              variant="contained" 
              startIcon={<PaymentIcon />}
              // disabled={paymentAmount?.selected === 0}
            
              onClick={() =>setOpenDialogForPay(true)}
              style={{
                marginLeft:"10px",
                letterSpacing:"3px", 
                background: !paymentAmount?.selected ? "lightgrey": "#63B48D",
              }}
              >
              {t("basket.linkPayment")} 
            </Button> 
          </>
        }
      </div> */}
    </div>
  )
};

export default memo(ServicePayDetails);
