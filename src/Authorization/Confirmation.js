import React, { useEffect } from "react";
import { useState } from "react";
import { memo } from "react";
import { Button, Dialog } from "@mui/material";
import { finishRegistration, newConfirmCode } from "../services/auth/auth";
import FormTitle from "./FormTitle";
import styles from "./index.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import WelcomeClient from "./WelcomeClient";
import SnackErr from "../Container2/dialogs/SnackErr";
import Loader from "../Container2/loading/Loader";

const Confirmation = ({t}) => {
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
    <div className={styles.auth_container}>
      <div className={styles.confirmation}>
        <FormTitle operation={t("authorize.confirmationCode")} />
        <h5>{t("authorize.confirmation")}</h5>
          <input
            style={{borderRadius:"5px"}}
            placeholder={t("authorize.registrationcode")}
            type="number"
            value={confirmCode}
            min="0"
            onChange={(e)=>handleChangeCode(e)}
          />
        <div style={{color:'red', width:"77%",padding:"10px 2px"}}>
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
            style={{backgroundColor:"rgb(17, 46, 17)", padding: "5px 15px", width:"270px"}}
            onClick={handleSendData}
          >
            {t("buttons.submit")}
          </Button>
          <div className={styles.resendBTN} onClick={resendCodeToPhone}>
            {t("authorize.resend")}
          </div>
      </div>
      <WelcomeClient t={t}/>
      <Dialog open={Boolean(load)} >
        <Loader />
      </Dialog>
    </div>
  )
};

export default memo(Confirmation);
