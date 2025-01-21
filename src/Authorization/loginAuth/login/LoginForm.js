import React, { useState } from 'react'
import { memo } from 'react';
import styles from "../index.module.scss";
import { useForm } from 'react-hook-form';
// import loginAPI from '../../../services/auth/auth';
import { Alert, Button, Dialog} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import loginAPI from '../../../services/auth/auth';

const LogInFormNew = ({
  screenWidth, 
  t, 
  setMessage,
  whereIsMyUs, 
  message,
  setIsLogIn,
  setLoading,
}) => {
  const navigate = useNavigate();
  const [seePass, setSeePass] = useState(false)

  const { 
    register,
    formState:{
      errors,
    },
    handleSubmit,
    reset
  } = useForm({});
  
  const signInToAccount = async(userData) => {
    setLoading(true)
  
    // const token = await loginAPI( userData?.username, userData?.password);
    loginAPI( userData?.username, userData?.password).then((token) => {
      setLoading(false)
      if(token === 402){
        setMessage(t("authorize.blockremove"))
      }else if(token === 400) {
        setMessage(t("authorize.incorrect"))
      }else if(token === 419){
        return  setMessage(t("authorize.errors.loginLimit419"))
      }else if(token === 415 || token === 500){
        return  setMessage(t("dialogs.wrong"))
      }
      return !token?.data?.token ? ( 
      setTimeout(() => {
        setMessage()
      },6000)
      ): (
        whereIsMyUs(),
        setIsLogIn(true),
        navigate("/"),
        reset()
      )
    })
  }

   

  return (
    <form className={styles.form} onSubmit={handleSubmit(signInToAccount)}>
      <input 
        style={{
          width:screenWidth > 768 ? "60%": "100%",
          fontSize:"120%",
          marginBottom:"10px",
          border: errors?.username || message? "red solid 2px": "grey solid",
          borderRadius:"6px",
          padding:"2px 10px"
        }}
        placeholder={t("authorize.username")}
        {...register(
          "username", {
            required: t("authorize.errors.allInputEmpty"),
          }
        )} 
      />
                
      <span style={{position:"relative",height:"fit-content", fontSize:"100%",padding:"0px", width: screenWidth>768 ?"60%": "100%"}}>
        <input 
          style={{
            width:"100%",
            fontSize:"120%",
            marginBottom:"10px",
            padding:"2px 10px",
            border: errors?.password || message? "red solid 2px": "grey solid",
            borderRadius:"6px",
          }}
          placeholder={t("authorize.password")}
          type={seePass ? "text" :"password"}
          {...register( "password" , {
            required: t("authorize.empty")
          })}
        />
        <span style={{position:"absolute",zIndex:9999,top:"8%",left:"90%",color:"black"}} onClick={()=>setSeePass(!seePass)}>
          {!seePass ? <VisibilityIcon style={{padding:2}}/> : <VisibilityOffIcon style={{padding:2}}/>} 
        </span>
      </span>
      
     
      <div style={{width:"80%",display:"flex"}}>
        <Button
          type="submit"
          variant="contained"
          style={{
            width: "40%",
            backgroundColor:"#3FB68A",
            textTransform: "capitalize",
          }}
        >
            {t("buttons.signIn")}
        </Button>
        <Button 
          variant="text" 
          style={{width:"40%",color:"orange",textTransform: "capitalize",}} 
          onClick={()=> navigate("/registration")}
        >
          {t("landing.registration")}
        </Button>
      </div>

      {/* error messages */}
      <div style={{minHeight: "50px",color:"red",fontSize:"small"}}>
        {(errors?.password ||  errors?.username )? <p>{errors?.password?.message || t("authorize.empty")}</p>:""}
        {message &&
          <Dialog open={!!message} onClose={()=>setMessage("")}>
            <Alert  severity="error">
              <strong>{message}</strong>
            </Alert>
          </Dialog>
        }
      </div>

    </form>
  )
};

export default memo(LogInFormNew);
