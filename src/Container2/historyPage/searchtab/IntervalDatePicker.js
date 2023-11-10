// import { Box, TextField } from '@mui/material';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { DateRangePicker } from '@mui/x-date-pickers-pro';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React, { useState } from 'react';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

export default function IntervalDatePicker() {
  const [value, setValue] = useState([null, null]);

  return (
    <div>
      <div style={{height:"10px", width:"10px",color:"red"}}></div>
      <div style={{height:"10px", width:"10px",color:"red"}}></div>
      <div style={{height:"10px", width:"10px",color:"red"}}></div>
      <div style={{height:"10px", width:"10px",color:"red"}}></div>
      <div style={{height:"10px", width:"10px",color:"red"}}></div>
      <div style={{height:"10px", width:"10px",color:"red"}}></div>
      <div style={{height:"10px", width:"10px",color:"red"}}></div>
      <div style={{height:"10px", width:"10px",color:"red"}}></div>
      <div style={{height:"10px", width:"10px",color:"red"}}></div>
      <div style={{height:"10px", width:"10px",color:"red"}}></div>

    </div> 
  );
};
