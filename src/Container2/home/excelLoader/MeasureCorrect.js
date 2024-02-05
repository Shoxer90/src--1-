import React, { memo } from 'react';
import styles from './index.module.scss'

const MeasureCorrect = ({t}) => (
  <div className={styles.measureCorrect}>
    {t("mainnavigation.measureCorrectForm")}
    <div>{t("units.pcs")}, {t("units.kg")}, {t("units.gramm")}, {t("units.liter")}, {t("units.metre")}, {t("units.sq/m")}, {t("units.cub/m")}, {t("units.other")}</div>
  </div>
);

export default memo(MeasureCorrect);
