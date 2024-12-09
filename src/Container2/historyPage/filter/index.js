import React, { memo } from "react";
import PayStatusSelect from "./PayStatusSelect";
import ColumnSelect from "./ColumnSelect";

const HistoryFilter = ({t,
  // initialFunc, 
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
        t={t} 
        // initialFunc={initialFunc} 
        getHistoryByStartAndEndDates={getHistoryByStartAndEndDates} 
        setStatus={setStatus} 
        status={status}
        initDate={initDate}
        setInitDate={setInitDate}
      />
      <ColumnSelect t={t} columns={columns} setColumns={setColumns}/>
    </div>
)
};

export default memo(HistoryFilter);
