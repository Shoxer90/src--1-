import { memo, useEffect } from 'react';

import { Button, ButtonGroup, IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { connectScanner, disconnectScanner, getInputChangeFunction, setActiveInput} from '../Container/emarkScanner/ScannerManager';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchBarCodeSlice } from '../store/searchbarcode/barcodeSlice';

const SearchBarcode = ({
  searchValue, 
  setSearchValue, 
  byBarCodeSearching, 
  setFrom,
  stringFrom,
  dataGroup,
}) => {
  const dispatch = useDispatch()
  const {t} = useTranslation();
  const inputSlice = useSelector(state => state?.barcode);

  const handleChange = () => {
    setSearchValue(inputSlice[stringFrom])
  };

   const handleFocus = () => {
    getInputChangeFunction(stringFrom,handleChange)
    setActiveInput((scannedText) => {
      setSearchValue(scannedText);
    });
  };

  const scanUsingScanner = (stringFrom) => {
    getInputChangeFunction(stringFrom,handleChange)
    connectScanner(dispatch)
  };
  
  useEffect(() => {
    setFrom(stringFrom)
  }, [stringFrom]);

  // useEffect(() => {
  //   (searchValue === "" || !searchValue) && byBarCodeSearching(dataGroup,searchValue);
  // }, [searchValue]);


  
  useEffect(() => {
    !inputSlice[stringFrom] && byBarCodeSearching(dataGroup,inputSlice[stringFrom]);
  }, [inputSlice[stringFrom]]);

  useEffect(() => {
  console.log(inputSlice,"inputSlice");
    setSearchValue(inputSlice[stringFrom])
  }, [inputSlice[stringFrom]]);
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
          id={stringFrom}
          onFocus={handleFocus}
          value={inputSlice[stringFrom]}
          onChange={(e)=>{
            // if(!e.target.value){
            //   return byBarCodeSearching(dataGroup,"")
            // }
            dispatch(setSearchBarCodeSlice({
              name: stringFrom,
              value: e.target.value
            }))
          }}
          placeholder={t("mainnavigation.placeholder")}
          style={{width:"80%"}}
        />
        <IconButton type="button" sx={{p: '10px'}} onClick={()=>byBarCodeSearching(dataGroup, searchValue, stringFrom)}>
          <SearchIcon fontSize="medium" />
        </IconButton>
      </Paper> 
      {stringFrom === "main" &&
        <ButtonGroup>
          <Button variant="contained" size="small" onClick={()=>scanUsingScanner(stringFrom)}>
            E-Mark սկաներ
          </Button>
          <Button variant="contained" size="small" onClick={disconnectScanner}>
            ❌ Անջատել
          </Button>
        </ButtonGroup>
      }
    </>
  )
};

export default memo(SearchBarcode);
