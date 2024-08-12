import React, { memo, useEffect } from 'react';

import { IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';


const SearchBarcode = ({
  searchValue, 
  setSearchValue, 
  byBarCodeSearching, 
  setFrom,
  stringFrom
}) => {

  const handleChangeSearch = (e) => {
    setFrom(stringFrom)
    setSearchValue(e.target.value)
  };

  const {t} = useTranslation();

  //##NewNew
  useEffect(() => {
    (searchValue === "" || !searchValue) && byBarCodeSearching("");
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
      <IconButton type="button" sx={{p: '10px'}} onClick={()=>byBarCodeSearching(searchValue)}>
      <SearchIcon fontSize="medium" />
      </IconButton>
   </Paper> 
  )
}

export default memo(SearchBarcode);
