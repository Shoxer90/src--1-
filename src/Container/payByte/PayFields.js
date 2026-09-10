import React, { memo, useMemo } from 'react';
import { Button, ButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { numberSpacing } from '../../modules/numberSpacing';
import styles from './index.module.scss';

const PayFields = ({
  basketContent,
  totalPrice,
  paymentInfo,
  setPaymentInfo,
  setBlockTheButton,
  prepayment = 0,
}) => {
  const { t } = useTranslation();

  const itemsCount = useMemo(
    () => basketContent?.reduce((sum, item) => sum + (+item?.count || 0), 0) ?? 0,
    [basketContent]
  );

  const payableAmount = useMemo(
    () => +(totalPrice - (prepayment || 0)).toFixed(2),
    [totalPrice, prepayment]
  );

  const cashInput = +paymentInfo?.cashAmount || 0;
  const cardInput = +paymentInfo?.cardAmount || 0;
  const paidTotal = cashInput + cardInput;
  const changeAmount = paidTotal > payableAmount && payableAmount > 0
    ? +(paidTotal - payableAmount).toFixed(2)
    : 0;
  const showChange = changeAmount > 0;

  const applyAmounts = (name, value) => {
    setPaymentInfo({
      ...paymentInfo,
      [name]: value,
    });
  };

  const fillFullAmount = (name) => {
    if (payableAmount <= 0) return;

    setBlockTheButton?.(false);
    setPaymentInfo({
      ...paymentInfo,
      cardAmount: name === 'cardAmount' ? payableAmount : 0,
      cashAmount: name === 'cashAmount' ? payableAmount : 0,
    });
  };

  const handleChangeInput = (e) => {
    const valid = /^\d*\.?(?:\d{1,2})?$/;
    const text = e.target.value;
    const isValid = valid.test(text);
    const numericValue = text === '' ? '' : +text;

    if (e.target.name === 'cardAmount' && numericValue !== '' && numericValue > payableAmount) {
      return;
    }

    if (
      text[text.length - 1] === '.' ||
      text === '0' ||
      (text[text.length - 1] === '0' && text[text.length - 2] === '.')
    ) {
      setBlockTheButton?.(true);
      applyAmounts(e.target.name, text);
    } else if (isValid || text === '') {
      setBlockTheButton?.(false);
      applyAmounts(
        e.target.name,
        text === '' || text === '0' || text[text.length - 1] === '.' ? text : +text
      );
    }
  };

  if (!paymentInfo) return null;

  return (
    <div>
      <div className={styles.payBlock}>
        <div className={styles.payBlock_title}>{t('basket.totalndiscount2')}</div>
        <div className={styles.payBlock_row}>
          <span>{t('productinputs.count')}</span>
          <strong>{itemsCount}</strong>
        </div>
        <div className={styles.payBlock_row}>
          <span>{t('history.total')}</span>
          <strong>
            {numberSpacing(payableAmount.toFixed(2))} {t('units.amd')}
          </strong>
        </div>
      </div>

      <div className={styles.payBlock}>
        <div className={styles.payBlock_title}>{t('basket.orderPayment')}</div>
        <div className={styles.payBlock_row}>
          <span>{t('history.card')}</span>
          <ButtonGroup>
            <Button
              size="small"
              style={{ background: '#F69221', color: 'white', padding: '1px 3px' }}
              onClick={() => fillFullAmount('cardAmount')}
            >
              100%
            </Button>
            <input
              autoComplete="off"
              name="cardAmount"
              className={styles.payBlock_input}
              value={paymentInfo?.cardAmount ?? ''}
              onChange={handleChangeInput}
            />
          </ButtonGroup>
        </div>
      </div>

      <div className={styles.payBlock}>
        <div className={styles.payBlock_title}>{t('history.cash')}</div>
        <div className={styles.payBlock_row}>
          <span>{t('history.cash')}</span>
          <ButtonGroup>
            <Button
              size="small"
              style={{ background: '#F69221', color: 'white', padding: '1px 3px' }}
              onClick={() => fillFullAmount('cashAmount')}
            >
              100%
            </Button>
            <input
              autoComplete="off"
              name="cashAmount"
              className={styles.payBlock_input}
              value={paymentInfo?.cashAmount ?? ''}
              onChange={handleChangeInput}
            />
          </ButtonGroup>
        </div>
      </div>

      {showChange && (
        <div className={`${styles.payBlock} ${styles.payBlock_change}`}>
          <div className={styles.payBlock_title}>{t('basket.change')}</div>
          <div className={styles.payBlock_row}>
            <span>{t('basket.payChange')}</span>
            <strong>
              {numberSpacing(changeAmount.toFixed(2))} {t('units.amd')}
            </strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(PayFields);
