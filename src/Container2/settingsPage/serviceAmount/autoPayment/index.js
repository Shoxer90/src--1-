import React, { memo } from "react" ;
import styles from "../index.module.scss"
import { Button, FormControlLabel } from "@mui/material";
import IOSSwitch from "../../../../modules/iosswitch";
import { useTranslation } from "react-i18next";
import { autoPaymentSwitch } from "../../../../services/internal/InternalPayments";


const  AutoPaymentSwitch = ({payData, setPayData, hasAutoPayment}) => {
  const {t} = useTranslation();

  const switchSetBinding = async(bool) => {
    await autoPaymentSwitch(bool)
    return setPayData({
      ...payData,
      isBinding: bool
    })
  }

  return (
    <Button 
      sx={{borderRadius:1, color:"blue", ml:1,  mr:1}}
      size="small"
      startIcon={ <IOSSwitch  
        checked={payData?.isBinding}
        onChange={(e)=>switchSetBinding(e.target.checked)}
      />}
    >
      {/* <FormControlLabel 
        labelPlacement="start"
        className={styles.service_item_simpleRow}
        label={<span style={{fontSize:"70%", padding:"0px", marginRight:"10px"}}>{t("cardService.authomatic")}</span>} 
        control={<IOSSwitch  
          checked={payData?.isBinding}
          onChange={(e)=>switchSetBinding(e.target.checked)}
        />}
      /> */}
      <span style={{fontSize:"75%"}}>{t("cardService.authomatic")}</span>
    </Button>
  )
};

export default memo(AutoPaymentSwitch);
