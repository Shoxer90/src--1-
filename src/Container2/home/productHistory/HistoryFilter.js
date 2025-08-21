import { memo, useState } from "react";
import { Card, Dialog, Typography } from "@mui/material";
 
const HistoryFilter = (cardStyle) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);

  // const onChange = (dates) => {
  //     const [start, end] = dates;
  
  //     setOwnDate({
  //       startDate: start,
  //       endDate: end
  //     })
  //     setInitDate({
  //       startDate: start.toISOString(),
  //       endDate: end.toISOString()
  //     })
  //     if(end) {
  //       getHistoryByStartAndEndDates(status, 1,
  //         {
  //           startDate:(new Date(start)).toISOString(),
  //           endDate:(new Date(end)).toISOString()
  //         }
  //       )
  //       setOpenDatePicker(false)
  //     } 
  //   };
  
  //   useEffect(() => {
  //     setOwnDate(initDate)
  //   }, [initDate]);

  return (
    <Card style={{margin:"20px",}}>
      <Typography variant="h6" component="div" sx={{ p: 2 }}>
        Filter History Records
      </Typography>
         <Dialog
           onClose={()=>setOpenDatePicker(false)}
           open={openDatePicker}
         >
           {/* <DatePicker
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
           /> */}
         </Dialog>
    </Card>
  )
};

export default memo(HistoryFilter);
