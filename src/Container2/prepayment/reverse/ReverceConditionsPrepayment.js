import React, { memo } from "react";
import { useTranslation } from "react-i18next";

import styles from "../index.module.scss";

const rowStyle = {
  display:"flex", 
  padding:"3px 2px",
  justifyContent:"space-between",
  alignItems:"center",
  marginRight: "20px"
};

const rowStyleGreen = {
  ...rowStyle,
  fontWeight: 700,
  color: "green"
};

const ReverceConditionsPrepayment = ({
  handleChangeInput,
  item,
  reverseData, 
  errStyle,
  inputStyle,
}) => {
  const {t} = useTranslation();

  return(
    <div className={styles.reverseConditions} style={{margin:"10px 40px 10px 10px"}}>
      <div > 
        {item?.total ?
          <span  style={rowStyleGreen}> 
            {t("history.prepaymentRedemption")}
            <strong style={{margin:"0 5px"}}>{item?.prePaymentAmount} {t("units.amd")}</strong>
          </span> :""
        }
        
        {item?.cashAmount ?
          <span style={rowStyle}>
            {t("history.whichCash")}
            <strong style={{margin:"0 5px"}}> 
              {item?.cashAmount} {t("units.amd")}
            </strong>
          </span>: ""
        }

        {item?.cardAmount ?
          <span style={rowStyle}> 
            {t("history.whichCashless")} 
            <strong style={{margin:"0 5px"}}> 
              {item?.cardAmount} {t("units.amd")}
            </strong>
          </span>
         : "" }
      </div>

      <div style={{display:"flex",flexFlow:"column",textAlign:"center"}}>
       {item?.cashAmount ?
            <label style={rowStyle}>
              <span>{t("history.cash")} </span>
              <input 
                autoComplete="off"
                style={item?.cashAmount < reverseData?.cashAmount ? errStyle : inputStyle}
                name="cashAmount"
                value={reverseData?.cashAmount || ""}
                onChange={(e)=>handleChangeInput(e)}

              /> 
           </label>: ""
          }
          
          {item?.cardAmount ?
           <label style={rowStyle}>
             <span>{t("history.card")}</span>
              <input 
                autoComplete="off"
                style={item?.cardAmount < reverseData?.cardAmount ? errStyle : inputStyle}
                name="cardAmount"
                value={reverseData?.cardAmount || ""}
                onChange={(e)=>handleChangeInput(e)}
              /> 
            </label>: ""
          }

          <span style={rowStyleGreen}>
            {t("basket.remainder1")} {`(${t("history.afterReverse")}) `}
            {(+item?.prePaymentAmount - (+reverseData?.cashAmount + reverseData?.cardAmount))?.toFixed(2)} {t("units.amd")}
          </span>
      </div>

    </div>
    
  )
};

export default memo(ReverceConditionsPrepayment);
