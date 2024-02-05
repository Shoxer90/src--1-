import React, { memo } from 'react';
import styles from './index.module.scss'

const BarCodeCorrect = ({t}) => (
  <div className={styles.measureCorrect}>
    {t("mainnavigation.barcodeCorrectForm")}
    
  </div>
);

export default memo(BarCodeCorrect);
