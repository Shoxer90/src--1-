import React from "react";
import { useState } from "react";
import { memo } from "react";

import { Button,  Dialog, DialogTitle } from "@mui/material";

import styles from "./index.module.scss";
import SnackErr from "./SnackErr";

const UpdateCashiers = ({updateContent, t, setUpdateContent, updateDial, setUpdateDial, handleUpdateCashier}) => {
 const [message,setMessage] = useState();
  const semiUpdate = () => {
    if (Object.values(updateContent).includes("")) {
      setMessage("you have an empty fields")
      setTimeout(() => {
        setMessage()
      }, 4000)
    }else{
      handleUpdateCashier(updateContent)
    }
  }

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
            <div>{t("settings.name")}</div>
            <input
              type="text"
              name="firstName"
              value={updateContent?.firstName}
              onChange={(e)=>handleChangeInputs(e)}
            />
          </div>
          <div className={styles.update_item}>
            <div>{t("settings.surname")}</div>
            <input
              type="text"
              name="lastName"
              value={updateContent?.lastName}
              onChange={(e)=>handleChangeInputs(e)}
            />
          </div>
          <div className={styles.update_item}>
           <div>{t("authorize.username")} </div>
            <input
              type="text"
              name="userName"
              value={updateContent?.userName}
              onChange={(e)=>handleChangeInputs(e)}
            />
          </div>
          <div className={styles.update_item}>
            <div>{t("settings.password")}</div>
            <input
              type="text"
              name="password"
              value={updateContent?.password}
              onChange={(e)=>handleChangeInputs(e)}
            />
          </div>
          <div className={styles.update_item}>
            {t("settings.email")}
            <input
              style={{fontSize:"75%",width:"72%"}}
              type="text"
              name="email"
              value={updateContent?.email}
              onChange={(e)=>handleChangeInputs(e)}
            />
          </div>
          <div style={{alignContent:"center", fontSize:"70%"}}>
            {
              message &&
               <SnackErr type="error"  message={message} />
            }
          </div>
          <div className={styles.update_item}>
            <Button
              onClick={()=>setUpdateDial(false)}
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              onClick={semiUpdate}
            >
              {t("buttons.update")}
            </Button>
          </div>
        </div>
    </Dialog>
  )
};

export default memo(UpdateCashiers);
