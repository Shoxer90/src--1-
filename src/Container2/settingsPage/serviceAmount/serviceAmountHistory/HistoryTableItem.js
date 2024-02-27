import React, { memo } from 'react';
import { TableCell, TableRow } from '@mui/material';

const HistoryTableItem = ({price, t, index, date}) => {
  const dateFormat = new Date(date);

  return (
    <TableRow sx={{'&:hover':{backgroundColor: 'rgb(243, 243, 239)', textAlign:"center"}}}>
      <TableCell style={{padding:"0px 16px"}}>
      {index+1}.
      </TableCell>
      <TableCell style={{padding:"0px 16px"}}>
        
          <div>
            {dateFormat?.getUTCDate()>9 ? dateFormat?.getUTCDate() : `0${ dateFormat?.getUTCDate()}`}/
            {dateFormat.getMonth()>8 ? dateFormat.getMonth()+1: `0${dateFormat.getMonth()+1}`}/
            {dateFormat.getFullYear()} {" "} 
          </div>
          <div> 
            {dateFormat.getHours()>9? dateFormat.getHours(): `0${dateFormat.getHours()}`}:
            {dateFormat.getMinutes()>9? dateFormat.getMinutes(): `0${dateFormat.getMinutes()}`}:
            {dateFormat?.getSeconds()>9? dateFormat?.getSeconds(): `0${dateFormat?.getSeconds()}`}  
          </div> 
      
      </TableCell>
      <TableCell style={{padding:"0px 16px"}}>
        {price} {t("units.amd")} 
      </TableCell>
    </TableRow>
  )
};

export default memo(HistoryTableItem);
