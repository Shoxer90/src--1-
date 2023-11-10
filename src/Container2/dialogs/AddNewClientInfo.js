import { Button, Dialog, DialogTitle, Divider, TextField } from "@mui/material";
import React from "react";
import { useState } from "react";
import { memo } from "react";
import { updateUserPassword } from "../../services/user/userInfoQuery";
import ConfirmDialog from "./ConfirmDialog";
import CloseIcon from '@mui/icons-material/Close';
import styles from "./index.module.scss";

const AddNewClientInfo = ({label, message, setMessage, t, openAddDialog, setType, setOpenAddDialog}) => {
  const [addData, setAddData] = useState({id:0});
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleAddInfo = (name, value) => {
    setAddData({
      ...addData,
      [name]: value,
    })
  };

  const sendNewInfo = () => {
    if(label?.length + 1 === Object.values(addData)?.length){
      addfunc(addData)
    }else{
      setMessage(t("dialogs.required"))
      setTimeout(() => {
        setMessage()
      }, 3000)
    }
  };

  const addfunc = async (data) => {
    setMessage("")
      if((data[t("settings.changepassword")] === "" || data[t("settings.changepassword")] === undefined) ||
        (data[t("settings.confirmpassword")] === "" || data[t("settings.confirmpassword")] === undefined)
      ){
        setType("error")
        setMessage(t("dialogs.empty"))
      }else if(data[t("settings.changepassword")] !== data[t("settings.confirmpassword")]){
        setType("error")
        setMessage(t("dialogs.mismatch"))
      }else{
         await updateUserPassword({"password":`${data[t("settings.changepassword")]}`}).then((resp) => {
          setMessage(resp)
          setType("success")
          setMessage(t("dialogs.done"))
          setOpenAddDialog(false)
        })
      }
    closeDialogue()
  };

 const closeDialogue = () => {
  setTimeout(()=>{
    setMessage("")
    setType("")
  },3000)
 }
  
  return (
    <Dialog
      open={openAddDialog}
      onClose={()=>setOpenAddDialog(false)}
      width="lg"
    >
     <DialogTitle className={styles.dialogHeader}>
        {t("settings.changepassword")}
        <CloseIcon onClick={()=>setOpenAddDialog(false)} />
      </DialogTitle>
      <Divider />
      <div className={styles.newInfo}>
        {label && label.map((inputName, index) => (
          inputName !== "id" ?
            <div key={index}>
              <TextField 
                sx={{width: "fit-content"}}
                type="password"
                label={inputName} 
                value={addData.inputName}
                name={inputName}
                onChange={(e) => handleAddInfo(e.target.name, e.target.value)}
              />
            </div> : null
        ))}
        <div className={styles.newInfo_btn}>
          <Button
            variant="contained"
            style={{background:"#bdbdbd"}}
            onClick={()=>setOpenAddDialog(false)}
            >
            {t("buttons.cancel")}
          </Button>
          <Button
            variant="contained"
            style={{background:"darkgreen"}}
            onClick={()=>setOpenConfirm(true)}
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
          func={()=>sendNewInfo()}
          content={" "}
        />
      </div>
    </Dialog>
  )
};

export default memo(AddNewClientInfo);
