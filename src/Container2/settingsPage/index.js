import React from "react";
import { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import ClientShopAvatar from "./ClientShopAvatar";
import { Button, Card, Dialog, FormControlLabel } from "@mui/material";
import  { changeEHDM} from "../../services/user/userInfoQuery";
import SettingsContent from "./content";
import SnackErr from "../dialogs/SnackErr";
import ClientInfo from "./ClientInfo";
import AddNewClientInfo from "../dialogs/AddNewClientInfo";
import IOSSwitch from "../../modules/iosswitch";
import ConfirmDialog from "../dialogs/ConfirmDialog";
import styles from "./index.module.scss";
import { useSelector } from "react-redux";

const SettingsPage = ({t, whereIsMyUs, setUserData}) => {

  const [inputLabels, setInputLabels] = useState();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [synth, setSynth] = useState(false);
  const [type, setType] = useState();
  const [message, setMessage] = useState();  
  const [confirmSwitch, setConfirmSwitch] = useState(false);
  const navigate = useNavigate();


  const {user} = useSelector(state => state.user)

  const switchStatus = async(newStatus) => {
    if( user?.isRegisteredInEhdm){
      
      changeEHDM(newStatus).then(()=>{
        return  setSynth(!synth)
      })
    }else {
      setType("error")
      setMessage(t("settings.isregistrehdm"))
    }
    setConfirmSwitch(false)
  };

  const addClientInfo = async(name) => {
    setInputLabels([t("settings.changepassword"), t("settings.confirmpassword")])
    setOpenAddDialog(true)
  };
  
  useEffect(() => {
    whereIsMyUs()
  }, [synth, message]);

  return( 
    <div
      style={{ 
        marginTop: "75px",
        height: "86vh",
      }}
    >
      <div className={styles.settings}>
        <div className={styles.settings_user}>
          <ClientShopAvatar 
            client={ user}
            setClient={setUserData}
          />
          <h4 className={styles.settings_user_name}>
            {user?.firstname} {user?.lastname}  
          </h4>

          <FormControlLabel
            control={<IOSSwitch 
              label={t("settings.switcher")}
              checked={ !!user?.isEhdmStatus}
              onChange={() => {
                 setConfirmSwitch(true)}
              }
              sx={{ m: 1 }} 
            />}
          />
          {user && <ClientInfo />}
        
          <Button onClick={()=>addClientInfo("password")}>
            {t("settings.changepassword")} 
          </Button>
          
        </div>
        <SettingsContent />
      </div>
      {confirmSwitch && 
        <ConfirmDialog
          question={user?.isEhdmStatus ? 
          <p>{t("dialogs.deactivateEhdm")}</p>:
          <p>{t("dialogs.activateEhdm")}</p>
          }
          func={()=>switchStatus(!user?.isEhdmStatus)}
          title={t("settings.status")}
          open={confirmSwitch}
          close={setConfirmSwitch}
          t={t}
        />
      }
      {message && 
        <Dialog open={message}>
          <SnackErr type={type} message={message}/>
        </Dialog>
      }
      <AddNewClientInfo 
        t={t}
        message={message}
        setMessage={setMessage}
        openAddDialog={openAddDialog}
        setOpenAddDialog={setOpenAddDialog}
        label={inputLabels} 
        setInputLabels={setInputLabels}
        type={type}
        setType={setType}
      />
    </div>
  )
};

export default memo(SettingsPage);
