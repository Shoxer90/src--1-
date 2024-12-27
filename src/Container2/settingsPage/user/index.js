import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ClientShopAvatar from "./ClientShopAvatar";
import { Button, Dialog } from "@mui/material";
import ClientInfo from "./ClientInfo";
import AddNewClientInfo from "../../dialogs/AddNewClientInfo";
import ConfirmDialog from "../../dialogs/ConfirmDialog";
import { changeEHDM } from "../../../services/user/userInfoQuery";
import SnackErr from "../../dialogs/SnackErr";
import Loader from "../../loading/Loader";

import styles from "./index.module.scss";

const SettingsUser = ({user, whereIsMyUs, logOutFunc}) => {

  const {t} = useTranslation();
  
  const [confirmSwitch, setConfirmSwitch] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [isLoad, setIsLoad] = useState(false);
  const [message,setMessage] = useState({m:"", t:""});
  
  const switchStatus = async(newStatus) => {
    setIsLoad(true)
    if( user?.isRegisteredInEhdm){
      changeEHDM(newStatus).then((res)=>{
        setIsLoad(false)
      })
    }else {
      setMessage({m:t("settings.isregistrehdm"), t:"error"})
    }
    setConfirmSwitch(false)
  };

  useEffect(() => {
    whereIsMyUs()
  }, [isLoad]);

  return(
  <div className={styles.settings_user}>
    <ClientShopAvatar client={user} />
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
    <Button onClick={()=>setOpenAddDialog(true)}>
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
        setMessage={setMessage}
        openAddDialog={openAddDialog}
        setOpenAddDialog={setOpenAddDialog}
        logOutFunc={logOutFunc}
      />
      {message?.m ?
        <Dialog open={message?.m}>
          <SnackErr type={message?.t} message={message?.m} close={setMessage}/>
        </Dialog> :""
      }
       {isLoad && <Dialog open={isLoad}> <Loader /> </Dialog>}
    </div>
  )
};

export default memo(SettingsUser);
