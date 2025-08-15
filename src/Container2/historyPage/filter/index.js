import React, { memo } from "react";
import PayStatusSelect from "./PayStatusSelect";
import ColumnSelect from "./ColumnSelect";

const HistoryFilter = ({
  initDate,
  setInitDate, 
  getHistoryByStartAndEndDates, 
  status,
  setStatus,
  columns,
  setColumns
}) => {

  return(
    <div style={{display:"flex", }}>
      <PayStatusSelect 
        getHistoryByStartAndEndDates={getHistoryByStartAndEndDates} 
        setStatus={setStatus} 
        status={status}
        initDate={initDate}
        setInitDate={setInitDate}
      />
      <ColumnSelect columns={columns} setColumns={setColumns}/>
    </div>
)
};

export default memo(HistoryFilter);
