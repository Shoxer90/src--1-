import { Button, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";
import { useState } from "react";
import { memo } from "react";
import styles from "./index.module.scss";

const DateBar = ({
  productsSaleByDays,
  setId, 
  t,
  filterByDate,
  value,
  setValue,
}) => {
  // const init = new Date();

  // const [value, setValue] = useState({
  //   start: new Date().setMonth(init.getMonth()-1),
  //   end: new Date()
  // });

  // const handleFilter = () => {
  //   filterByDate(value)
  // };

  return(
    <>
      <div className={styles.products_sells_inputs}>
        <LocalizationProvider dateAdapter={AdapterDayjs} >
          <DatePicker
          style={{minWidth:"150px"}}
            maxDate={new Date()}
            label={t("history.start_date")}
            name= "start"
            format="MM-dd-yyyy"
            value={value.start}
            onChange={(e)=>{
              setValue({
                ...value,
                start: Date.parse(e)
              });
            }}
          renderInput={(params) => <TextField {...params}/>}
          />
          <DatePicker
            maxDate={new Date()}
            label={t("history.end_date")}
            name= "end"
            format="MM-dd-yyyy"
            value={value.end}
            renderInput={(params) => <TextField {...params} />}
            onChange={(e) => {
            setValue({
                ...value,
                end:Date.parse(e)
            });
            }}
          />
        </LocalizationProvider>
      </div>
   </>
  )
};

export default memo(DateBar);
