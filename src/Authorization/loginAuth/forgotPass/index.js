import { Dialog } from "@mui/material";
import React, { useState , memo } from "react";

import SnackErr from "../../../Container2/dialogs/SnackErr";
import { mailValidate } from "../../../modules/mailValidate";
import { forgotPassword } from "../../../services/auth/auth";
import { useTranslation } from "react-i18next";
import LangSelect from "../../../Container2/langSelect";
import BackAndOkBtnGrp from "../buttonGroup/backAndOk"
import Loader from "../../../Container2/loading/Loader";

const ForgotPassword = () => {
  const [userMail, setUserMail] = useState({});
  const [info, setInfo] = useState({});
  const [load, setLoad] = useState(false);
  const {t} = useTranslation();

  const reset = async() => {
    if(!userMail?.email) {
      setInfo({type:"error",message:t("authorize.errors.emptyfield")})
      return
    }
    const isValid = await mailValidate(userMail.email)
    if(isValid) {
      setLoad(true)
      setUserMail("") 
      forgotPassword(userMail).then((res) => {
      setLoad(false)
      if(res?.status === 200) {
        return  setInfo({type:"success",message:t("dialogs.checkEmail")})
        }else{
        return setInfo({type:"error",message:t("authorize.errors.emailNotFound")})
        }
      })
    }else{  
      setLoad(false)
     return setInfo({type:"error",message:t("authorize.errors.notMail")})
    } 
  };

  const closeDialog = () => {
    setInfo({})
  }

  return(
    <div style={{width : "50dvw", padding:"10px 20px"}}>
      <div style={{display:"flex", justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
        <span style={{color:"orange",fontSize:"130%",fontWeight:600, textAlign:"start"}}>{t("authorize.reset")}</span>
        <LangSelect size={"22px"} />
      </div>
      <input 
        style={{width:"60%",border:"solid darkgrey 2px",padding:"3px", margin:"10px"}}
        type="text"
        placeholder="e-mail@email"
        name="email"
        onChange={(e) => {
          setInfo({})
          setUserMail({[e.target.name]:e.target.value})
        }} 
      />
        <div style={{fontWeight:600,color:"black",fontSize:"110%",alignSelf:"start"}}>{t("authorize.resetInfo")}</div>
      <div style={{color:"red",height:"40px",padding:"5px",fontSize:"80%"}}>
       {info.type === "error" && <p>{info?.message}</p>} 
      </div>      
      <BackAndOkBtnGrp func={reset} btnName={t("buttons.send")} link={"/"}/>
      
      {info?.message &&
        <Dialog open={true}>
          <SnackErr type={info?.type}  message={info?.message} close={closeDialog}/>
        </Dialog>
      }
      <Dialog open={Boolean(load)} >
        <Loader />
      </Dialog>
    </div>
  )
};

export default memo(ForgotPassword);
