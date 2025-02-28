import React, { useState } from 'react'
import { memo } from 'react';
import styles from "../index.module.scss";
import { useForm } from 'react-hook-form';
// import loginAPI from '../../../services/auth/auth';
import { Alert, Button, Dialog, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import loginAPI from '../../../services/auth/auth';
import { Visibility, VisibilityOff } from '@mui/icons-material';

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

    loginAPI( userData?.username, userData?.password).then((token) => {
      setLoading(false)
      if(token?.response?.status === 402){
        setMessage(t("authorize.blockremove"))
      }else if(token?.response?.status === 400) {
        return setMessage(token?.response?.data?.message)
      }else if(token?.response?.status === 419){
        return  setMessage(t("authorize.errors.loginLimit419"))
      }else if(token?.response?.status === 415 ||token?.response?.status === 500){
        return  setMessage(t("dialogs.wrong"))
      }
      return !token?.data?.token ? ( 
      setTimeout(() => {
        setMessage()
      },6000)
      ): (
        localStorage.setItem("notificOk", false),
        whereIsMyUs(),
        setIsLogIn(true),
        navigate("/"),
        reset()
      )
    })
  }

   

  return (
    <form className={styles.form} onSubmit={handleSubmit(signInToAccount)}>
      {/* <input 
        style={{
          // width:screenWidth > 768 ? "60%": "100%",
          width: "60%",
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
      /> */}
        <FormControl sx={{width: '60%', m:1}} variant="outlined">
          <InputLabel>{t("authorize.username")}</InputLabel>
          <OutlinedInput
            size="small"
            error={errors?.password || message}
            {...register("username", {
              required: t("authorize.errors.allInputEmpty"),
            })}
            label={t("authorize.username")}
          />
        </FormControl>
          
      {/* <span style={{position:"relative",height:"fit-content",alignContent:"flex-start", fontSize:"100%",padding:"0px"}}>
        <input 
          style={{
            // width:"100%",
            width: "60%",
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
        <span style={{position:"absolute",zIndex:9999,top:"8%",left:"40%",color:"black"}} onClick={()=>setSeePass(!seePass)}>
          {!seePass ? <VisibilityIcon style={{padding:2}}/> : <VisibilityOffIcon style={{padding:2}}/>} 
        </span>

      </span> */}
        <FormControl sx={{width: '60%', m:1}} variant="outlined">
          <InputLabel>{t("authorize.password")}</InputLabel>
          <OutlinedInput
            type={seePass ? 'text' : 'password'}
            // style={{border: errors?.password || message && "red solid 2px"}}
            size="small"
            error={errors?.password || message}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={()=>setSeePass(!seePass)}>
                  {seePass ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            {...register("password", {
              required: t("authorize.empty"),
              minLength: {
                value: 8,
                // message: t("authorize.password_too_short"),
              },
            })}
            label={t("authorize.password")}
          />
        </FormControl>
      
     
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
