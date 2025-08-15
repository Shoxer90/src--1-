import { memo, useEffect, useRef, useState } from 'react';
import { Box, InputAdornment, TextField } from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';


const SearchInHistory = () => {
  const [checked, setChecked] =useState(true);
  const ref = useRef(null)

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  useEffect(()=> {
    checked && ref?.current?.focus()
  },[checked]);

  return (
    <Box>
      <TextField 
        InputProps={{
          startAdornment: 
          <InputAdornment position="start">
            <QrCode2Icon fontSize="small" sx={{mr:0.21, color:"#3FB68A",}} onClick={handleChange} />
          </InputAdornment>
        }}
        ref={ref} 
        size='small' 
        style={{fontSize:"70%", width:"100%", padding:"5px"}} 
        autoComplete='off' 
        placeholder='Search Emark in Transactions' 
          sx={{
            height:"15px",
          '& .MuiInputBase-input::placeholder': {
            fontSize: '12px',
          },
        }}
      />
    </Box>
  );
};

export default memo(SearchInHistory);
