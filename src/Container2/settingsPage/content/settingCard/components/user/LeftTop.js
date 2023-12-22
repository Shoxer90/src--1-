import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormControlLabel } from "@mui/material";
import { changeEHDM } from "../../../../../../services/user/userInfoQuery";
import ImageUser from "../../ImageUser";
import IOSSwitch from "../../../../../../modules/iosswitch";
import ConfirmDialog from "../../../../../dialogs/ConfirmDialog";

import styles from "../../index.module.scss";

const LeftTop = ({
  mainContent,
  synth,
  setSynth,
  setMessage,
  setType,
}) => {
  const {t} = useTranslation();
  const [confirmSwitch, setConfirmSwitch] = useState(false);

  const switchStatus = async(newStatus) => {
    if( mainContent?.isRegisteredInEhdm){
      changeEHDM(newStatus).then(()=>{
        return  setSynth(!synth)
      })
    }else {
      setType("error")
      setMessage(t("settings.isregistrehdm"))
    }
    setConfirmSwitch(false)
  };

  return (
    <div className={styles.leftTop_div} >
      <ImageUser  img={mainContent?.logo}/>
      <div className={styles.leftTop_div_title}>
        <FormControlLabel
          style={{alignSelf:"center"}}
          control={<IOSSwitch
            label={t("settings.switcher")}
            checked={ !!mainContent?.isEhdmStatus}
            onChange={(e) => {
              // e.stopPropagation();
              setConfirmSwitch(true)}
            }
            sx={{ m: 1 }} 
          />}
        />
        <div style={{color:"#5a5a5a"}}>
          {`${mainContent?.firstname} ${mainContent?.lastname}`}
        </div>
      </div>
      {confirmSwitch && 
        <ConfirmDialog
          question={mainContent?.isEhdmStatus ? 
          <p>{t("dialogs.deactivateEhdm")}</p>:
          <p>{t("dialogs.activateEhdm")}</p>
          }
          func={()=>switchStatus(!mainContent?.isEhdmStatus)}
          title={t("settings.status")}
          open={confirmSwitch}
          close={setConfirmSwitch}
          t={t}
        />
      }
    </div>
  )
};

export default memo(LeftTop);
