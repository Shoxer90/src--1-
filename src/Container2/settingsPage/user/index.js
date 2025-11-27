import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PostAddIcon from '@mui/icons-material/PostAdd';
import BorderColorIcon from '@mui/icons-material/BorderColor';
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

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPayForEhdm } from "../../../store/storex/openPaySlice";

import styles from "./index.module.scss";
import InvoiceAuth from "../../../Container/invoice/InvoiceAuth";

const SettingsUser = ({user, whereIsMyUs, logOutFunc, limitedUsing}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmSwitch, setConfirmSwitch] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [question, setQuestion] = useState("")
  const [operation, setOperation] = useState("")
  const [isLoad, setIsLoad] = useState(false);
  const [message,setMessage] = useState({m:"", t:""});
  const [openInvoiceAuth, setOpenInvoiceAuth] = useState(false);
  const [openPass,seOpenPass] = useState(false);

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
        setConfirmSwitch(false)
      })

    }else {
      if(!user?.isRegisteredInEhdm && user?.activeServiceType === 3){
        setQuestion(t("settings.clickEhdmAfterDone30000"))
        setOperation({a:setConfirmSwitch,b:false})

      }else{
        setQuestion(t("authorize.ehdmConnect"))
        setOperation({a:openEhdmActivation,b:true})
        return setConfirmSwitch(true)
      }
    }
    setIsLoad(false)
  };

  const closeSnackWithRefresh = () => {
    setIsLoad(true)
    setMessage({m:"", t:""})
    setIsLoad(false)
    setConfirmSwitch(false)


  }

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
            onClick={()=>{
              if(user?.isEhdmStatus) {
              }else {
                if(!user?.isRegisteredInEhdm){
                  if(user?.activeServiceType === 3){
                    setQuestion(t("settings.clickEhdmAfterDone30000"))
                    setOperation({a:setConfirmSwitch,b:false})
                    return setConfirmSwitch(true)
  
                  }else{
                    setQuestion(t("authorize.ehdmConnect"))
                    setOperation({a:openEhdmActivation,b:true})
                    return setConfirmSwitch(true)
                  }
                }else{
                  questionForConfirmText(0)
                }
              }
            }}
            style={{cursor:"pointer"}}
          />
          <span style={{marginLeft:"10px"}}>{t("settings.ETRM")}</span>
        </label>
        <label style={{marginLeft:"20px"}}>
          <input 
            type="radio"
            name="sale type"
            checked={!user?.isEhdmStatus}
            onClick={()=>{
              if(!user?.isEhdmStatus){
              }else{
                questionForConfirmText(1)
              }
            }}

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
            onClick={()=>questionForConfirmText(2)}
          />
           <span style={{marginLeft:"10px"}}>{t("history.hdm")} <span style={{fontSize:"70%", color:"green"}}> ({t("settings.notAvailableInWeb")})</span> </span> 
        </label>
      </h5>
      <div style={{display:"flex", justifyContent:"space-between", }}>

      {!limitedUsing && 
        <Button 
        startIcon={<ModeIcon />}
        onClick={()=>setOpenAddDialog(true)} variant="contained"  
        sx={{textTransform: "capitalize",m:2, background: "#fd7e14",border:"#fd7e14"}}>
          {t("settings.changepassword")} 
        </Button>
      }
      <Button 
        variant="contained"
        startIcon={<ListAltIcon />}
        onClick={()=>window.location.href = user?.contractLink}
        sx={{letterSpacing:"1px",background: "#fd7e14",textTransform: "capitalize",m:2, border:"orange"}} 
      >
        {t("updates.seeContract")}
      </Button>
      <Button 
        variant="contained"
        startIcon={user?.isRegisteredForTaxService ? <BorderColorIcon /> :<PostAddIcon  />}
        onClick={()=>setOpenInvoiceAuth(true)}
        sx={{letterSpacing:"1px",background: "#fd7e14",m:2,textTransform: "capitalize", border:"orange"}} 
      >
        {user?.isRegisteredForTaxService ? t("updates.invoiceButtonUpdate") : t("updates.invoiceButtonCreate")}
      </Button>
      </div>
      { openInvoiceAuth && 
        <InvoiceAuth 
          isReg={user?.isRegisteredForTaxService}
          open={openInvoiceAuth}
          close={()=>setOpenInvoiceAuth(false)}
        />
      }
    
    </div>
    {user && 
      <ClientInfo 
      isLoad={isLoad} setIsLoad={setIsLoad} limitedUsing={limitedUsing} logOutFunc={logOutFunc} switchStatus={switchStatus} />}


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
          <SnackErr type={message?.t} message={message?.m} close={closeSnackWithRefresh}/>
        </Dialog> :""
      }
       {isLoad && <Dialog open={isLoad}> <Loader /> </Dialog>}
    </div>
  )
};

export default memo(SettingsUser);
