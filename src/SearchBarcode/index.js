import { memo, useEffect, useRef } from 'react';

import { IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import {getInputChangeFunction, setActiveInput} from '../Container/emarkScanner/ScannerManager';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchBarCodeSlice } from '../store/searchbarcode/barcodeSlice';

const SearchBarcode = ({
  searchValue, 
  setSearchValue, 
  byBarCodeSearching, 
  setFrom,
  from,
  stringFrom,
  dataGroup,
  debounceBasket,
  openBasket
}) => {
  const dispatch = useDispatch()
  const {t} = useTranslation();
  const inputSlice = useSelector(state => state?.barcode);
  const inputRef = useRef();

  const handleChange = () => {
    setSearchValue(inputSlice[stringFrom])
  };

  const handleFocus = () => {
    setFrom(stringFrom)
    getInputChangeFunction(stringFrom,handleChange)
    setActiveInput((scannedText) => {
      setSearchValue(scannedText);
    });
  };

  useEffect(() => {
    stringFrom !=="reverse" && setFrom(stringFrom)
  }, [stringFrom]);
  
  useEffect(() => {
    !inputSlice[stringFrom] && stringFrom !=="reverse" && byBarCodeSearching(dataGroup,inputSlice[stringFrom]);
    setSearchValue(inputSlice[stringFrom])
  }, [inputSlice[stringFrom]]);


  useEffect(() => {
    handleFocus()
    if (inputSlice[stringFrom] === "") {
      inputRef.current?.focus();
    }
  }, [inputSlice[stringFrom],debounceBasket, openBasket]);

  return (
    <>
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
          autoComplete='off'
          inputRef={inputRef}
          id={stringFrom}
          onFocus={handleFocus}
          value={inputSlice[stringFrom]}
          onChange={(e)=>{
            dispatch(setSearchBarCodeSlice({
              name: stringFrom,
              value: e.target.value
            }))
          }}
          placeholder={stringFrom === "basket" ? t("mainnavigation.placeholder2"): t("mainnavigation.placeholder")}
          style={{width:"80%"}}
        />
        <IconButton type="button" sx={{p: '10px'}} 
          onClick={()=>{
            if(stringFrom !== "reverse"){
              byBarCodeSearching(dataGroup, searchValue, stringFrom)
            }else{
              setSearchValue(inputSlice[stringFrom])
            }
          }}
        >
          {stringFrom === "basket" ? "": <SearchIcon fontSize="medium" />}
        </IconButton>
      </Paper> 
      
    </>
  )
};

export default memo(SearchBarcode);
