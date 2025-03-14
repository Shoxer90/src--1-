import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button, Dialog } from "@mui/material";

import { setStartEndDate } from "../../../../store/filter/startEndDateSlice";

import { addDays } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";

const DatePickerRTK  = () => {
  const dateState = useSelector(state => state?.startEndDate);
  const search = useLocation().search;
  const startDate = new URLSearchParams(search).get('startDate')
  const endDate = new URLSearchParams(search).get('endDate') 

  const location = useLocation();
  const dispatch = useDispatch();
  const [ownDate, setOwnDate] = useState(dateState)
  const [openDatePicker,setOpenDatePicker] = useState(false);

  const onChange = (dates) => {
  const [start, end] = dates;
  setOwnDate({
    startDate: start,
    endDate: end
  })
  if(end) {
    dispatch(setStartEndDate({
      startDate: start.toISOString(),
      endDate: end.toISOString()
    }))
    changeUrl(start,end)
      setOpenDatePicker(false)      
    }
  };


  const initialDateCreator = async() => {
    if(startDate && endDate){
      dispatch(setStartEndDate({
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString()
      }))
    }else{
      let currentDate = new Date();
      let previousDate = new Date(currentDate)
      previousDate.setMonth(currentDate.getMonth()-1)
      dispatch(setStartEndDate({
        startDate: previousDate.toISOString(),
        endDate: currentDate.toISOString()
      }))
      changeUrl(previousDate , currentDate)
    }
  };

  const changeUrl = (start,end) => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set("startDate", start.toISOString().slice(0,10));
    newSearchParams.set("endDate", end.toISOString().slice(0,10));
    window.history.pushState({}, "", `${location.pathname}?${newSearchParams.toString()}`);
  }
  
  useEffect(() => {
    initialDateCreator()
  }, []);

  return (
    <>
      <Button onClick={()=>setOpenDatePicker(true)} variant="contained" sx={{height:"55px", marginTop:"7px"}}>
        {dateState?.startDate && dateState?.endDate && 
          <span> {new Date(dateState?.startDate).toLocaleDateString("en-GB")} - {new Date(dateState?.endDate).toLocaleDateString("en-GB")} </span>
        }
      </Button>
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
    </>
  );
};

export default(DatePickerRTK);
