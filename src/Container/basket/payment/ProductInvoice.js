import { useEffect, useState, memo} from "react";
import styles from "../index.module.scss";
import { numberSpacing } from "../../../modules/numberSpacing";
import { Button, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import NewCustomerContainer from "../../invoice/NewCustomerContainer";

const ProductInvoice = ({
  totalPrice,
  paymentInfo, 
  setPaymentInfo,
  setBlockTheButton,
  prepayment,
  setOpenInvoiceDialog,
  openInvoiceDialog,
  deleteBasketItem,
  basketContent,
  setOpenBasket,
  changeCountOfBasketItem

}) => {
  const {t} = useTranslation()
  const [isFormValid, setIsFormValid] = useState(false);
  const [validTin, setValidTin] = useState(false);
  const [flag, setFlag] = useState();

  const setCash = (total) => {
    setPaymentInfo((prev) => ({
      ...prev,
      cardAmount: total,
    }));
    return setFlag(total)
  };

  useEffect(() => {
    setCash(totalPrice)
    !paymentInfo?.cardAmount && !paymentInfo?.cashAmount && !isFormValid && setBlockTheButton(true);
  }, [totalPrice, flag, paymentInfo?.discount, paymentInfo?.cardAmount]);

  return(
      paymentInfo && <div className={styles.saleInfoInputs}>
      <div>
        <span>
          {t("history.total")} 
        </span>
        <input 
          value={totalPrice && numberSpacing(totalPrice.toFixed(2))}
          readOnly
        />
      </div>

      {prepayment ?
        <div>
          <span style={{fontSize:"95%"}}>
            {t("history.combo")}
          </span>
          <input
            value={prepayment.toFixed(2)}
            readOnly
          />
        </div>:""
      }
      {paymentInfo?.prePaymentAmount && totalPrice - paymentInfo?.prePaymentAmount>0 ? 
        <div style={{color:'orangered',fontSize:"100%",fontWeight:"800", marginTop:"10px"}}>
          <span>
            {t("basket.amount")} { `${( totalPrice - paymentInfo?.prePaymentAmount).toFixed(2)}  ${t("units.amd")}`}
          </span>
        </div>
      :""}
  
      { openInvoiceDialog && 
        <NewCustomerContainer
          open={openInvoiceDialog}
          isFormValid={isFormValid} 
          setIsFormValid={setIsFormValid}
          setPaymentInfo={setPaymentInfo}
          paymentInfo={paymentInfo}
          validTin={validTin}
          setValidTin={setValidTin}
          close={()=>setOpenInvoiceDialog(false)}
          totalPrice={totalPrice}
          basketContent={basketContent}
          deleteBasketItem={deleteBasketItem}
          setOpenBasket={setOpenBasket}
          changeCountOfBasketItem={changeCountOfBasketItem}

        />
      }
            
      <Button 
        size="small"
        style={{
          background:"orange", 
          display:"flex",
          justifyContent:"space-between", 
          color:"white", 
          margin:"10px auto"}} 
          onClick={()=>setOpenInvoiceDialog(true)}
        >
         {paymentInfo?.isInvoice ? t("settings.seeInvoiceData"):t("settings.addInvoiceData")}
        </Button>
        
        <div style={{height:"20px", color:"orange", display:"flex", justifyContent:"flex-start"}}>
          <span>{paymentInfo?.customer_Name}</span>
          <span style={{marginLeft:"10px"}}> {paymentInfo?.customer_Phone}</span>
        </div>
      <Divider flexItem sx={{bgcolor:"black"}} />
    </div>
  )
};

export default memo(ProductInvoice);
