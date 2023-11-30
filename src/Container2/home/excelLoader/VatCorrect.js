import React, { memo } from 'react';
import styles from './index.module.scss'

const VatCorrect = ({t}) => (
  <div className={styles.measureCorrect}>
    <p>
        {t("mainnavigation.vatCorrectForm")}
    </p>
  </div>
)

export default memo(VatCorrect);
