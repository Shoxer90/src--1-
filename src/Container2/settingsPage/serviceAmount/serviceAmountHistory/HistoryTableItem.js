import React, { memo, useState } from 'react';
import { TableCell, TableRow } from '@mui/material';
import PayHistoryDetails from './PayHistoryDetails';

const HistoryTableItem = ({price, days, cardName, cardPan, service, nextPaymentDate, t, index, date,type}) => {
  const dateFormat = new Date(date);
  const nextDateFormat = new Date(nextPaymentDate);
  const [openHistoryDetails, setOpenHistoryDetails] = useState(false);

  return (
    <>
    <TableRow sx={{'&:hover':{backgroundColor: 'rgb(243, 243, 239)', textAlign:"center"}}}
    onClick={()=>setOpenHistoryDetails(true)}>
      <TableCell style={{padding:"0px 16px"}}>
        <span style={{color:"grey"}}>{index+1}. </span> <strong>{t(`settings.${service}`)} </strong>
       
      </TableCell>
      <TableCell style={{padding:"0px 16px"}}>
        
        <div>
          <div>
            {dateFormat?.getUTCDate()>9 ? dateFormat?.getUTCDate() : `0${ dateFormat?.getUTCDate()}`}.
            {dateFormat.getMonth()>8 ? dateFormat.getMonth()+1: `0${dateFormat.getMonth()+1}`}.
            {dateFormat.getFullYear()} {" "} 
          </div>
          <div>
            {dateFormat.getHours()>9? dateFormat.getHours(): `0${dateFormat.getHours()}`}։
            {dateFormat.getMinutes()>9? dateFormat.getMinutes(): `0${dateFormat.getMinutes()}`}։
            {dateFormat?.getSeconds()>9? dateFormat?.getSeconds(): `0${dateFormat?.getSeconds()}`}  
          </div> 
        </div> 
      
      </TableCell>
      <TableCell style={{padding:"0px 16px"}}>
        {price.toFixed(1)} <span style={{fontSize:"80%",color:"grey"}}> {t("units.amd")} </span>
      </TableCell>

    </TableRow>
      {openHistoryDetails && <PayHistoryDetails 
       open={openHistoryDetails}
       close={setOpenHistoryDetails} 
       service={service}
       dateFormat={dateFormat}
       nextDateFormat={nextDateFormat}
       price={price}
       days={days}
       cardPan={cardPan}
       cardName={cardName}
       type={type}
       />}
      </>
  )
};

export default memo(HistoryTableItem);
