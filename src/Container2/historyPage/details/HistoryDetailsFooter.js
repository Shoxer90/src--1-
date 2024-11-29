import React from 'react';
import { useTranslation } from 'react-i18next';

const HistoryDetailsFooter = ({
  item, 
  amountForPrePayment
}) => {
  const {t} = useTranslation();

  return (
    <div style={{margin:"5px",letterSpacing:"1px"}}>
       
      {item?.saleType === 5  ? 
        <div> 
          <div> 
            <strong>     
              <span>{t("history.receiptPrice2")}</span>
              <span> {amountForPrePayment?.amount} {t("units.amd")}</span>
            </strong>
          </div>
          <span>
            {t("history.prepaymentRedemption")}
            <span style={{margin:"0 5px"}}> 
              {item?.cashAmount+ item?.cardAmount+item?.prePaymentAmount} {t("units.amd")}/</span> 
          </span>
          {item?.cashAmount ?
            <span style={{textTransform:"lowercase",fontWeight:600,fontSize:"90%"}}>{t("history.cash")}
              <span style={{margin:"0 2px"}}> {item?.cashAmount} {t("units.amd")}/</span> 
            </span> : ""
          }
          {item?.cardAmount ?
            <span style={{textTransform:"lowercase",fontWeight:600,fontSize:"90%"}}> 
              {t("history.card")}
              <span style={{margin:"0 2px"}}> {item?.cardAmount} {t("units.amd")}</span> 
            </span> : ""
          }
          <div>
            <strong> 
              {t("basket.remainder")}
              <span style={{margin:"0 2px"}}> {amountForPrePayment?.rest} {t("units.amd")}</span> 
            </strong> 
          </div> 
        </div> : 
        // OBICHNIY CHEK
        <div>
          <strong>     
            <span>{t("history.receiptPrice2")}</span>
            <span> {item?.total} {t("units.amd")}</span>
          </strong>
          {item?.cashAmount ?
            <div > 
              {t("history.whichCash")}
              <span style={{margin:"0 5px"}}> {item?.cashAmount} {t("units.amd")}</span> 
            </div> : ""
          }
          {item?.cardAmount ?
            <div> 
              {t("history.whichCashless")}
              <span style={{margin:"0 5px"}}> {item?.cardAmount} {t("units.amd")}</span> 
            </div> : ""
          }
            {item?.prePaymentAmount ?
            <div> 
              {t("history.whichPrepayment")}
              <span style={{margin:"0 5px"}}> {item?.prePaymentAmount} {t("units.amd")}</span> 
            </div> : ""
          }
      </div>
      }
    </div>
  )
}

export default HistoryDetailsFooter;
