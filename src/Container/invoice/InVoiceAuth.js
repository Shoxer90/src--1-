import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfirmDialog from '../../Container2/dialogs/ConfirmDialog';
import SnackErr from '../../Container2/dialogs/SnackErr';
import { taxRegistration } from '../../services/auth/auth';
import Loader from '../../Container2/loading/Loader';

const initialMessage = {
    text:"",
    type:""
  }

  const initialState = {
    password: "",
    username: "",
  }
const InVoiceAuth = ({isReg, open, close}) => {
  const {t}= useTranslation()
  const [auth, setAuth] = useState(initialState)
  const [openConfirm, setOpenConfirm] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(initialMessage)
  const [respMessage, setRespMessage] = useState(initialMessage)

  const handleChange = (e) => {
    setMessage(initialMessage)
    setClicked(false)
    setAuth({...auth, [e.target.name]: e.target.value})
  }

  const confirmOperation = async() => {
    setIsLoading(true)
    setOpenConfirm(false)
    const response = await taxRegistration(auth)
    setIsLoading(false)
    setRespMessage({
      type: response?.type,
      text: response?.text
    })
    setTimeout(()=>{
      close()
    },3000)
  }

  const saveClick = () => {
    setClicked(true)
    if(auth?.password && auth?.username) {
      setOpenConfirm(true)
    }else{
      setMessage({
        text: t("dialogs.required"),
        type:"error"
      })
    }
  };

  useEffect(() => {
    setAuth(initialState)
  }, []);
  
  return (
    <Dialog open={open} maxWidth="md">
      <DialogTitle>{isReg ? t("settings.invoicingAuthUpdate"): t("settings.invoiceAuthTitle")}</DialogTitle>
        <IconButton
            aria-label="close"
            onClick={close}
            sx={(theme) => ({
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >   
          <CloseIcon />
        </IconButton>
      <DialogContent dividers>
        {isLoading ? 
          <Dialog open={isLoading}>
            <Loader />
          </Dialog>: 
        <>
          <TextField
          inputProps={{ autoComplete: 'off', form: { autoComplete: 'off' } }}
            error={!auth.username && clicked}
            value={auth.username}
            size="small"
            style={{margin:"10px", width:"60%"}}
            type="text"
            placeholder={`${t("settings.login")} *`}
            name="username"
            onChange={(e)=>handleChange(e)}
          />
          <TextField
            inputProps={{ autoComplete: 'new-password' }}
            error={!auth?.password && clicked}
            value={auth.password}
            size="small"
            style={{margin:"10px",width:"60%"}}
            type="password"
            placeholder={`${t("authorize.password")} *`}
            name="password"
            onChange={(e)=>handleChange(e)}
          />
          
        </>

      }
      <div style={{color:"red", height:"30px", marginLeft:"10px"}}>{message?.text}</div>
      <DialogActions>
        <Button onClick={close} sx={{textTransform: "capitalize"}}>{t("buttons.close")}</Button>
        <Button sx={{textTransform: "capitalize"}} onClick={saveClick}>{t("buttons.save")}</Button>
      </DialogActions>
      {openConfirm &&
        <ConfirmDialog
          func={confirmOperation}
          open={openConfirm}
          close={()=>setOpenConfirm(false)}
          question={t("dialogs.saveData")}
          content={" "}
          nobutton={false}
        />
      }
       <Dialog open={respMessage?.text}>
        <SnackErr 
          message={respMessage?.text} 
          type={respMessage?.type} 
          close={()=>setRespMessage(initialMessage)} 
        />
      </Dialog>
      </DialogContent>

    </Dialog>
  )
}

export default InVoiceAuth