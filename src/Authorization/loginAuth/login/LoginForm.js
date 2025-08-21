import React, { useState } from 'react'
import { memo } from 'react';
import styles from "../index.module.scss";
import { useForm } from 'react-hook-form';
import { Alert, Button, Dialog, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import loginAPI from '../../../services/auth/auth';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LogInFormNew = ({
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
      console.log((token, "token from loginAPI"))
      if(token?.response?.status === 402){
        return setMessage(token?.response?.data?.message)
        // setMessage(t("authorize.blockremove"))
      }else if(token?.response?.status === 400) {
        return setMessage(token?.response?.data?.message)
      }else if(token?.response?.status === 419){
        return  setMessage(t("authorize.errors.loginLimit419"))
      }else if(token?.response?.status === 415 ||token?.response?.status === 500){
        return setMessage(token?.response?.data?.message)
        // return  setMessage(t("dialogs.wrong"))
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
            })}
            label={t("authorize.password")}
          />
        </FormControl>
      
     
      <div style={{width:"80%",display:"flex"}}>
        <Button
          type="submit"
          variant="contained"
          style={{
            width: "38%",
            marginRight:"15px",
            backgroundColor:"#3FB68A",
            textTransform: "capitalize",
          }}
        >
            {t("buttons.signIn")}
        </Button>
        <Button 
          variant="contained" 
          style={{width:"38%",background: "#fd7e14",textTransform: "capitalize",}} 
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
