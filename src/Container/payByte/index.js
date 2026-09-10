import React, { memo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

import ProductList from './ProductList';
import PayFields from './PayFields';
import PayButtons from '../basket/operation/PayButtons';
import styles from './index.module.scss';
import basketStyles from '../basket/index.module.scss';

const PayDialogue = ({
  open,
  close,
  basketContent,
  totalPrice,
  paymentInfo,
  setPaymentInfo,
  setBlockTheButton,
  prepayment,
  handleOpenPhoneDialog,
  multiSaleProducts,
  blockTheButton,
  singleClick,
  setSingleClick,
  setOpenBasket,
  saleMode,
  limitedUsing,
  setOpenDialog,
  cleanEmarks,
  isInvoice,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={close} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 700,
        }}
      >
        {t('basket.usepayment')}
        <IconButton onClick={close} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div className={styles.payDialog}>
          <div className={styles.payDialog_left}>
            <ProductList basketContent={basketContent} />
          </div>
          <div className={styles.payDialog_right}>
            <PayFields
              basketContent={basketContent}
              totalPrice={totalPrice}
              paymentInfo={paymentInfo}
              setPaymentInfo={setPaymentInfo}
              setBlockTheButton={setBlockTheButton}
              prepayment={prepayment}
            />
            <div className={`${styles.payButtonsWrap} ${basketStyles.bask_container_body_footer_icons}`}>
              <PayButtons
                paymentInfo={paymentInfo}
                handleOpenPhoneDialog={handleOpenPhoneDialog}
                multiSaleProducts={multiSaleProducts}
                blockTheButton={blockTheButton}
                totalPrice={totalPrice}
                singleClick={singleClick}
                setSingleClick={setSingleClick}
                setOpenBasket={setOpenBasket}
                saleMode={saleMode}
                limitedUsing={limitedUsing}
                setOpenDialog={setOpenDialog}
                cleanEmarks={cleanEmarks}
                isInvoice={isInvoice}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(PayDialogue);
