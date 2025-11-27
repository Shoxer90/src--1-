import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, useMediaQuery, useTheme,Checkbox,FormControlLabel } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import CustomerInputs from './CustomerInputs';
import TinInput from './TinInput';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfirmDialog from '../../Container2/dialogs/ConfirmDialog';
import ProductTableInvoice from './productInvoice/index';

const NewCustomerContainer = ({
  open, 
  close, 
  isFormValid, 
  setIsFormValid,
  setPaymentInfo,
  paymentInfo,
  validTin,
  setValidTin,

  basketContent,
  totalPrice, 
  deleteBasketItem,
  setOpenBasket,
  changeCountOfBasketItem

}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [openAttention, setOpenAttention] = useState(false);
  const [isReqTin, setIsReqTin] = useState(true)

  const endOperation = async() => {
    setPaymentInfo({
      ...paymentInfo,
      isInvoice: true
    })
    close()
  };

  const cancelOperation = async() => {
    setPaymentInfo({
      ...paymentInfo,
      invoiceInfo: {},
      isInvoice: false
    })
    close()
  };

  const tinReqCondition = () => {
     return isReqTin ?
     paymentInfo?.partnerTin?.length === 8 :
     !isReqTin ? true: false
  }

  const allKeysFilled = (obj) => {
    const isValid = Object.values(obj)
    .every((value) => value !== undefined &&
      value !== null && 
      value !== ""
    ) 
     && tinReqCondition()
    setIsFormValid(isValid)
  };

  useEffect(() => {
   paymentInfo?.invoiceInfo && allKeysFilled(paymentInfo?.invoiceInfo)
  }, [paymentInfo?.invoiceInfo, paymentInfo?.partnerTin, isReqTin]);

  useEffect(() => {
   !paymentInfo?.partnerTin && setPaymentInfo({
      ...paymentInfo,
      "invoiceInfo": {
        "sourceCountryId": "8c961171-8f04-32ac-8dd0-baf0903d22e5",
        "sourceRegionId": undefined,
        "sourceCommunityId": undefined,
        "sourceResidenceId": undefined,
        "sourceStreet": undefined,
        "destinationCountryId": "8c961171-8f04-32ac-8dd0-baf0903d22e5",
        "destinationRegionId": undefined,
        "destinationCommunityId": undefined,
        "destinationResidenceId": undefined,
        "destinationStreet": undefined
      }
    })
  }, [])
   
  return (
    <Dialog open ={open} fullScreen={fullScreen} maxWidth="800px">
        
      <DialogTitle>{t("settings.createInvoice")}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={()=>setOpenAttention(true)}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >   
        <CloseIcon />
      </IconButton>
      {/* <DialogContent dividers style={{width:"750px",height:"400px",overflow: "hidden" }} > */}
      <DialogContent dividers style={{width:"auto" }} >
         <FormControlLabel
            control={
              <Checkbox  onChange={(e)=>setIsReqTin(!e.target.checked)} name="jason" />
            }
            label={t("invoice.affordWithoutTin")}
          />
        <TinInput
          setPaymentInfo={setPaymentInfo}
          paymentInfo={paymentInfo}
          validTin={validTin}
          setValidTin={setValidTin}
          isReqTin={isReqTin}
        />
        <CustomerInputs 
          setPaymentInfo={setPaymentInfo}
          paymentInfo={paymentInfo}
        />
              
        <ProductTableInvoice
          basketContent={basketContent}
          totalPrice={totalPrice}  
          deleteBasketItem={deleteBasketItem} 
          setOpenBasket={setOpenBasket}
          closeInvoiceDialog = {close}
          changeCountOfBasketItem={changeCountOfBasketItem}

        />
        
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>setOpenAttention(true)}>Cancel</Button>
        <Button onClick={endOperation} disabled={!isFormValid || (!validTin && isReqTin)}>{t("buttons.continue")}</Button>
      </DialogActions>
        <ConfirmDialog
          open={openAttention}
          close={()=>setOpenAttention(false)}
          func={cancelOperation}
          content={t("settings.cleanInvoiceData")}
      />
    </Dialog>
  )
}

export default NewCustomerContainer