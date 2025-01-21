import { Button, Dialog, DialogTitle, Divider, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState, memo } from "react";
import { updateUserPassword } from "../../services/user/userInfoQuery";
import ConfirmDialog from "./ConfirmDialog";
import CloseIcon from '@mui/icons-material/Close';
import styles from "./index.module.scss"; 
import validator from "validator";
import SnackErr from "./SnackErr";
import { useTranslation } from "react-i18next";

const AddNewClientInfo = ({ setMessage, openAddDialog, setOpenAddDialog, logOutFunc}) => {
  const {t} = useTranslation();
  
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
  
  const passValidator = (value) => {
    if (validator.isStrongPassword(value, { 
      minLength: 8, minLowercase: 1, 
      minUppercase: 1, minNumbers: 1, minSymbols: 1 
    })) { 
      setIsValid(true)
      setErrMessage({t:"success", m: <div style={{color:"green"}}>{t("dialogs.validatepass")}</div>}) 
    } else { 
      setIsValid(false)
      setErrMessage({t:"error", m: <div style={{color:"red"}}>{t("dialogs.novalidatepass")}</div>}) 
    } 
  };

  const createNewPass = async() => {
    setSubmitClick(true)
    setOpenConfirm(false)
    setMessage({m:"", t:""})
      if(!newPass?.password || !newPass?.confirmPass){
        return setInfoDialog({
          isOpen:true,
          message: t("dialogs.empty"),
          type: "error"
        })
      }else if(!isValid){
        return setInfoDialog({
          isOpen:true,
          message: t("dialogs.novalidatepass"),
          type: "error"
        })
      }
      else if(newPass?.password !== newPass?.confirmPass){
        return setInfoDialog({
          isOpen:true,
          message:`${t("dialogs.mismatch")} \n\n ${ t("dialogs.passSuccess")} `,
          type: "error"
        })
      }
      await updateUserPassword({password: newPass?.password}).then((resp) => {
        if(resp === 200) {
          setMessage({m: t("dialogs.done"), t: "success"})
          setTimeout(() => [
            logOutFunc()
          ],2500)
        }else if(resp === 401){
          logOutFunc()
        }else {
          setMessage({m: t("dialogs.wrong"), t: "error"})
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


 useEffect(() => {
  passValidator(newPass?.password)
}, [newPass?.password]);

  return (
    <Dialog
      open={!!openAddDialog}
      width="lg"
    >
     <DialogTitle className={styles.dialogHeader}>
        {t("settings.changepassword")}
        <CloseIcon onClick={closeMainDialog} />
      </DialogTitle>
      <Divider />
      <div className={styles.newInfo}>
      <TextField sx={{m:.6}}
          inputProps={{
            style: {
              height: "26px",
              padding:"1px 10px"
            },
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">
              <span 
                onClick={()=>setInfoDialog({
                  isOpen:true,
                  message: t("dialogs.passSuccess"),
                  type: "success"
                })} 
                style={{fontWeight:700,color:"green", fontSize:"130%", cursor:"pointer"}}
              >
                ?
              </span>
            </InputAdornment>,
          }}
          helperText={newPass?.password?.length ? errMessage?.m : ""}
          error={!newPass?.password && submitClick}
          autoComplete="off"
          // autoComplete="new-password"
          name="password"
          type="password"
          value={newPass?.password}
          placeholder={`${t("authorize.password")} *`} 
          onChange={(e)=>handleAddInfo(e)}
        />
        
        <TextField sx={{m:.6}} 
          inputProps={{
            style: {
              height: "26px",
              padding:"1px 10px"
            }
          }}
          error={(!newPass?.confirmPass && submitClick) || newPass?.password !== newPass?.confirmPass}
          helperText={newPass?.confirmPass?.length && newPass?.password !== newPass?.confirmPass ? 
            <div style={{fontSize:"90%"}}>
              {t("dialogs.mismatch")} 
            </div> 
          : ""}
          autoComplete="off"
          name="confirmPass"
          type="password"
          value={newPass?.confirmPass}
          placeholder={`${t("settings.confirmpassword")} *`}
          onChange={(e)=>{
            setMessage("")
            handleAddInfo(e)
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">
              <span style={{width:"9px"}}>
              </span>
            </InputAdornment>,
          }}
        />    
        <div className={styles.newInfo_btn}>
          <Button
            variant="contained"
            style={{
              background:"#bdbdbd",
              textTransform: "capitalize",
              // fontWeight: "bold",    
            }}
            onClick={()=>setOpenAddDialog(false)}
            >
            {t("buttons.cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={()=>setOpenConfirm(true)}
            disabled={!newPass?.confirmPass || !newPass?.password}
            sx={{textTransform: "capitalize"}}
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
         {infoDialog?.message &&
        <Dialog open={infoDialog?.isOpen} onClose={()=>setInfoDialog({isOpen: false, message:"",type:"info"})}>
          <SnackErr type={infoDialog?.type} message={infoDialog?.message}  close={()=> closeConfirmDialog({isOpen: false, message:"",type:"info"})}/>
        </Dialog>
      }
      </div>
    </Dialog>
  )
};

export default memo(AddNewClientInfo);
