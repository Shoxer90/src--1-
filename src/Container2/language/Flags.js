import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { memo } from "react";

import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";


const Flags = () => {
  const [lang, setLang] = useState();
  const { i18n} = useTranslation();

  useEffect(() => {
    setLang(localStorage.getItem("lang"))
  }, []);

  const changeLanguage = (str) => {
    if(str === "null"|| str === "undefined" || str === null || str === undefined){
      return localStorage.setItem("lang", "en" )
     }
    localStorage.setItem("lang", str )
    i18n.changeLanguage(str)
    return setLang(localStorage.getItem("lang"))
  };

  return(
    <div className={styles.flags}>
      <div className={styles.flags_block}>
        <div className={lang === "am" ? styles.active: null}
        onClick={()=>changeLanguage("am")}>
          <img alt="" src="/am (2).png" />
        </div>
        <div className={lang === "en" ? styles.active: null}
        onClick={()=>changeLanguage("en")}>
         <img alt="" src="/en.png" />
        </div>
        <div className={lang === "ru" ? styles.active: null}
        onClick={()=>changeLanguage("ru")}>
        <img alt="" src="/ru (2).png" />
        </div>
      </div>
    </div>
  )
};

export default memo(Flags);
