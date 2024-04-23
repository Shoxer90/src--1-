import React, { memo } from 'react';

import styles from "../index.module.scss";
import { t } from 'i18next';

  const CreditCard = ({card,isMain}) => {

    return (
    <span className={styles.creditCard} >
      <div className={styles.creditCard_bank} style={{marginTop:"20px"}} >
        <span style={{fontSize:"80%"}} >
          {card?.bankName}      
          {isMain && <span style={{color:"#78f51d",fontWeight:600}}> / {t("cardService.mainCard")} </span>}
        </span>
      </div>
      <div style={{minHeight:"20px"}}></div>
      {/* <img src="/chip.png" alt="" className={styles.creditCard_chip} /> */}
      <p className={styles.creditCard_numbers}>
        {card?.pan.slice(0,4)} **** **** {card?.pan.slice(-4)}
      </p> 
     <div style={{display:"flex", margin:"5px",justifyContent:"space-between", width:"100%"}}>
        <div>
          <div className={styles.creditCard_valid}>
            <span style={{fontSize:"30%", justifyContent:"space-between",margin:"0px 10px"}}>
              <div>VALID </div>
              <div>THRU </div>
            </span>
            <span>
              {card?.expiration.slice(-2)} /  {card?.expiration.slice(0,4)}
            </span>
          </div>
          <span className={styles.creditCard_fullname}>
            <p>{card?.cardHolder?.toUpperCase()}</p> 
          </span>
        </div>
        <div>
          {card?.pan[0] == 4  && <img src="/visa_white.png" alt="card_type"  style={{width:"60px",margin:"31px 8px 8px 8px"}}/>}
          {card?.pan[0] == 5  && <img src="/master_silver.png" alt="card_type"  style={{width:"60px", margin:"8px",marginTop:"18px"}}/>}
          {card?.pan[0] == 9  && <img src="/arca_silver.png" alt="card_type"  style={{width:"90px", height:"45px",marginTop:"22px"}}/>}
        </div>
     </div> 
    </span>
  )
}

export default memo(CreditCard);