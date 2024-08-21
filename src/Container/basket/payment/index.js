import { Button } from "@mui/material";
import { memo, useState } from "react"
import { useTranslation } from "react-i18next";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import styles from "./index.module.scss";

const PaymentContainer = ({openWindow, setOpenWindow}) => {
  const {t} = useTranslation();

  // const [openWindow,setOpenWindow] = useState({
  //   prepayment: false ,
  //   payment: false,
  //   isOpen: false
  // });

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
            sx={{background:"orange"}}
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
            sx={{background:"#3FB68A"}}
          >
            {t("basket.usepayment")}
          </Button>
        </div>
      }

      {openWindow?.isOpen && openWindow?.payment &&
        <div className={styles.buttonGroup_2}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={()=>setOpenWindow({
              prepayment: false ,
              payment: false,
              isOpen: false
            })}
            size="small"
          >
            {t("buttons.back")}
          </Button>
          <h5>{t("basket.usepayment")}</h5>
        </div>
      }
      {openWindow?.isOpen && openWindow?.prepayment &&
         <div className={styles.buttonGroup_2}>
         <Button 
           startIcon={<ArrowBackIcon />} 
           onClick={()=>setOpenWindow({
             prepayment: false ,
             payment: false,
             isOpen: false
           })}
           size="small"
         >
           {t("buttons.back")}
         </Button>
         <h5>{t("basket.useprepayment")}</h5>
       </div>
      }
    </div>
  )
};

export default memo(PaymentContainer);
