import React, { memo } from 'react';
import styles from "../index.module.scss"

// const CreditCard = ({userCardInfo}) => {
  const CreditCard = ({card}) => {
  

  const  userCardInfo= {
    name:"Ararat",
    surname:"Avetisyan",
    bank: "Ameria Bank",
    expMonth: "07",
    expYear:"24",
    cvv:"",
    cardNumOrigin:"141212313132132132",
  }

  return (
    <span className={styles.creditCard} >
      <div className={styles.creditCard_bank}>
        <span>
         { card?.bankName }
        </span>
      </div>

      <img src="/chip.png" alt="" className={styles.creditCard_chip}  />

      <p className={styles.creditCard_numbers}>
        {userCardInfo?.cardNumOrigin.slice(0,4)} **** **** {userCardInfo?.cardNumOrigin.slice(-4)}
      </p> 
      
     {/* new with visa mastercard logo */}
     <div style={{display:"flex", margin:"5px",justifyContent:"space-between", width:"100%"}}>
        <div>
          <div className={styles.creditCard_valid}>
            <span style={{fontSize:"30%", justifyContent:"space-between",margin:"0px 10px"}}>
              <div>VALID </div>
              <div>THRU </div>
            </span>
            <span>
              {userCardInfo?.expMonth} / {userCardInfo?.expYear }
            </span>
          </div>

          <span className={styles.creditCard_fullname}>
            <p>{userCardInfo?.name?.toUpperCase()} {userCardInfo?.surname?.toUpperCase()} </p> 
          </span>
        </div>
        <div>
          <img src={userCardInfo?.cardNumOrigin[0] == 4 ? "/visa.png" :"/mastercard.png"} alt="card_type"  style={{width:"60px",height:"50px"}}/>
        </div>
     </div>
     

    </span>
  )
}

export default memo(CreditCard);