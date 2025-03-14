import { useState, memo } from "react";
import { Button } from "@mui/material";
import { saveAs } from 'file-saver';

import { generateToExcel } from "../../../services/user/userHistoryQuery";
import HistoryFilter from "../filter/index";
import HistoryExcelBurger from "../searchtab/burgerExcelLoader"
import DateRangeIcon from '@mui/icons-material/DateRange';

import styles from "../index.module.scss";
import StartEndDatePicker from "./DatePicker";

const SearchHistory = ({
  getHistoryByStartAndEndDates,
  t, 
  initDate,
  setInitDate,
  status, 
  setStatus,
  columns,
  setColumns,
}) => {


  const [ownDate, setOwnDate] = useState({});
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const fileReader = async(argument) => {
    await generateToExcel(argument).then((resp) => {
      saveAs(new Blob([resp], {type: 'application/octet-stream'}), `StoreX.xlsx`)
    })
  };

// Combine into desired format

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
          {initDate?.startDate && initDate?.endDate && 
           <span> {new Date(initDate?.startDate).toLocaleDateString("en-GB")} - {new Date(initDate?.endDate).toLocaleDateString("en-GB")} </span>
          }
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
            style={{margin:"0px 5px",textTransform: "capitalize"}}
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
