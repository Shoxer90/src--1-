import { Button, Dialog } from "@mui/material";
import { memo, useState } from "react"
import { useTranslation } from "react-i18next";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import styles from "./index.module.scss";
import SnackErr from "../../../Container2/dialogs/SnackErr";

const PaymentContainer = ({
  user,
  openWindow, 
  setOpenWindow, 
  setPaymentInfo, 
  paymentInfo,
  clickToPrepayment,
  setCleanEmarks,
}) => {
  const {t} = useTranslation();
  const [infoDialog, setInfoDialog] = useState({
    isOpen: false,
    message: "",
    type:""
  });
  
  const comeBackBtnFunc = () => {
    setCleanEmarks(false)
    setOpenWindow({
      ...openWindow,
      prepayment: false ,
      invoice:false,
      payment: false,
      isOpen: false
    })
    setPaymentInfo({
      ...paymentInfo,
      isInvoice:false,
      invoiceInfo:{},
      cashAmount: 0,
      cardAmount: 0
    })
  };
 

  return (
    <div>
      {!openWindow?.isOpen && 
        <div className={styles.buttonGroup}>
          <Button 
            variant="contained"
            onClick={ clickToPrepayment }
            sx={{
              background:"orange",
              textTransform: "capitalize",
              fontWeight: "bold",
            }}
          >
            {t("basket.useprepayment")}
          </Button>
          <Button 
            variant="contained"
            onClick={()=> {
              setCleanEmarks(false)
              setOpenWindow({
                ...openWindow,
                payment: true,
                isOpen: true
            })}}
            sx={{
              background:"#3FB68A",
              textTransform: "capitalize",
              fontWeight: "bold",
            }}
          >
            {t("basket.usepayment")}
          </Button>
           <Button 
            variant="contained"
            onClick={()=> {
              if(user?.isRegisteredForTaxService) {
                setOpenWindow({
                  ...openWindow,
                  isOpen: true,
                  payment:false,
                  prepayment:false,
                  invoice: true
                })
              } else{
                setInfoDialog({
                  isOpen: true,
                  message: t("settings.needInvoiceAuth"),
                  type:"error"
                })
              }
            }}
            sx={{
              background:"#189616ff",
              textTransform: "capitalize",
              fontWeight: "bold",
            }}
          >
            e-Invoicing
          </Button>
        </div>
      }

      {openWindow?.isOpen && openWindow?.payment &&
        <div className={styles.buttonGroup_2}>
          <Button 
            startIcon={<ArrowBackIcon fontSize="large" />} 
            onClick={comeBackBtnFunc}
            sx={{
              textTransform: "capitalize",
              fontWeight: 800,    
            }}
          >
          </Button>
          <h5>{t("basket.usepayment")}</h5>
        </div>
      }

      {openWindow?.isOpen && openWindow?.prepayment &&
        <div className={styles.buttonGroup_2}>
          <Button 
            startIcon={<ArrowBackIcon fontSize="large" />} 
            onClick={comeBackBtnFunc}
            sx={{
              textTransform: "capitalize",
              fontWeight: "bold",    
            }}
          >
         </Button>
         
         <h5>{t("basket.useprepayment")}</h5>
       </div>
      }

       {openWindow?.isOpen && openWindow?.invoice &&
        <div className={styles.buttonGroup_2}>
          <Button 
            startIcon={<ArrowBackIcon fontSize="large" />} 
            onClick={comeBackBtnFunc}
            sx={{
              textTransform: "capitalize",
              fontWeight: 800,    
            }}
          >
          </Button>
          <h5>e-Invoice</h5>
        </div>
      }
      <Dialog open={infoDialog?.isOpen} onClose={()=>setInfoDialog({isOpen: false, message:"",type:"info"})}>
        <SnackErr type={infoDialog?.type} message={infoDialog?.message}  close={()=>setInfoDialog({isOpen: false, message:"",type:"info"})}/>
      </Dialog>
    </div>
  )
};

export default memo(PaymentContainer);
