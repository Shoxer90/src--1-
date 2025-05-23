import React, { useEffect } from "react";
import { useState } from "react";
import { memo } from "react";
import { Button, Dialog } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { finishRegistration, newConfirmCode } from "../../../services/auth/auth";
import SnackErr from "../../../Container2/dialogs/SnackErr";
import Loader from "../../../Container2/loading/Loader";
import LangSelect from "../../../Container2/langSelect";

const ConfirmationV2 = () => {
const {t} = useTranslation();

  const [message, setMessage] = useState();
  const navigate = useNavigate();
  const search = useLocation().search;
  const [tokenBase64, setToken] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [redirectMessage,setRedirectMessage] = useState();
  const [load,setLoad] = useState(false);

  const handleSendData = async() => {
    setLoad(true)
    await finishRegistration(tokenBase64, confirmCode).then((res) => {
      setLoad(false)
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
    <div>
      <div style={{width :"80%",margin:"auto"}}>
        <div style={{display:"flex", justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
          <span style={{color:"orange",fontSize:"130%",fontWeight:600, textAlign:"start"}}>{t("authorize.confirmationCode")}</span>
          <LangSelect size={"22px"} />
        </div>
        <h5>{t("authorize.confirmation")}</h5>
        <input
          style={{
            width:"100%",
            fontSize:"130%",
            marginBottom:"10px",
            alignSelf:"center",
            padding:"0px 10px"
          }}
          placeholder={t("authorize.registrationcode")}
          type="number"
          value={confirmCode}
          min="0"
          onChange={(e)=>handleChangeCode(e)}
        />
        <div style={{color:"red", margin:"10px"}}>
          <h6>{t("authorize.errors.attention")}</h6>
          {t("authorize.errors.loginLimitAttention")}
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
        <Button
          type="submit"
          variant="contained"
          style={{backgroundColor:"rgb(17, 46, 17)", padding: "5px 15px", width:"60%",textTransform: "capitalize",}}
          onClick={handleSendData}
        >
          {t("buttons.submit")}
        </Button>
        <div onClick={resendCodeToPhone} style={{cursor:"pointer", margin:"5px", textDecoration:"underline"}}>
          {t("authorize.resend")}
        </div>
      </div>
      <Dialog open={Boolean(load)} >
        <Loader close={setLoad} />
      </Dialog>
    </div>
  )
};

export default memo(ConfirmationV2);
