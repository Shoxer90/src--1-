import { Button, Dialog, DialogTitle, Divider, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState, memo } from "react";
import { updateUserPassword } from "../../services/user/userInfoQuery";
import ConfirmDialog from "./ConfirmDialog";
import CloseIcon from '@mui/icons-material/Close';
import styles from "./index.module.scss"; 
import validator from "validator";
import SnackErr from "./SnackErr";
import { useTranslation } from "react-i18next";
import LogoutIcon from '@mui/icons-material/Logout';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Loader from "../loading/Loader";

const AddNewClientInfo = ({ setMessage, openAddDialog, setOpenAddDialog, logOutFunc, noWay}) => {
  const {t} = useTranslation();

  const [isLoad,setSetIsLoad] = useState(false);
  
  const [seePass, setSeePass] = useState(false);
  const [seeConfirmPass, setSeeConfirmPass] = useState(false);
  const [logoutConfirm, setOpenLogoutConfirm] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [newPass,setNewPass] = useState({password:"",confirmPass:""});
  const [errMessage,setErrMessage] = useState({m:"", t:""})
  const [submitClick, setSubmitClick] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [infoDialog,setInfoDialog] = useState({
    isOpen:false,
    message:"",
    type: ""
  });

  const handleAddInfo = (e) => {
    setSubmitClick(false)
    setNewPass({
      ...newPass,
      [e.target.name]: e.target.value,
    })
  };
  

  const createNewPass = async() => {
    setSubmitClick(true)
    setOpenConfirm(false)
    setMessage({m:"", t:"", message:"", type:""})
      if(!newPass?.password || !newPass?.confirmPass){

        return setInfoDialog({
          isOpen:true,
          message: t("dialogs.empty"),
          type: "error"
        })
      }
      
      else if(newPass?.password !== newPass?.confirmPass){
        return setInfoDialog({
          isOpen:true,
          message:t("dialogs.mismatch"),
          type: "error"
        })
      }
      setSetIsLoad(true)
      await updateUserPassword({password: newPass?.password}).then((resp) => {
        setSetIsLoad(false)
        if(resp === 200) {
          setMessage({m: t("dialogs.done"), t: "success",message:`${t("dialogs.done")}`, type:"success"})
          setOpenAddDialog(!openAddDialog)
        }else if(resp === 401){
          logOutFunc()
        }else {
          setMessage({m: t("dialogs.wrong"), t: "error", message:`${t("dialogs.wrong")}`, type:"error"})
        }
        setOpenAddDialog(false)
      })
  };

 const closeConfirmDialog = () => {
  setOpenConfirm(false)
  setInfoDialog({isOpen: false, message:"",type:"info"})
 };

 const closeMainDialog = () => {
  setOpenAddDialog(false)
  setNewPass({password:"",confirmPass:""})
 };


//  useEffect(() => {
//   passValidator(newPass?.password)
// }, [newPass?.password]);

  return (
    <Dialog
      open={!!openAddDialog}
      width="lg"
    >
     <DialogTitle className={styles.dialogHeader}>
        <span>{t("settings.changepassword")}</span>

        {!noWay && <CloseIcon onClick={closeMainDialog} />}
      </DialogTitle>
      <Divider />
      <div className={styles.newInfo}>
      <TextField sx={{m:.6}}
          inputProps={{
            style: {
              height: "36px",
              padding:"1px 10px"
            },
          }}
          InputProps={{
            endAdornment: 
              <InputAdornment position="end">
                {!seePass ?
                  <VisibilityIcon style={{padding:2}} onClick={()=>setSeePass(true)} /> :
                  <VisibilityOffIcon style={{padding:2}} onClick={()=>setSeePass(false)} />
                } 
                 <span style={{width:"9px"}}></span>

                {/* <span 
                  onClick={()=>setInfoDialog({
                    isOpen:true,
                    message: t("dialogs.passSuccess"),
                    type: "success"
                  })} 
                  style={{fontWeight:700,color:"green", fontSize:"130%", cursor:"pointer"}}
                >
                  ?
                </span> */}
              </InputAdornment>,
          }}
          helperText={newPass?.password?.length ? errMessage?.m : ""}
          error={!newPass?.password && submitClick}
          autoComplete="off"
          name="password"
          type={seePass ? "text":"password"}
          value={newPass?.password}
          placeholder={`${t("authorize.password")} *`} 
          onChange={(e)=>handleAddInfo(e)}
        />
        
        <TextField sx={{m:.6}} 
          inputProps={{
            style: {
              height: "36px",
              padding:"1px 10px"
            }
          }}
          InputProps={{
            endAdornment: 
              <InputAdornment position="end">
                {!seeConfirmPass ?
                  <VisibilityIcon style={{padding:2}} onClick={()=>setSeeConfirmPass(true)} /> :
                  <VisibilityOffIcon style={{padding:2}} onClick={()=>setSeeConfirmPass(false)} />
                } 
                 <span style={{width:"9px"}}></span>
              </InputAdornment>,
          }}
          error={(!newPass?.confirmPass && submitClick) || newPass?.password !== newPass?.confirmPass}
          helperText={newPass?.confirmPass?.length && newPass?.password !== newPass?.confirmPass ? 
            <div>
              {t("dialogs.mismatch")} 
            </div> 
          : ""}
          autoComplete="off"
          name="confirmPass"
          type={seeConfirmPass ? "text":"password"}
          value={newPass?.confirmPass}
          placeholder={`${t("settings.confirmpassword")} *`}
          onChange={(e)=>{
            setMessage("")
            handleAddInfo(e)
          }}
        />    
        <div className={styles.newInfo_btn}>
          {
            noWay ?
            <Button 
            onClick={()=>setOpenLogoutConfirm(true)}
            variant="contained" 
            sx={{background:"#3FB68A",margin:"10px"}}
          >
             <LogoutIcon style={{margin: "0px 10px"}} />
             {t("menuburger.logout")}
          </Button>:
          <Button
            variant="contained"
            style={{
              background:"#bdbdbd",
              textTransform: "capitalize",
              margin: "8px"   
            }}
            onClick={()=>setOpenAddDialog(false)}
            >
            {t("buttons.cancel")}
          </Button>

          }
          <Button
            variant="contained"
            onClick={()=>{
              if(noWay) {
                createNewPass()
              }else{
                setOpenConfirm(true)
              }
            }}
            disabled={!newPass?.confirmPass || !newPass?.password}
            sx={{textTransform: "capitalize", margin:"8px"}}
          >
            {t("buttons.save")}
          </Button>
        </div>

        <ConfirmDialog
          t={t}
          open={openConfirm}
          title={t("settings.changepassword")}
          question={t("settings.changepassword2")}
          close={setOpenConfirm}
          func={createNewPass}
          content={" "}
        />
        <ConfirmDialog
          t={t}
          open={logoutConfirm}
          close={setOpenLogoutConfirm}
          func={logOutFunc}
          content={t("dialogs.logoutQuestion")}
        />
         {infoDialog?.message &&
        <Dialog open={infoDialog?.isOpen} onClose={()=>setInfoDialog({isOpen: false, message:"",type:"info"})}>
          <SnackErr type={infoDialog?.type} message={infoDialog?.message}  close={()=> closeConfirmDialog({isOpen: false, message:"",type:"info"})}/>
        </Dialog>
      }
        <Dialog open={Boolean(isLoad)} >
          <Loader />
        </Dialog>
      </div>
    </Dialog>
  )
};

export default memo(AddNewClientInfo);
