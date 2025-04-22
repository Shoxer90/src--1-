import React, { memo } from "react";
import { Dialog, DialogContent, DialogTitle,} from "@mui/material";
import styles from "./index.module.scss";
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import { useTranslation } from "react-i18next";

const PayHistoryDetails = ({
  open, 
  close,
  service,
  nextDateFormat,
  price,
  days,
  cardPan,
  cardName,
  type
}) => {
  const {t} = useTranslation();
  return(
    <Dialog 
      open={open} 
      onClose={()=>close(false)}  
      fullWidth
    >
     
      <DialogContent >
      <DialogTitle 
        style={{
          display:"flex", 
          justifyContent:"space-between",
          padding:0
        }}
      >
      <div>{(t("history.check_details")).toUpperCase()}</div>
      <CloseIcon 
        sx={{":hover":{background:"#d6d3d3",borderRadius:"5px"}}}
        onClick={()=>close(false)}
      />
      </DialogTitle>
        <Divider sx={{m:1,backgroundColor:"gray"}} color="black" />
        <div className={styles.history}>
          <div className={styles.history_item}>
            <span>{t("cardService.service")}</span>
            <span>{t(`settings.${service}`)}</span>
          </div>
          <div className={styles.history_item}>
            <span>{t("cardService.paid")}</span>
            <span>{price.toFixed(1)} {t("units.amd")}</span>
          </div>
          { type === 6 &&
            <div className={styles.history_item}>
              <span>{t("emark.availableQr")}</span>
              <span>{days} sms</span>
            </div>
          } 
          { type === 3 && 
            <div className={styles.history_item}>
              <span>{t("cardService.dialogTitle")}</span>
              <span>{days}{t("cardService.dayCount2")}</span>
            </div>
          }
        
        { type === 3 ? 
          <div className={styles.history_item}>
            <span>{t("cardService.activeDue")}</span>
            <span>
            {nextDateFormat?.getUTCDate()>9 ? nextDateFormat?.getUTCDate() : `0${ nextDateFormat?.getUTCDate()}`}.
            {nextDateFormat.getMonth()>8 ? nextDateFormat.getMonth()+1: `0${nextDateFormat.getMonth()+1}`}.
            {nextDateFormat.getFullYear()} {" "} 
          </span>
          </div>: " "}
          {cardPan && <div className={styles.history_item}>
            <span>{t("cardService.cardInfo")}</span>
            <span style={{textAlign:"center"}}>
              <span style={{marginRight:"20px"}}>
                {cardPan[0] == 4 && <img src="/visaNew.png" alt="visaNew" style={{height: "14px", marginBottom:"5px"}} />}
                {cardPan[0] == 5 && <img src="/master2New.png" alt="masterNew" style={{height: "14px", marginBottom:"5px"}} />}
                {cardPan[0] == 9 && <img src="/arcaNew.png" alt="arcaNew" style={{height: "13px", marginBottom:"5px"}} />}
                <span style={{marginLeft:"10px"}}>
                  {cardName}
                </span>
              </span>
              {cardPan}
            </span>
          </div>}
        </div>

      </DialogContent>
    </Dialog>
  )
};

export default memo(PayHistoryDetails);
