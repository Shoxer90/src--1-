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
import ListAltIcon from '@mui/icons-material/ListAlt';
import ModeIcon from '@mui/icons-material/Mode';

import styles from "./index.module.scss";
import { useNavigate, useNavigation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPayForEhdm } from "../../../store/storex/openPaySlice";

const SettingsUser = ({user, whereIsMyUs, logOutFunc, limitedUsing}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpenPayForEhdm = useSelector(state => state?.payForEhdm?.isOpen)
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

  const openEhdmActivation = () => {
    dispatch(setPayForEhdm(true))
    navigate( "/setting/services")
  }

  const switchStatus = async(newStatus) => {
    if(user?.isRegisteredInEhdm || !newStatus){
      setIsLoad(true)
      changeEHDM(newStatus).then((res)=>{
        setIsLoad(false)
        whereIsMyUs()
        setMessage({m: res?.data?.message, t:"success"})
      })
    }else {
      setQuestion(t("authorize.ehdmConnect"))
      setOperation({a:openEhdmActivation,b:true})
      return setConfirmSwitch(true)
    }
    setIsLoad(false)
    setConfirmSwitch(false)
  };

  useEffect(() => {
    whereIsMyUs()
  }, [isLoad]);
  
  return(
  <div className={styles.settings_user}>
    <div style={{marginLeft:"25px"}}>
      <ClientShopAvatar client={user} limitedUsing={limitedUsing}/>
      
      <h4 className={styles.settings_user_name}>
        {user?.legalName ? user?.legalName :
          user?.tradeName? user?.tradeName: 
          `${user?.firstname} ${user?.lastname}`
        }
      </h4>
      <h5 >
        <label>
          <input 
            type="radio"
            name="sale type"
            checked={user?.isEhdmStatus}
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
            readOnly
          />
      <span style={{marginLeft:"10px"}}>{t("history.hdm")} <span style={{fontSize:"70%", color:"green"}}> ({t("settings.notAvailableInWeb")})</span> </span> 
        </label>
      </h5>
      {!limitedUsing && 
        <Button 
        startIcon={<ModeIcon />}
        onClick={()=>setOpenAddDialog(true)} variant="contained"  sx={{textTransform: "capitalize",m:2, background: "#fd7e14",border:"#fd7e14"}}>
          {t("settings.changepassword")} 
        </Button>
      }
      <Button 
        variant="contained"
        startIcon={<ListAltIcon />}
        onClick={()=>window.location.href = user?.contractLink}
        // onClick={()=>window.open(user?.contractLink, '_blank', 'noopener,noreferrer')}
        
        style={{letterSpacing:"1px",background: "#fd7e14",textTransform: "capitalize", border:"orange"}} 
      >
        {t("updates.seeContract")}
      </Button>
    </div>
    {user && <ClientInfo isLoad={isLoad} setIsLoad={setIsLoad} limitedUsing={limitedUsing} logOutFunc={logOutFunc} />}


    <ConfirmDialog
      question={question}
      func={()=>operation?.a(operation?.b)}
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
