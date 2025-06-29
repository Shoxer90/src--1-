import { memo, useEffect, useState } from "react"
import { getPaymenTypesArcaOther } from "../../../../../services/internal/InternalPayments";

import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";

  
const ChoosePaymentType = ({billsData, setMethod, setBills, paymentType, setClicked}) => {
  const {t} = useTranslation();
  const [activeField,setActiveField] = useState([]);

  const activeStyle = {
    boxShadow: "10px 5px 5px grey",
    scale:"1.04",
    transition: "width 2s",
  };

  const handleChange = (num) => {
    setActiveField(num)
    setBills({
      ...billsData,
      attach: false,
      paymentType: num
    })
  }

  return (
      
    <div>
      {paymentType && paymentType.map((type) => {
        if(type?.title !== "Arca") {

        return <div 
           onChange={() => {
                // setMethod(1)
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
              checked={activeField === type?.paymentType && billsData?.paymentType !==1}
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
