import React, { memo } from 'react';

import styles from "../index.module.scss";

  const CreditCard = ({card}) => {

    return (
    <span className={styles.creditCard} >
      <div className={styles.creditCard_bank}>
        <span>
         {card?.bankName}
        </span>
      </div>
      <img src="/chip.png" alt="" className={styles.creditCard_chip} />
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
          <img src={card?.pan[0] == 4 ? "/visa.png" :"/mastercard.png"} alt="card_type"  style={{width:"60px",height:"50px"}}/>
        </div>
     </div>
    </span>
  )
}

export default memo(CreditCard);