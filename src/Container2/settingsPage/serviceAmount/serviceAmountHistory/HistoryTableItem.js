import { TableCell, TableRow } from '@mui/material';
import React from 'react'
import { memo } from 'react';

const HistoryTableItem = ({amountPaid, t, index, orderId, payDate}) => {
  const date = new Date(payDate)
  return (
    <TableRow sx={{'&:hover':{backgroundColor: 'rgb(243, 243, 239)',textAlign:"center"}}}>
      <TableCell style={{padding:"0px 16px"}}>
        <strong>
          {index+1}

        </strong>
      </TableCell>
      {/* Order ID is null */}
      <TableCell style={{padding:"0px 16px"}}>
        <strong>
          {orderId}
          orderId

        </strong>
      </TableCell>
      <TableCell style={{padding:"0px 16px"}}>
        <strong>
          <div>
            {date?.getUTCDate()>9 ? date?.getUTCDate() : `0${ date?.getUTCDate()}`}/
            {date.getMonth()>8 ? date.getMonth()+1: `0${date.getMonth()+1}`}/
            {date.getFullYear()} {" "} 
          </div>
          <div> 
            {date.getHours()>9? date.getHours(): `0${date.getHours()}`}:
            {date.getMinutes()>9? date.getMinutes(): `0${date.getMinutes()}`}:
            {date?.getSeconds()>9? date?.getSeconds(): `0${date?.getSeconds()}`}  
          </div> 
        </strong>
      </TableCell>
      <TableCell style={{padding:"0px 16px"}}>
        <strong>
          {amountPaid} {t("units.amd")}

        </strong>
      </TableCell>
      </TableRow>
  )
}

export default memo(HistoryTableItem);
