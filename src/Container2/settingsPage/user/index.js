import React, { memo, useEffect, useState } from "react";

import styles from "./index.module.scss";
import ClientShopAvatar from "./ClientShopAvatar";
import { Button, Dialog } from "@mui/material";
import ClientInfo from "./ClientInfo";
import AddNewClientInfo from "../../dialogs/AddNewClientInfo";
import ConfirmDialog from "../../dialogs/ConfirmDialog";
import { changeEHDM } from "../../../services/user/userInfoQuery";
import SnackErr from "../../dialogs/SnackErr";

const SettingsUser = ({user,t, whereIsMyUs}) => {
  const [confirmSwitch, setConfirmSwitch] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [inputLabels, setInputLabels] = useState();
  const [synth, setSynth] = useState(false);
  const [message,setMessage] = useState({m:"", t:""});

  const addClientInfo = async(name) => {
    setInputLabels([t("settings.changepassword"), t("settings.confirmpassword")])
    setOpenAddDialog(true)
  };
  
  const switchStatus = async(newStatus) => {
    if( user?.isRegisteredInEhdm){
      changeEHDM(newStatus).then(()=>{
        return  setSynth(!synth)
      })
    }else {
      setMessage({m:t("settings.isregistrehdm"), t:"error"})
    }
    setConfirmSwitch(false)
  };

  useEffect(() => {
    whereIsMyUs()
  }, [synth, message]);

  return(
  <div className={styles.settings_user}>
    <ClientShopAvatar 
      client={user}
    />
    <h4 className={styles.settings_user_name}>
      {user?.firstname} {user?.lastname}  
    </h4>
    <h6>

      <label>
        <input 
          type="radio"
          name="sale type"
          checked={user?.isEhdmStatus}
          onClick={()=>setConfirmSwitch(true)}
          style={{cursor:"pointer"}}
        />
        <span style={{marginLeft:"10px"}}>{t("settings.ETRM")}</span>
      </label>
      <label style={{marginLeft:"20px"}}>
        <input 
          type="radio"
          name="sale type"
          checked={!user?.isEhdmStatus}
          
          onClick={()=>setConfirmSwitch(true)}
        />
       <span style={{marginLeft:"10px"}}>{t("history.receiptNoHmd")}</span> 
      </label>
    </h6>
    {user && <ClientInfo />}
    <Button onClick={()=>addClientInfo("password")}>
      {t("settings.changepassword")} 
    </Button>
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
      <AddNewClientInfo 
        t={t}
        message={message}
        setMessage={setMessage}
        openAddDialog={openAddDialog}
        setOpenAddDialog={setOpenAddDialog}
        label={inputLabels} 
        setInputLabels={setInputLabels}
      />
      {message?.m ?
        <Dialog open={message?.m}>
          <SnackErr type={message?.t} message={message?.m} close={setMessage}/>
        </Dialog> :""
      }
      
    </div>
  )
};

export default memo(SettingsUser);
