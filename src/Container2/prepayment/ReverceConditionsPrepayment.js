import React, { memo } from "react";
import styles from "../historyPage/reverse/index.module.scss";
import { useTranslation } from "react-i18next";

const ReverceConditionsPrepayment = ({
  handleChangeInput,
  item,
  reverseData, 
  errStyle,
  inputStyle,
}) => {

  const rowStyle = {
    display:"flex", 
    justifyContent:"space-between",
    alignItems:"center",
    marginRight: "20px"
  };
  const rowStyleGreen = {
    ...rowStyle,
    fontWeight: 700,
    color: "green"
  }

  const {t} = useTranslation();

  return(
    <div className={styles.reverseConditions} style={{margin:"10px 40px 10px 10px"}}>
      <div > 

        <span style={rowStyle}>{t("history.receiptPrice2")} 
          <strong style={{margin:"0 5px"}}> 
          {item?.allProductTotalPrice} {t("units.amd")}
          </strong>
        </span>

        {item?.total ?
          <span  style={rowStyleGreen}> 
            {t("history.prepaymentRedemption")}
            <strong style={{margin:"0 5px"}}>{item?.total} {t("units.amd")}</strong>
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
          </span>: ""
        }

        <span style={rowStyleGreen}>
        {t("basket.remainder")} {`(${t("history.afterReverse")})`}
          <strong style={{margin:"0 5px"}}>
            {item?.total - (reverseData?.cashAmount + reverseData?.cardAmount)} {t("units.amd")}
          </strong>
        </span>
        
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
                onChange={(e)=>{
                  // if(item?.total - item?.cardAmount - e.target.value < 0 && e.target.value > reverseData?.cashAmount)return
                  handleChangeInput(e)
                }}
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
                onChange={(e)=>{
                  // if(item?.total - item?.cashAmount - e.target.value < 0 && e.target.value > reverseData?.cardAmount)return
                  handleChangeInput(e)
                }}
              /> 
            </label>: ""
          }
      </div>

    </div>
    
  )
};

export default memo(ReverceConditionsPrepayment);
