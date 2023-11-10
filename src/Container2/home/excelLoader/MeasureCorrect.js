import React, { memo } from 'react';
import styles from './index.module.scss'

const MeasureCorrect = ({t}) => (
  <div className={styles.measureCorrect}>
    {t("mainnavigation.measureCorrectForm")}
    {localStorage.getItem("lang") === "ru" && <div>"шт", "кг", "грамм", "литр", "метр", "кв/м", "куб/м", "другой"</div>}
    {localStorage.getItem("lang") === "en" && <div>"pcs", "kg", "gramm", "liter", "metre", "sq/m", "cub/m", "other"</div>}          
    {localStorage.getItem("lang") === "am" && <div>"հատ", "կգ", "գրամ", "լիտր", "մետր", "ք/մ", "խ/մ", "այլ"</div>}
  </div>
)

export default memo(MeasureCorrect);
