import React, { memo } from "react" ;
import styles from "../index.module.scss"
import { FormControlLabel } from "@mui/material";
import IOSSwitch from "../../../../modules/iosswitch";
import { useTranslation } from "react-i18next";
import { autoPaymentSwitch } from "../../../../services/internal/InternalPayments";


const  AutoPaymentSwitch = ({payData, setPayData,hasAutoPayment}) => {
  const {t} = useTranslation();

  const switchSetBinding = async(bool) => {
    await autoPaymentSwitch(bool)
    return setPayData({
      ...payData,
      isBinding: bool
    })
  }

  return (
    <div style={{display:"flex",justifyContent:"flex-start",marginLeft:"35px"}}>
      <FormControlLabel 
        labelPlacement="start"
        className={styles.service_item_simpleRow}
        sx={{m:0,p:.7}}
        label={<span style={{fontSize:"80%",marginRight:"20px",fontWeight:600}}>{t("cardService.authomatic")}</span>} 
        control={<IOSSwitch  
          // value={payData?.isBinding}
          checked={payData?.isBinding}
          onChange={(e)=>switchSetBinding(e.target.checked)}
        />}
      />
    </div>
  )
};

export default memo(AutoPaymentSwitch);
