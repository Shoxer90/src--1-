import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ClientShopAvatar from "./ClientShopAvatar";
import { Button, Dialog } from "@mui/material";
import ClientInfo from "./ClientInfo";
import AddNewClientInfo from "../../dialogs/AddNewClientInfo";
import ConfirmDialog from "../../dialogs/ConfirmDialog";
import { changeEHDM, changeToPhysicalHDM } from "../../../services/user/userInfoQuery";
import SnackErr from "../../dialogs/SnackErr";
import Loader from "../../loading/Loader";

import styles from "./index.module.scss";

const SettingsUser = ({user, whereIsMyUs, logOutFunc, limitedUsing}) => {

  const {t} = useTranslation();
  
  const [confirmSwitch, setConfirmSwitch] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [question, setQuestion] = useState("")
  const [operation, setOperation] = useState("")
  const [isLoad, setIsLoad] = useState(false);
  const [message,setMessage] = useState({m:"", t:""});

  const questionForConfirmText = (num) => {
    switch (num){
      case 0:
      setQuestion(t("dialogs.activateEhdm"))
      setOperation({a:switchStatus,b:true})
      break;
      case 1:
        setQuestion(t("dialogs.activateEhdm3"))
      setOperation({a:switchStatus,b:false})
      break;
      case 2:
        setQuestion(t("dialogs.activateEhdm2"))
        setOperation({a:switchToHDM,b:2})
      break;
    }
    setConfirmSwitch(true)
  }
  const switchToHDM = (num) => {
    setIsLoad(true)
    changeToPhysicalHDM(num).then((res) => {
    setIsLoad(false)
      if(res?.status=== 200) {
        whereIsMyUs()
        setMessage({m: res?.data?.message, t:"success"})
      }
    })
    setConfirmSwitch(false)
  };

  const switchStatus = async(newStatus) => {
    setIsLoad(true)
    if(user?.isRegisteredInEhdm || !newStatus){
      changeEHDM(newStatus).then((res)=>{
        whereIsMyUs()
        setMessage({m: res?.data?.message, t:"success"})
      })
    }else {
      setMessage({m:t("settings.isregistrehdm"), t:"error"})
    }
    setIsLoad(false)
    setConfirmSwitch(false)
  };

  useEffect(() => {
    whereIsMyUs()
  }, [isLoad]);
  return(
  <div className={styles.settings_user}>
    <ClientShopAvatar client={user} limitedUsing={limitedUsing}/>
    <h4 className={styles.settings_user_name}>
      {user?.firstname} {user?.lastname}  
    </h4>
    <h6>

      <label>
        <input 
          type="radio"
          name="sale type"
          checked={user?.isEhdmStatus}
          // onClick={()=>setConfirmSwitch(true)}
          onClick={()=>questionForConfirmText(0)}
          style={{cursor:"pointer"}}
        />
        <span style={{marginLeft:"10px"}}>{t("settings.ETRM")}</span>
      </label>
      <label style={{marginLeft:"20px"}}>
        <input 
          type="radio"
          name="sale type"
          checked={!user?.isEhdmStatus}
          // onClick={setConfirmSwitch(true)}
          onClick={()=>questionForConfirmText(1)}

          style={{cursor:"pointer"}}
        />
       <span style={{marginLeft:"10px"}}>{t("history.receiptNoHmd")}</span> 
      </label>
      <label style={{marginLeft:"20px"}}>
        <input 
          type="radio"
          name="sale type"
          style={{color:"darkgrey"}}
          checked={user?.ehdmMode === 2}
          onClick={()=>questionForConfirmText(2)}
        />
       <span style={{marginLeft:"10px"}}>{t("history.hdm")}</span> 
      </label>
    </h6>
    {user && <ClientInfo />}

    {!limitedUsing && <Button onClick={()=>setOpenAddDialog(true)} variant="contained"  sx={{textTransform: "capitalize",m:2}}>
      {t("settings.changepassword")} 
    </Button>}

    <ConfirmDialog
      question={question}
      func={()=>operation?.a(operation?.b)}
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
