import { Box, FormControl, NativeSelect } from "@mui/material";
import React, { useEffect } from "react";
import { memo } from "react";
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from "react-i18next";

const Language = () => {
  const { i18n} = useTranslation();

  const changeLanguage = (lang="hy") => {
    localStorage.setItem("lang", lang )
   return i18n.changeLanguage(lang)
  };

  useEffect(()=> {
    changeLanguage(lang)
  }, [])

  return(
    <FormControl variant="standard" sx={{ minWidth:120,m:1,"&:hover":{color:"orange"} }}>
      <Box style={{display:'flex',flexDirection:"row","&:hover":{color:"orange"}}}>
        <LanguageIcon sx={{margin:"17px",marginTop: "10px"}} />
        <NativeSelect
          disableUnderline={true}
          sx={{paddinTop: 0}}
          defaultValue={localStorage.getItem("lang") || "hy"}
          inputProps={{
            name: 'age',
            id: 'uncontrolled-native',
          }}
          onChange={(e)=>{changeLanguage(e.target.value)}}
        >
         <option value={"eng"}>ENG</option>
          <option value={"ru"}>РУ</option>
          <option value={"hy"}>ՀԱՅ</option>
        </NativeSelect>
      </Box>
    </FormControl>
  )
};

export default memo(Language);
