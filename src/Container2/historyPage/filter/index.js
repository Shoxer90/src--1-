import React, { memo } from "react";
import PayStatusSelect from "./PayStatusSelect";
import ColumnSelect from "./ColumnSelect";

const HistoryFilter = ({t,initialFunc, status,setStatus,columns,setColumns}) => {

  return(
    <div style={{display:"flex", }}>
      <PayStatusSelect t={t} initialFunc={initialFunc} setStatus={setStatus} status={status}/>
      <ColumnSelect t={t} columns={columns} setColumns={setColumns}/>
    </div>
)
};

export default memo(HistoryFilter);
