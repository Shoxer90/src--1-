import { enGB} from "moment/locale/en-gb.js";
import hyAm from "moment/locale/hy-am.js";
import moment from "moment";
import ru from 'moment/locale/ru';
import { useTranslation } from "react-i18next";

export const dateFormat = (dateString) => {
  const newMonth = dateString.getMonth()+1;
  return `${newMonth}-${dateString.getDate()}-${dateString.getFullYear()}`;
};

export const getBasketContent = async() => {
  const data = await JSON.parse(localStorage.getItem("bascket1"))
  return data
}
export const dateTitleLang = () => {
  switch(localStorage.getItem("lang")){
    case "ru":
      return moment.locale('ru',ru)
    case "am":
      return moment.locale('hy-am',hyAm)
    case "en":
      return moment.locale('en',enGB)
    default:
      return moment.locale('en',enGB)
  }
};

export const getMeasureByNum = async(num) => {
   switch(num) {
    case 1:
      return "հատ";
    case 2:
      return "կգ";
    case 3: 
      return "գրամ";
    case 4:
      return "լիտր";
    case 5:
      return "մետր";
    case 6 :
      return "ք/մ";
    case 7:
      return "խ/մ";
    case 8:
    return "այլ";
    default: 
    return "այլ"
  }
}
export const getMeasureByStr = async(num) => {
  switch(num) {
   case "հատ":
     return 1;
   case "կգ":
     return 2;
   case "գրամ": 
     return 3;
   case "լիտր":
     return 4;
   case "մետր":
     return 5;
   case "ք/մ":
     return 6;
   case "խ/մ":
     return 7;
   case "այլ":
   return 8;
   default: 
   return 8;
  }
}
export const MEASURE_RU=["шт", "кг", "грамм", "литр", "метр", "кв/м", "куб/м", "другой"]
export const MEASURE_EN=["pcs", "kg", "gramm", "liter", "metre", "sq/m", "cub/m", "other"]
export const MEASURE_AM=["հատ", "կգ", "գրամ", "լիտր", "մետր", "ք/մ", "խ/մ", "այլ"]

export const takeMeMeasureArr = (lang) => {
  if(lang === "ru"){
    return ["шт", "кг", "грамм", "литр", "метр", "кв/м", "куб/м", "другой"]
  }else if(lang === 'en') {
    return ["pcs", "kg", "gramm", "liter", "metre", "sq/m", "cub/m", "other" ]
  }else{
    return ["հատ", "կգ", "գրամ", "լիտր", "մետր", "ք/մ", "խ/մ", "այլ" ]
  }
};
export const allLanguageMeasures = ["հատ", "կգ", "գրամ", "լիտր", "մետր", "ք/մ", "խ/մ", "այլ", "pcs", "kg", "gramm", "liter", "metre", "sq/m", "cub/m", "other","шт", "кг", "грамм", "литр", "метр", "кв/м", "куб/м"]