import React, { memo } from 'react'
import HistoryTable from './HistoryTable';
import { useEffect } from 'react';
import { useState } from 'react';
import { getServiceHistory } from '../../../../services/cardpayments/internalPayments';

const ServiceAmountHistory = ({historyAndCardData, t}) => {
  const [history, setHistory] = useState([]);

  const getOverallHistoryFromAllData = () => {
    let historyDataArr = []
    historyAndCardData.forEach((item) => {
      historyDataArr.push(...item?.userServicePayment)
    })
    setHistory(historyDataArr)
  };

  const getHistoryDataById = (arg) => {
   const individualHistory = historyAndCardData.filter(item => item?.id === arg)
   setHistory(individualHistory?.userServicePayment)

  };

  useEffect(() => {
    getOverallHistoryFromAllData()
  },[]);


  return (
    <div >
      <h3>{t("cardService.historySubTitle")}</h3>
      {history && 
        <HistoryTable 
         history={history}
         getHistoryDataById={getHistoryDataById}
        />
      }
      
    </div>
  )
}

export default memo(ServiceAmountHistory);
