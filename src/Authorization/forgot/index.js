import { Button, Dialog } from "@mui/material";
import React, { useState , memo } from "react";
import { useNavigate } from "react-router-dom";

import SnackErr from "../../Container2/dialogs/SnackErr";
import { mailValidate } from "../../modules/mailValidate";
import { forgotPassword } from "../../services/auth/auth";
import styles from "../index.module.scss";

const ForgotPassword = ({t}) => {
  const navigate = useNavigate();
  const [userMail,setUserMail] = useState({});
  const [openConfirmDial,setOpenConfDial] = useState(false);
  const [info, setInfo] = useState({});


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
    } 
  }

  return(
    <div style={{margin:"65px auto"}} className={styles.new_user_reg}>
      <h4>{t("authorize.resetInfo")}</h4>
      <input 
        style={{margin:"40px auto",width: window.innerWidth<500 ? "120%":"60%"}}
        type="text"
        placeholder={t("authorize.email")}
        name="email"
        onChange={(e) => setUserMail({[e.target.name]:e.target.value})} 
      />
      <div style={{color:"red",height:"40px",padding:"5px",fontSize:"80%"}}>
       {info.type === "error" && <p>{info?.message}</p>} 
      </div>      
      <Button
      style={{width: window.innerWidth<500 && "120%",margin:"auto", }}
       variant="contained"
       onClick={reset}
       color="success"
      >
        {t("buttons.sendResetLink")}
      </Button>
      {info.type === "info" &&
      <Dialog open={true}>
        <SnackErr type={info?.type} message={t("dialogs.checkEmail")} />
      </Dialog>
      }

    </div>
  )
};

export default memo(ForgotPassword);
