import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useState } from 'react';

export default function LangSelect({ size }) {
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const { i18n} = useTranslation();

  const changeLanguage = (str) => {
    if(lang === "hy" || lang === "ru" || lang === "eng"){
      localStorage.setItem("lang", str )
      i18n.changeLanguage(str)
      setLang(str)
    }else{
      localStorage.setItem("lang", "hy" )
      i18n.changeLanguage("hy")
      setLang("hy")
    }
  };

  useEffect(() => {
    changeLanguage(lang)
  }, []);


  return (
    <FormControl >
      <Select
        value={lang}
        sx={{minWidth: 70}} size="small"
        onChange={(e)=>changeLanguage(e.target.value)}
      >
        <MenuItem value={"hy"} select>
          <img alt="" src="/am (2).png" style={{height:size}} />
        </MenuItem>
        <MenuItem value={"eng"} >
         <img alt="" src="/en.png" style={{height:size}} />
        </MenuItem>
        <MenuItem value={"ru"}>
          <img alt="" src="/ru (2).png" style={{height:size}} />
        </MenuItem>
      </Select>
    </FormControl>
  );
}