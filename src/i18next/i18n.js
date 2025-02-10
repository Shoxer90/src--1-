import i18n from 'i18next'

import Backend from "i18next-http-backend";
import  LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
  // fallbackLng: localStorage.getItem("lang") || "hy",
  fallbackLng: (localStorage.getItem("lang") || "hy"),
  // fallbackLng: (localStorage.getItem("lang") === "hy" || localStorage.getItem("lang") === "eng" || localStorage.getItem("lang") === "ru" ? localStorage.getItem("lang"): "hy"),
  debug:"true",
  detection: {
    order: ["queryString", "cookie"],
    cache: ["cookie"]
  },
  interpolation:{
    escapeValue: false
  }
})

export default i18n;
