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

  useEffect(() => {
    setLang(localStorage.getItem("lang") === "hy" || localStorage.getItem("lang") === "eng" || localStorage.getItem("lang") === "ru" ? localStorage.getItem("lang"): "hy")
  }, [localStorage.getItem("lang")]);

  const changeLanguage = (str) => {
    localStorage.setItem("lang", str )
    i18n.changeLanguage(str)
   setLang(localStorage.getItem("lang"))
  };

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