import React, {  memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Dialog, TextField } from "@mui/material";

import SnackErr from "../dialogs/SnackErr";
import Loader from "../loading/Loader";
import { sendMail } from "../../services/user/hdm_query";

import styles from "./index.module.scss";

const FeedBackPage = () => {
  const {t} = useTranslation();

  const [message,setMessage] =  useState({message:"",type:"info"});
  const [isSent, setIsSent] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [mailContent,setMailContent] = useState({
    text:"",
    subject:""
  });
 
  const handleChange = (e) => {
    setMailContent({
      ...mailContent,
      [e.target.name]: e.target.value
    })
  };

  const handleSend = () => {
    if(isSent)return
    setIsLoad(true)
    sendMail(mailContent).then((res)=> {
      setIsLoad(false)
      if(res.status === 200){
        setIsSent(true)

        setMailContent({ 
          text:"",
          subject:""
        })
        setMessage({type:"success",message:t("basket.sent")})
      }else{
        setMessage({type:"error",message:t("dialogs.wrong")})
      }
      setTimeout(() => {
        setMessage({type:"",message:""})
      },4000)
    })
  };

  useEffect(() => {
    !mailContent?.text ? setIsSent(true) : setIsSent(false)
  }, [mailContent?.text]);

  return(
    <div className={styles.feedback}>
      <div className={styles.feedback_frame}>
        <h2>
          {t("menuburger.feedback")}
        </h2>
        <TextField 
          value={mailContent?.subject}
          label={t("menuburger.subject")}
          name="subject"
          onChange={(e)=> handleChange(e)}
        />
        <TextField
          multiline
          rows={4}
          name="text"
          label={t("menuburger.letter")}
          value={mailContent?.text}
          onChange={(e)=> handleChange(e)}
        />
        <Button
          variant="contained"
          disabled={isSent}
          onClick={handleSend}
          style={{background:isSent ? "grey":"" }}
        >
          {t("buttons.send")}
        </Button>
        {message ? <SnackErr type={message?.type} message={message?.message}  close={setMessage}/> : ""}
      </div>
      <Dialog open={!!isLoad}> <Loader /> </Dialog>
    </div>
  )
};

export default memo(FeedBackPage);
