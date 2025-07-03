import { memo } from "react"

import styles from "./index.module.scss";

const ChoosePaymentType = ({
  activeStyle,
  billsData, 
  setMethod, 
  setBills, 
  paymentType, 
  setClicked
}) => {
  
  const handleChange = (num) => {
    setBills({
      ...billsData,
      attach: false,
      paymentType: num
    })
  };

  return (
    <div>
      {paymentType && paymentType.map((type, index) => {
        if(type?.title !== "Arca") {

        return <div 
          key={index}  
          onChange={() => {
            setMethod(2)
            setClicked(false)
            delete billsData?.cardId
            delete billsData?.attach
            handleChange(type?.paymentType)
          }}
          className={styles.subscription_item} 
          style={billsData?.paymentType === type?.paymentType ? activeStyle : {display:type?.title ==="Arca" ? "none": null}}
        >
          <label>
            <input
              type="radio"
              checked={billsData?.paymentType === type?.paymentType && billsData?.paymentType !==1}
              name="payment type"
              onChange={() => {
                // setMethod(1)
                setClicked(false)
                setMethod(2)
                delete billsData?.cardId
                delete billsData?.attach
                handleChange(type?.paymentType)
              }}
            />
            <span style={{textAlign:"center", marginRight:"5px"}}>
              <img src={type?.icon} alt={type?.title} style={{height: "20px", marginBottom:"3px"}} />
            </span>
          </label>
        </div>}
        })}
    </div>
  )
};

export default memo(ChoosePaymentType);
