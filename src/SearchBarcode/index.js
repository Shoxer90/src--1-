import React, { memo, useEffect, useState } from 'react';

import { Button, IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';


const SearchBarcode = ({
  searchValue, 
  setSearchValue, 
  byBarCodeSearching, 
  setFrom,
  stringFrom,
  dataGroup
}) => {
  
  const handleChangeSearch = (e) => {
    setSearchValue(e.target.value)
    setFrom(stringFrom)
  };

	const connectSerial = async () => {
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });

      const reader = port.readable.getReader();
      let decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        // setSearchValue((prev) => prev + decoder.decode(e.target.value))
      }
      reader.releaseLock();
    } catch (error) {
      alert("error")
    }
  };



  const {t} = useTranslation();

  //##NewNew
  useEffect(() => {
    (searchValue === "" || !searchValue) && byBarCodeSearching(dataGroup, "");
    // searchValue && byBarCodeSearching(dataGroup, searchValue);
  }, [searchValue]);

  return (
    <Paper
      component="form"
      style={{border:"solid #FFA500 2px"}}
      sx={{
        p: '2px 4px', 
        display: 'flex', 
        justifyContent:"space-between",
        height: 35, 
      }}
    >
      <InputBase
        value={searchValue}
        onChange={(e)=>handleChangeSearch(e)}
        placeholder={t("mainnavigation.placeholder")}
        autoFocus
        style={{width:"80%"}}
      />
      <IconButton type="button" sx={{p: '10px'}} onClick={()=>byBarCodeSearching(dataGroup, searchValue)}>
       <SearchIcon fontSize="medium" />
      </IconButton>
      <Button onClick={connectSerial}>connect</Button>
   </Paper> 
  )
}

export default memo(SearchBarcode);
