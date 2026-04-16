import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sendEmailVerifyCode, sendPhoneVerifyCode } from '../../../services/auth/auth';
import CountDown from './CountDown';
import { useSuccessSound } from '../../../modules/PlaySound';


const VerifyDialog = ({
  open,
  close,
  content,
  newUser,
  isVerify,
  setIsVerify,
  setInfoDialog,
  sendVerifyCodeRequest,
  verifyCode, setVerifyCode
}) => {
  const {t} = useTranslation();
  const playSuccess = useSuccessSound();
   

  const sendCode = async() => {
    let data = null
    if(content?.type === "email") {
      data = await sendEmailVerifyCode({
        [content.type]: newUser?.email,
        code: verifyCode
      })
    }else if(content?.type === "phone") {
      data = await sendPhoneVerifyCode({
        [content.type]: newUser?.phoneNumber,
        code: verifyCode
      })
    }
    data && data?.status !== 200 && 
    setInfoDialog({
      message:data?.data?.message,
      type:"error",
      isOpen:true
    })
    data && data?.status === 200 &&
    setIsVerify({
      ...isVerify,
      [content?.type]:true,
    }) && playSuccess()
  };

  useEffect(() => {
    close()
  }, [isVerify]);

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogContentText>
          {/* {content?.type === "email" ?
          t("authorize.confirmation1"): ""
        }
           {content?.type === "phone" ?
          t("authorize.confirmation"): ""
        } */}
        {t("authorize.confirmation1")}
        </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            label={t("authorize.verifyCode")}
            type="text"
            fullWidth
            variant="standard"
            value={verifyCode}
            onChange={(e)=>setVerifyCode(e.target.value)}
          />

          <CountDown func={()=>sendVerifyCodeRequest(content?.type)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={close}> {t("buttons.cancel")}</Button>
        <Button onClick={sendCode}>
          {t("buttons.submit")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(VerifyDialog);
