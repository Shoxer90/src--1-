import { useEffect, useState } from "react";

import { addDays } from "date-fns";

import { Dialog } from "@mui/material";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const StartEndDatePicker  = ({
  getHistoryByStartAndEndDates,
  setOpenDatePicker, 
  openDatePicker,
  status,
  initDate,
  setInitDate,
  ownDate,
  setOwnDate
}) => {

  // const [ownDate, setOwnDate] = useState({});

  const onChange = (dates) => {
    const [start, end] = dates;

    setOwnDate({
      startDate: start,
      endDate: end
    })
    setInitDate({
      startDate: start.toISOString(),
      endDate: end.toISOString()
    })
    if(end) {
      getHistoryByStartAndEndDates(status, 1,
        {
          startDate:(new Date(start)).toISOString(),
          endDate:(new Date(end)).toISOString()
        }
      )
      setOpenDatePicker(false)
    } 
  };

  useEffect(() => {
    setOwnDate(initDate)
  }, [initDate])

  return (
    <Dialog
      onClose={()=>setOpenDatePicker(false)}
      open={openDatePicker}
    >
      <DatePicker
        swapRange
        onChange={onChange}
        selected={ownDate?.startDate}
        startDate={ownDate?.startDate}
        endDate={ownDate?.endDate}
        excludeDates={[addDays(new Date(), 1), addDays(new Date(), 5)]}
        maxDate={new Date()} 
        selectsRange
        selectsDisabledDaysInRange
        inline
      />
    </Dialog>
  );
};

export default(StartEndDatePicker);
