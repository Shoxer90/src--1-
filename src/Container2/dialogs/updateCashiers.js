import { useState, memo } from "react";
import { useTranslation } from "react-i18next";
import CloseIcon from '@mui/icons-material/Close';

import { Button,  Dialog, DialogTitle,Divider } from "@mui/material";

import SnackErr from "./SnackErr";
import { updateCashiersData } from "../../services/user/userInfoQuery";

import styles from "./index.module.scss";

const UpdateCashiers = ({
  updateDial,
  setUpdateDial,
  updateContent, 
  setUpdateContent,
  logOutFunc,
  createMessage
  }) => {
  const {t} = useTranslation();

 const handleUpdateCashier = async() => {
  if(updateContent?.email && updateContent?.firstName && updateContent?.userName) {

    await updateCashiersData(updateContent).then((res) => {
      if(res?.status === 200) {
        createMessage({
          type:"success",
          message: t("dialogs.done")

        })
        setUpdateDial(false)
      }else if(res?.response?.status === 405) {
        createMessage({
          message:t("settings.dublicatemail"),
          type:"error"
      })
      }else if(res?.response?.status === 401){
        logOutFunc()
      }
    })
  }else{
    createMessage({
      message:t("dialogs.empty"),
      type:"error"
    })
  }
};
  const handleChangeInputs = (e) => {
    setUpdateContent({
      ...updateContent,
      [e.target.name]: e.target.value
    })
  };

  return (
    <Dialog open={!!updateDial} >

    <DialogTitle 
      style={{
        display:"flex", 
        justifyContent:"space-between",
        alignContent:"center", 
        padding:"0px", 
        margin:"10px 20px"
      }}
    >
      {t("settings.update")}
      <CloseIcon 
        sx={{":hover":{background:"#d6d3d3",borderRadius:"5px"}}}
        onClick={()=>setUpdateDial(!updateDial)}
      /> 
    </DialogTitle>
    <Divider style={{backgroundColor:"gray"}} />

      <div className={styles.update}>
          <div className={styles.update_item}>
            <div>{`${t("settings.name")} *`}</div>
            <input
              style={{border:!updateContent?.firstName ? "solid red 2px": null, padding:"0px 5px"}}
              type="text"
              name="firstName"
              value={updateContent?.firstName}
              onChange={(e)=>handleChangeInputs(e)}
            />
          </div>
          <div className={styles.update_item}>
            <div>{t("settings.surname")}</div>
            <input
              style={{ padding:"0px 5px"}}
              type="text"
              name="lastName"
              value={updateContent?.lastName}
              onChange={(e)=>handleChangeInputs(e)}
            />
          </div>
          <div className={styles.update_item}>
           <div>{`${t("authorize.username")} *`} </div>
            <input
              style={{border:!updateContent?.userName ? "solid red 2px": null, padding:"0px 5px"}}
              type="text"
              name="userName"
              value={updateContent?.userName}
              onChange={(e)=>handleChangeInputs(e)}
              readOnly
            />
          </div>
        
          <div className={styles.update_item}>
            <div>{`${t("settings.email")} *`}</div>
            <input
              style={{fontSize:"75%",width:"72%",border:!updateContent?.email ? "solid red 2px": null, padding:" 0px 5px"}}
              type="text"
              name="email"
              value={updateContent?.email}
              onChange={(e)=>handleChangeInputs(e)}
            />
          </div>
          <div style={{alignContent:"center", fontSize:"70%"}}>
            {/* {
              !!message &&
               <SnackErr type="error" close={setMessage}  message={message} />
            } */}
          </div>
          <div className={styles.update_item}>
            <Button
              variant="contained"
              onClick={()=>setUpdateDial(false)}
              sx={{textTransform: "capitalize", background:"darkgrey"}}
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdateCashier}
              sx={{textTransform: "capitalize", background:"green"}}
            >
              {t("buttons.update")}
            </Button>
          </div>
        </div>
    </Dialog>
  )
};

export default memo(UpdateCashiers);
