import React from "react";
import { useState } from "react";
import { memo } from "react";
import { Button, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { saveAs } from 'file-saver';
import CloseIcon from '@mui/icons-material/Close';

import { generateToExcel } from "../../../services/user/userHistoryQuery";
import HistoryFilter from "../filter/index";
import { format } from "date-fns";
import HistoryExcelBurger from "../searchtab/burgerExcelLoader"
import DateRangeIcon from '@mui/icons-material/DateRange';

import styles from "../index.module.scss";
import StartEndDatePicker from "./DatePicker";

const SearchHistory = ({
  getHistoryByStartAndEndDates,
  coordinator,
  t, 
  initDate,
  setInitDate,
  initialDateCreator,
  status, 
  setStatus,
  columns,
  setColumns,
}) => {

  // depends excel loader the "value" state can removed
  const [value, setValue] = useState({
    endDate: coordinator?.endDate ? coordinator?.endDate : new Date(),
    startDate: coordinator?.startDate ? coordinator?.startDate : new Date()
  });
  const [ownDate, setOwnDate] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openDatePicker, setOpenDatePicker] = useState(false)

  const fileReader = async(argument) => {
    await generateToExcel(argument).then((resp) => {
      saveAs(new Blob([resp], {type: 'application/octet-stream'}), `StoreX.xlsx`)
    })
  };

  const clearDatePicker = () => {
    setEndDate("")
    setStartDate("")
    initialDateCreator()
  };

  return (
    <div className={styles.history_searchBar}>
      <HistoryFilter
        t={t}
        initDate={initDate}
        setInitDate={setInitDate}
        getHistoryByStartAndEndDates={getHistoryByStartAndEndDates}
        status={status}
        columns={columns}
        setColumns={setColumns}
        setStatus={setStatus}
      />
      
    <div style={{position :"relative", padding:"0px 5px"}}>
      <div style={{display:"flex",justifyContent:"space-between",minWidth:"100%", fontWeight: 700, margin:"2px 0px"}}>
        <span style={{margin:"0px 10px"}}> 
        {initDate?.startDate && initDate?.endDate && <span> {initDate?.startDate.slice(0,10)} - {initDate?.endDate.slice(0,10)} </span>}
        </span>
      </div>  
      
      <StartEndDatePicker 
        getHistoryByStartAndEndDates={getHistoryByStartAndEndDates}
        setOpenDatePicker={setOpenDatePicker}
        openDatePicker={openDatePicker}
        status={status}
        initDate={initDate}
        setInitDate={setInitDate}
        ownDate={ownDate}
        setOwnDate={setOwnDate}
      />  
        <div style={{display:"flex", justifyContent:"space-between"}}>
          <Button
            style={{margin:"0px 5px"}}
            variant="contained"
            size='small'

            onClick={()=>setOpenDatePicker(true)}
          >
            <DateRangeIcon fontSize="small" style={{margin:"1px"}} />
            {t("history.filterbydate")}
          </Button>
            <HistoryExcelBurger 
              t={t}
              value={ownDate}
              fileReader={fileReader}
            />
        </div>
    </div>
 
  </div>
  );
};

export default memo(SearchHistory);
