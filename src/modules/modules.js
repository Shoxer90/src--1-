import { enGB} from "moment/locale/en-gb.js";
import hyAm from "moment/locale/hy-am.js";
import moment from "moment";
import ru from 'moment/locale/ru';
import { t } from "i18next";

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
    case "hy":
      return moment.locale('hy-am',hyAm)
    case "eng":
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
    return "մլ";
    case 9:
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
    case "մլ":
    return 8;
   case "այլ":
   return 9;
   default: 
   return 9;
  }
}

export const takeMeMeasureArr = (lang) => {
  if(lang === "ru"){
    return ["шт", "кг", "грамм", "литр", "метр", "кв/м", "куб/м", "мл", "другой"]
  }else if(lang === 'en') {
    return ["pcs", "kg", "gramm", "liter", "metre", "sq/m", "cub/m", "ml", "other" ]
  }else{
    return ["հատ", "կգ", "գրամ", "լիտր", "մետր", "ք/մ", "խ/մ", "մլ", "այլ" ]
  }
};

export const allLanguageMeasures = ["հատ", "կգ", "գրամ", "լիտր", "մետր", "ք/մ", "խ/մ","մլ", "այլ", "pcs", "kg", "gramm", "liter", "metre", "sq/m", "cub/m","ml", "other","шт", "кг", "грамм", "литр", "метр", "кв/м", "куб/м","мл", "другой"]

export const taxCounting = (arr) => {
  let tax = 0;
  arr?.forEach((item) => {
    tax += item?.totalWithoutTaxes
  })
  return tax.toFixed(2)
};

export const getResponseAfterPay = (statusCall) => {
  if(statusCall === 200) {
    return {type:"success", message:t("dialogs.checkCardStatus200")}
  }else if(statusCall === 201) {
    return {type:"success", message:t("dialogs.checkCardStatus201")}
  }else if(statusCall === 410) {
    return {type:"error", message:t("dialogs.checkCardStatus410")}
  }else if(statusCall === 400) {
    return {type:"error", message:t("dialogs.checkCardStatus400")}
  }else if(statusCall === 411) {
    return {type:"error", message:t("dialogs.checkCardStatus412")}
  }else {
    return {type:"error", message:t("dialogs.checkCardStatus400")}
  }
};

export const formatNumberWithSpaces = (number) => {
  return number.toLocaleString('en').replace(/,/g, ' ');
}

export const datePainter = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`
};

export const datePainterClock = (dateString) => {
  const date = new Date(dateString);
  return `${date.getHours().toString().padStart(2, '0')}.${(date.getMinutes() ).toString().padStart(2, '0')}`
}