import React, { memo } from 'react';
import styles from "./index.module.scss";

const CreditCard = ({userCardInfo}) => {
  
  const  defaultCardTexts= {
    name:"XXXX",
    surname:"XXXXXXXX",
    bank: "XXXXXX XXXX",
    expMonth: "mm",
    expYear:"yy",
    cvv:"",
    cardNumOrigin:"xxxxxxxxxxxxxxxxxx",
  }

  return (
    <span className={styles.creditCard} >
      <div className={styles.creditCard_bank}>
        <span>
         { userCardInfo?.bank || defaultCardTexts?.bank}
        </span>
      </div>

      <img src="/chip.png" alt="" className={styles.creditCard_chip}  />

      {userCardInfo?.cardNumOrigin ?
      <p className={styles.creditCard_numbers}>
        {userCardInfo?.cardNumOrigin.slice(0,4)} **** **** {userCardInfo?.cardNumOrigin.slice(-4)}
      </p> :
      <p className={styles.creditCard_numbers}>
        {defaultCardTexts?.cardNumOrigin?.slice(0,4)} {defaultCardTexts?.cardNumOrigin?.slice(4,8)} {defaultCardTexts?.cardNumOrigin?.slice(8,12)} {defaultCardTexts?.cardNumOrigin?.slice(12,16)}
        </p> 
      }

        <div className={styles.creditCard_valid}>
          <span style={{fontSize:"30%", justifyContent:"space-between",margin:"0px 10px"}}>
            <div>VALID </div>
            <div>THRU </div>
          </span>
          {userCardInfo?.expMonth || defaultCardTexts.expMonth } / {userCardInfo?.expYear ||defaultCardTexts.expYear}
        </div>

     <span className={styles.creditCard_fullname}>
      <p>{(userCardInfo?.name || defaultCardTexts?.name)?.toUpperCase()} {(userCardInfo?.surname ||defaultCardTexts?.surname)?.toUpperCase()} </p> 
     </span>

    </span>
  )
}

export default memo(CreditCard);