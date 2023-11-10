import React, { memo } from "react";
import { Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const InfoDialog = ({
  t,
  name, 
  surname, 
  userName, 
  password, 
  setCashierUserName,
  handleClose
}) => {

const closeSuccess = () => {
  setCashierUserName()
  handleClose()
};

  return(
    <Dialog 
      open={userName}
      onClose={closeSuccess}
      style={{padding:"20px", borderRadius:"5px"}}
    >
      <DialogTitle style={{display: "flex", justifyContent: "space-between", background:"#28A745"}}>
        <div>
          <h5>
            {t("dialogs.welldone")} !
          </h5>
        </div>
        <CloseIcon style={{}} onClick={closeSuccess} />
      </DialogTitle>
      <Divider style={{margin:"20px",backgroundColor:"gray"}}/>
      <DialogContent 
        style={{
          fontSize:"120%", 
          color: "gray",
          display:"flex", 
          flexDirection: "column",
          justifyContent:"space-around"
        }}
      >
        <div>{t("settings.create")} <strong>{name} {surname}</strong> {t("settings.success")} </div>   
       
        <div>{t("settings.successTitle")}</div>   
        <div>{t("settings.login")}: <strong> {userName} </strong></div>   
        <div>{t("settings.password")}:<strong> {password} </strong></div>   
      </DialogContent>
    </Dialog>
  )
};

export default memo(InfoDialog);