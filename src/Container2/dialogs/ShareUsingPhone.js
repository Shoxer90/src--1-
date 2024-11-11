import React, { memo } from "react";
import Button from '@mui/material/Button';
import { useState } from "react";
import validator from "validator";
import { Box } from "@mui/system";
import { sendSmsPDF } from "../../services/user/userHistoryQuery";
import PhoneInput from "../historyPage/newHdm/PhoneInput";
import MailInput from "../historyPage/newHdm/MailInput";
import ActionMessage from "./ActionMessage";
import { Dialog } from "@mui/material";

const ShareUsingPhone = ({
  t,
  value,
  plchld,
  recieptId, 
  handleClickOpen,
}) => {
  const [sendData, setSendData] = useState({});
  const [message, setMessage] = useState("");
  const handleClose = () => {
    setSendData("")
    handleClickOpen()
  };

  const handleChangeInput = async(e) => {
    setSendData({
      "receptId": recieptId,
      // "language": 0,
      [e.target.name]:e.target.value
    })
  };

  const sendLink = async() => {
    if(plchld === "email" && !validator.isEmail(sendData[plchld])){
      setMessage(t("authorize.errors.notMail"))
      setTimeout(()=> setMessage(""), 3000)
      return
    } 
    await sendSmsPDF(plchld, sendData).then((resp) => {
      if(resp.status === 200) {
        setMessage(t("basket.sent"))
        setSendData({})

      }else{
        setMessage(t("authorize.errors.fail"))
      }
    })
  };

  return (
    <Box 
      style={{
        alignItems:"center", 
        display:"flex", 
        flexDirection:"column",
        padding:"0px",
        fontSize:"70%"
      }}  
    >
     {!value ? <PhoneInput
        name="phone"
        func={handleChangeInput}
        t={t}
        value={sendData?.phone}
        subPlaceholder="091123456"
      />:
      <MailInput 
        name="email"
        func={handleChangeInput}
        t={t}
        value={sendData?.email}
        subPlaceholder="user@gmail.com"
      />}
      <Box style={{display: "flex"}}>
        <Button 
          variant="contained" 
          onClick={handleClose} 
          style={{backgroundColor: "grey", margin:"0px 15px"}}
        >
          {t("buttons.cancel")}
        </Button>
        <Button 
          variant="contained"
          onClick={sendLink} 
          style={{backgroundColor: "#4caf50", margin:"0px 15px"}}
        >
          {t("buttons.send")}
        </Button>
      </Box> 
      {message &&
       <Dialog open={Boolean(message)}>
          <ActionMessage type=" " message={message} setMessage={handleClose} />
        </Dialog>
      }
      
    </Box>
  );
}

export default memo(ShareUsingPhone);
