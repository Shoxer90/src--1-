import React from "react";
import { useState } from "react";
import { memo } from "react";
import { Button, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { saveAs } from 'file-saver';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { generateToExcel } from "../../../services/user/userHistoryQuery";
import HistoryFilter from "../filter/index";
import { format } from "date-fns";
import HistoryExcelBurger from "../searchtab/burgerExcelLoader"

import styles from "../index.module.scss";

const SearchHistory = ({filterFunc, coordinator, t, initialFunc,status, setStatus,columns,setColumns}) => {

  const [value, setValue] = useState({
    endDate: coordinator?.endDate ? coordinator?.endDate : new Date(),
    startDate: coordinator?.startDate ? coordinator?.startDate : new Date()
  });

  const handleFilter = () => {
    filterFunc({
      endDate:  format(value.endDate, 'MM-dd-yyyy'),
      startDate: format(value.startDate, 'MM-dd-yyyy')
    });
  };

  const fileReader = async(argument) => {
    await generateToExcel(argument).then((resp) => {
      saveAs(new Blob([resp], {type: 'application/octet-stream'}), `StoreX.xlsx`)
    })
  };


  return (
    <div className={styles.history_searchBar}>
      <HistoryFilter
        t={t}
        initialFunc={initialFunc}
        status={status}
        columns={columns}
        setColumns={setColumns}
        setStatus={setStatus}
      />
      <div className={styles.history_searchBar_date}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            maxDate={new Date()}
            label={t("history.start_date")}
            name= "startDate"
            inputFormat="DD/MM/YYYY"
            value={value.startDate}
            style={{marginLeft: 5 ,color: "white"}}
            onChange={(e)=>{
              setValue({
                ...value,
                startDate:Date.parse(e)
              });
            }}
            renderInput={(params) => <TextField 
              {...params}
              sx={{
                border: "none",
                width: 150,
                svg: "grey",
                input: "grey",
                label: "grey",
              }}
              />}
          />
        <DatePicker
          maxDate={new Date()}
          label={t("history.end_date")}
          name= "endDate"
          inputFormat="DD/MM/YYYY"
          value={value.endDate}
          style={{marginLeft: 5 ,color: "white", height: "30px"}}
          onChange={(e) => {
            setValue({
              ...value,
              endDate:Date.parse(e)
            });
          }}
          renderInput={(params) => <TextField
            {...params}
            sx={{
              width:150,
              color: "white",
              // svg: "grey",
              // input: "grey",
              // label: "grey"
            }}
            />}
        />
      </LocalizationProvider>
    </div>
    <div className={styles.btn_group}>
      <div className={styles.history_searchBar_btn}>
        <Button
          size="small"
          variant="contained"
          onClick={handleFilter}
          style={{
            backgroundColor: "#28A745",
          }}
        >
          {t("history.filterbydate")}
        </Button>
      </div>
      <div className={styles.history_searchBar_btn}>
      <HistoryExcelBurger 
          t={t}
          setValue={setValue}
          value={value}
          fileReader={fileReader}
        />
      </div>
    </div>
  </div>
  );
};

export default memo(SearchHistory);
  