import React, { memo, useState , useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../index.module.scss";
import { Alert, Button, Dialog } from "@mui/material";
import { updateUserPassword } from "../../services/auth/auth";

const ResetPassword = ({t}) => {
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
    <div className={styles?.auth_container_signIn}>
      <input
        className={styles.auth_container_signIn_form_item}
        style={{margin:"10px"}}
        type="password"
        placeholder={t("settings.password")}
        name="password"
        onChange={(e)=>handleChange(e)}
      />
      <input
        className={styles.auth_container_signIn_form_item}
        style={{margin:"10px"}}
        type="password"
        placeholder={t("settings.confirmpassword")}
        name="confirmPassword"
        onChange={(e)=>handleChange(e)}
      />
      <Button
        variant="contained"
        onClick={changePassword}
        style={{margin:"60px auto", width:"60%",backgroundColor:"rgb(17, 46, 17)"}}
      >
        {t("settings.changepassword")}
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
