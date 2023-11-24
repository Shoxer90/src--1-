import React, { memo, useEffect, useState } from 'react';

import HistoryTable from './HistoryTable';

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
