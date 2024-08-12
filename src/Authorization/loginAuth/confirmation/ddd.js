import React, { useEffect } from "react";
import { useState } from "react";
import { memo } from "react";
import { Button, Card, CardContent, Dialog, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { finishRegistration, newConfirmCode } from "../../../services/auth/auth";
import SnackErr from "../../../Container2/dialogs/SnackErr";
import Loader from "../../../Container2/loading/Loader";

const Confirmation = ({open}) => {
const {t} = useTranslation();

  const [message, setMessage] = useState();
  const navigate = useNavigate();
  const search = useLocation().search;
  const [tokenBase64, setToken] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [redirectMessage,setRedirectMessage] = useState();
  const [load,setLoad] = useState(false);

  const handleSendData = async() => {
    await finishRegistration(tokenBase64, confirmCode).then((res) => {
      if(res === 200) {
        return setRedirectMessage({type: "success", message: t("authorize.successLogin")})
      }else{
        return setMessage( {type: "error", message: t("authorize.sms")})
      }
    })
  };

  const handleChangeCode = (e) => {
    setMessage({type: "", message: ""})
    setConfirmCode(e.target.value)
  };

  const redirectFunc = () => {
    setRedirectMessage({type:"", message:""})
    navigate("/")
  };
  
  const resendCodeToPhone = async() => {
    setLoad(true)
    await newConfirmCode(tokenBase64).then((res) => {
      setLoad(false)
      if(res === 401){
        setRedirectMessage({type:"error",message:t("dialogs.deprecated")})
      }else if(res === 200){
        setMessage({type:"success",message:t("authorize.confirmation2")})
      }
    })
  };

  useEffect(() => {
    setToken(new URLSearchParams(search).get('token'))
  },[])

  return (
    <Dialog open={open}>
      <Card>
        <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {t("authorize.confirmationCode")}
        </Typography>
        <Typography gutterBottom sx={{fontSize:"95%",padding:"15px 5px"}} component="div">
          {t("authorize.confirmation")}
        </Typography>
          {/* <div style={{margin:"10px auto", width :"80%",color:"black"}}> */}
            {/* <div style={{display:"flex", justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
              <span style={{color:"orange",fontSize:"130%",fontWeight:600, textAlign:"start"}}>{t("authorize.confirmationCode")}</span>
              <LangSelect size={"22px"} />
            </div> */}
            {/* <h5>{t("authorize.confirmation")}</h5> */}
            {/* <h6>{t("authorize.confirmation")}</h6> */}
            <div style={{display:"flex", justifyContent:"center", flexFlow:"column nowrap"}}>

            <input
              autoFocus
              style={{
                width:"75%",
                marginBottom:"10px",
                alignSelf:"center",
                padding:"3px 10px"
              }}
              placeholder={t("authorize.registrationcode")}
              type="number"
              value={confirmCode}
              min="0"
              onChange={(e)=>handleChangeCode(e)}
            />
            <div style={{color:"orange",opacity:"0.9", margin:"10px",textAlign:"center"}}>
              {t("authorize.errors.loginLimitAttention")}
            </div>
        

              <Button
                type="submit"
                variant="contained"
                style={{background:"#3FB68A",alignSelf:"center", padding: "5px 15px", width:"60%"}}
                onClick={handleSendData}
                >
                {t("buttons.submit")}
              </Button>
              <a onClick={resendCodeToPhone} style={{textDecoration:"underline",padding:"5px",fontSize:"80%",textAlign:"center",cursor:"pointer"}}>
                {t("authorize.resend")}
              </a>
            </div>
            {message?.message && 
              <Dialog open={Boolean(message?.message)}>
                <SnackErr message={message?.message} type={message?.type} close={()=>setMessage({type:"",message:''})} />
              </Dialog>
            }
            {redirectMessage?.message && 
              <Dialog open={Boolean(redirectMessage?.message)}>
                <SnackErr message={redirectMessage?.message} type={redirectMessage?.type} close={redirectFunc} />
              </Dialog>
            }
          <Dialog open={Boolean(load)} >
            <Loader />
          </Dialog>
        </CardContent>
      </Card>
    </Dialog>
  )
};

export default memo(Confirmation);
