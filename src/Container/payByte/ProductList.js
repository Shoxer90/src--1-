import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';

const ProductList = ({ basketContent }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.productList}>
      {basketContent?.map((el, i) => {
        const price = el?.discountedPrice ?? el?.price ?? 0;
        const count = +el?.count || 0;
        const lineTotal = (price * count).toFixed(0);

        return (
          <div key={el?.id ?? i} className={styles.productList_item}>
            <div className={styles.productList_info}>
              <div className={styles.productList_name} title={el?.name}>
                {el?.name}
              </div>
              <div className={styles.productList_details}>
                x{count} · {price.toFixed(0)} {t('units.amd')}
              </div>
            </div>
            <div className={styles.productList_total}>
              {lineTotal} {t('units.amd')}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(ProductList);
