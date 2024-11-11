import React from "react";
import { useState } from "react";
import { memo } from "react";

import { Button,  Dialog, DialogTitle } from "@mui/material";

import styles from "./index.module.scss";
import SnackErr from "./SnackErr";
import { updateCashiersData } from "../../services/user/userInfoQuery";

const UpdateCashiers = ({
  t, 
  updateDial,
  setUpdateDial,
  updateContent, 
  setUpdateContent,
  logOutFunc,
  setRegister,
  register
  }) => {
 const [message, setMessage] = useState();

 const handleUpdateCashier = async() => {
  if(updateContent?.email && updateContent?.firstName && updateContent?.password && updateContent?.userName) {
    await updateCashiersData(updateContent).then((res) => {
      if(res?.status === 200) {
        setRegister(!register)
        setUpdateDial(false)
      }else if(res?.response?.status === 405) {
        setMessage(t("settings.dublicatemail"))
      }else if(res?.response?.status === 401){
        logOutFunc()
      }
    })
  }else{
    setMessage(t("dialogs.empty"))
  }
};
  const handleChangeInputs = (e) => {
    setUpdateContent({
      ...updateContent,
      [e.target.name]: e.target.value
    })
  };

  return (
    <Dialog
      open={!!updateDial}
      onClose={()=>setUpdateDial(!updateDial)}
    
     >
      <DialogTitle
        style={{
          display: "flex", 
          justifyContent: "space-between", 
          background:"orange",
        }}
      >
       {t("settings.update")}
      </DialogTitle>
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
            <div>{`${t("settings.password")} *`}</div>
            <input
              style={{border:!updateContent?.password ? "solid red 2px": null, padding:"0px 5px"}}
              type="text"
              name="password"
              value={updateContent?.password}
              onChange={(e)=>handleChangeInputs(e)}
            />
          </div>
          <div className={styles.update_item}>
           { `${t("settings.email")} *`}
            <input
              style={{fontSize:"75%",width:"72%",border:!updateContent?.email ? "solid red 2px": null, padding:" 0px 5px"}}
              type="text"
              name="email"
              value={updateContent?.email}
              onChange={(e)=>handleChangeInputs(e)}
            />
          </div>
          <div style={{alignContent:"center", fontSize:"70%"}}>
            {
              !!message &&
               <SnackErr type="error" close={setMessage}  message={message} />
            }
          </div>
          <div className={styles.update_item}>
            <Button
              onClick={()=>setUpdateDial(false)}
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              onClick={handleUpdateCashier}
            >
              {t("buttons.update")}
            </Button>
          </div>
        </div>
    </Dialog>
  )
};

export default memo(UpdateCashiers);
