import React from 'react'
import { memo } from 'react';
import styles from "../../index.module.scss";
import { useForm } from 'react-hook-form';
import loginAPI from '../../../services/auth/auth';
import { Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LogInForm = ({screenWidth,t,setMessage,whereIsMyUs, message,setIsLogIn}) => {
  const navigate = useNavigate();

  const { 
    register,
    formState:{
      errors,
    },
    handleSubmit,
    reset
  } = useForm({});
  
  const signInToAccount = async(userData) => {
    
    const token = await loginAPI( userData?.username, userData?.password);
    if(token === 402){
      setMessage(t("authorize.blockremove"))
    }else if(token === 400) {
      setMessage(t("authorize.incorrect"))
    }else if(token === 419){
     return  setMessage(t("authorize.errors.loginLimit419"))
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
    );
  };

  return (
  <form 
    className={styles.new_user_reg}
    onSubmit={handleSubmit(signInToAccount)}
  >
    <input 
      style={{
        width:screenWidth > 768 ? "60%": "100%",
        fontSize:"130%",
        marginBottom:"10px",
        alignSelf:"center",
        border: errors?.username ? "red solid 2px": "grey solid"
      }}
      placeholder={t("authorize.username")}
      {...register(
        "username", {
          required: t("authorize.errors.allInputEmpty"),
        }
      )} 
    />
    <input 
      style={{
        width:screenWidth>768 ?"60%": "100%",
        fontSize:"130%",
        marginBottom:"10px",
        alignSelf:"center",
        border: errors?.password ? "red solid 2px": "grey solid"
      }}
      placeholder={t("authorize.password")}
      type="password"
      {...register( "password" , {
        required: t("authorize.empty")
      })}
    />
    <div style={{minHeight: "60px",color:"red",fontSize:"small"}}>
      {(errors?.password ||  errors?.username )? <p>{errors?.password?.message || t("authorize.empty")}</p>:""}
      {message &&
        <Alert  severity="error">
          <strong>{message}</strong>
        </Alert>
      }
    </div>
    <Button
      type="submit"
      variant="contained"
      style={{
        width: screenWidth>768 ?"60%": "100%",
        alignSelf:"center",
        backgroundColor:"rgb(17, 46, 17)"
      }}
    >
      {t("buttons.signIn")}
    </Button>
  </form>
  )
};

export default memo(LogInForm);
