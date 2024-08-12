import React, { memo, useState , useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../index.module.scss";
import { Alert, Button, Dialog, TextField } from "@mui/material";
import LangSelect from "../../../Container2/langSelect";
import { updateUserPassword } from "../../../services/auth/auth";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const search = useLocation().search;
  const [tokenBase64, setToken] = useState();
  const [password, setPassword] = useState({});
  const [message, setMessage] = useState();

  const changePassword = async() => {
    if(!password?.password?.length || !password?.confirmPassword?.length) {
      setMessage({type:"error", message: t("authorize.errors.emptyfield")})
      return
    }else if(password?.password !== password?.confirmPassword){
      setMessage({type:"error", message: t("dialogs.mismatch")})
      return
    }else{
      tokenBase64 && await updateUserPassword({"password":password?.password}, tokenBase64).then((res) => {
        if(res.status === 200){
          setMessage({type:"success", message: t("dialogs.done")})
          setTimeout(() => {
          setMessage({})
          navigate("/") 
          },4000)
        }else if(res === 401){
            setMessage({type:"error",message:t("dialogs.deprecated")})
          }
        else{
          setMessage({type:"error", message: t("dialogs.wrong")})
        }
      })
    }
  }

  const handleChange = (e) => {
    setPassword({...password,[e.target.name]:e.target.value})
  }

  useEffect(() => {
    setToken(new URLSearchParams(search).get('token'))
  }, []);

  return(
    <div >
      <div style={{display:"flex", justifyContent:"space-between",alignItems:"center"}}>
        <span style={{color:"#3FB68A",fontSize:"110%",fontWeight:600, textAlign:"start"}}>{t("settings.changepassword")}</span>
        <LangSelect size={"22px"} />
      </div>
      <div style={{display:"flex", flexFlow:"column", alignItems:"center",paddingTop:"10px"}}>
        <TextField
          error={message?.message && !password?.password}
          size="small"
          style={{margin:"10px",width:"60%"}}
          type="password"
          placeholder={t("authorize.newpassword")}
          name="password"
          onChange={(e)=>handleChange(e)}
        />
        <TextField
          error={message?.message && !password?.confirmPassword}
          size="small"
          style={{margin:"10px", width:"60%"}}
          type="password"
          placeholder={t("settings.confirmpassword")}
          name="confirmPassword"
          onChange={(e)=>handleChange(e)}
        />
      </div>
      <Button
        variant="contained"
        onClick={changePassword}
        style={{margin:"60px auto", width:"60%",backgroundColor:"rgb(17, 46, 17)"}}
      >
        {t("buttons.submit")}
      </Button>
       <Dialog open={Boolean(message?.message)} onClose={()=>setMessage({})}>
        <Alert  severity={message?.type} sx={{padding:"3px 10px", margin:0}}>
          {message?.message}
        </Alert>
      </Dialog>
    </div>
  )
};

export default memo(ResetPassword);
