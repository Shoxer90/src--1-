import { Button } from "@mui/material";
import { memo } from "react"
import { useTranslation } from "react-i18next";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import styles from "./index.module.scss";

const PaymentContainer = ({
  openWindow, 
  setOpenWindow, 
  setPaymentInfo, 
  paymentInfo
}) => {
  const {t} = useTranslation();
  
  const comeBackBtnFunc = () => {
    setOpenWindow({
      ...openWindow,
      prepayment: false ,
      payment: false,
      isOpen: false
    })
    setPaymentInfo({
      ...paymentInfo,
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
            onClick={()=> setOpenWindow({
              ...openWindow,
              prepayment: true,
              isOpen: true
            })}
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
            onClick={()=> setOpenWindow({
              ...openWindow,
              payment: true,
              isOpen: true
            })}
            sx={{
              background:"#3FB68A",
              textTransform: "capitalize",
              fontWeight: "bold",
            }}
          >
            {t("basket.usepayment")}
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
    </div>
  )
};

export default memo(PaymentContainer);
