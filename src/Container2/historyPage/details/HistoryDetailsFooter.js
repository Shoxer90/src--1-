import React from 'react';
import { useTranslation } from 'react-i18next';

const HistoryDetailsFooter = ({item,originTotal}) => {
  const {t} = useTranslation();

  return (
    <div style={{margin:"5px",letterSpacing:"1px"}}>
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
    </div>
  )
}

export default HistoryDetailsFooter;
