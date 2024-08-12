import { Dialog } from "@mui/material";
import React, { useState , memo } from "react";
import { useNavigate } from "react-router-dom";

import SnackErr from "../../../Container2/dialogs/SnackErr";
import { mailValidate } from "../../../modules/mailValidate";
import { forgotPassword } from "../../../services/auth/auth";
import { useTranslation } from "react-i18next";
import LangSelect from "../../../Container2/langSelect";
import BackAndOkBtnGrp from "../buttonGroup/backAndOk"

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [userMail, setUserMail] = useState({});
  const [openConfirmDial, setOpenConfDial] = useState(false);
  const [info, setInfo] = useState({});
  const {t} = useTranslation();

  const reset = async() => {
    const isValid = await mailValidate(userMail.email)
    if(isValid) {
      setUserMail("") 
      forgotPassword(userMail).then((res) => {
        if(res.status === 400){
          setInfo({type:"error",message:t("authorize.errors.emailNotFound")})
        }else{
          setInfo({type:"info",message:t("dialogs.checkEmail")})
          setOpenConfDial(true)
          setTimeout(() => {
            setInfo({})
          setOpenConfDial(true)
          navigate("/")
          },5000)
        }
      })
    }else{
      setInfo({type:"error",message:t("authorize.errors.notMail")})
      setTimeout(() => {
        setInfo({})
      setOpenConfDial(true)
      },5000)
    } 
  }

  return(
    <div style={{width :"80%",margin:"auto"}}>
      <div style={{display:"flex", justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
        <span style={{color:"orange",fontSize:"130%",fontWeight:600, textAlign:"start"}}>{t("authorize.reset")}</span>
        <LangSelect size={"22px"} />
      </div>
      <input 
        style={{width:"100%",border:"solid darkgrey 2px",padding:"3px",alignSelf:"flex-start"}}
        type="text"
        placeholder="e-mail@email"
        // placeholder={t("authorize.email")}
        name="email"
        onChange={(e) => {
          setInfo({})
          setUserMail({[e.target.name]:e.target.value})
        }} 
      />
        <span style={{fontWeight:600,color:"black",fontSize:"110%",alignSelf:"start"}}>{t("authorize.resetInfo")}</span>
      <div style={{color:"red",height:"40px",padding:"5px",fontSize:"80%"}}>
       {info.type === "error" && <p>{info?.message}</p>} 
      </div>      
      <BackAndOkBtnGrp func={reset} btnName={t("buttons.send")} link={"/"}/>
      
      {info.type === "info" &&
      <Dialog open={true}>
        <SnackErr type={info?.type} message={t("dialogs.checkEmail")} />
      </Dialog>
      }

    </div>
  )
};

export default memo(ForgotPassword);
