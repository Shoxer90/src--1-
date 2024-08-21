import { Dialog, DialogTitle, Divider } from "@mui/material";
import React from "react";
import { memo } from "react";
import CloseIcon from '@mui/icons-material/Close';
import styles from "./index.module.scss";
import PassChange from "../../Authorization/loginAuth/resetpass/PassChange";

const AddNewClientInfo = ({ t, openAddDialog, setOpenAddDialog}) => {
  return (
    <Dialog
      open={!!openAddDialog}
      onClose={()=>setOpenAddDialog(false)}
    >
      <DialogTitle className={styles.dialogHeader}>
        <span style={{color:"orange",fontSize:"130%",fontWeight:600, textAlign:"start", marginRight:"20px "}}>{t("settings.changepassword")}</span>
        <CloseIcon onClick={()=>setOpenAddDialog(false)} />
      </DialogTitle>
      <Divider />
      <PassChange token={localStorage.getItem("token")} />
    </Dialog>
  )
};

export default memo(AddNewClientInfo);
