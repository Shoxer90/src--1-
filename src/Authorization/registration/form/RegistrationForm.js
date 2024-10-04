import React, { memo } from "react";

import styles from "../index.module.scss";
import { useState } from "react";
import { isUniqueNik, registrationNew } from "../../../services/auth/auth";
import { Button, FormControl, FormHelperText, InputAdornment, TextField } from "@mui/material";
import { mailValidate } from "../../../modules/mailValidate";
import PreRegistrateAgreement from "../preRegistrate/PreRegistrateAgreement";
import TermsConditionsLink from "../preRegistrate/TermsConditionsLink";


const RegistrationForm = ({newUser, setNewUser, t, successSubmit, setIsLoad}) => { 

  const [message,setMessage] = useState({message:"", type:""});
  const [confirmPass,setConfirmPass]= useState("");
  const [isIdentity,setIsIdentity] = useState(true);
  const [unique,setUnique] = useState(true);
  const [submitClick, setSubmitClick] = useState(false);
  const [validMail, setValidMail] = useState(false);
  const [agree,setAgree] = useState(false);

  const handleChange = (e) => {
    setSubmitClick(false)
    setMessage({message:"", type:""})
    setNewUser({
      ...newUser,
      [e.target.name]:e.target.value
    })
  };

  const isunique = (e) => {
    setUnique(true)
    handleChange(e) 
    isUniqueNik(e.target.value).then((res) => {
     if(!res?.isUnic) {
      setUnique(res?.isUnic)
     }
    })
  };

  const isValidMail = async(e) => {
    setMessage({message:"",type:""})
    handleChange(e)
     const res= await mailValidate(e.target.value)
      setValidMail(res)
      !res ? setMessage({
        message:t("authorize.errors.notMail"),
        type:"error",
      }):setMessage({message:"",type:""})
  };

  const limitChar = (e,val) => {
    if (e.target.value.toString()?.length <= val) {
      handleChange(e);
    }
  };

  const registrateUser = (body) => {
    setSubmitClick(true)
    for(let [key, value] of Object.entries(newUser)){
      if(
        key !== "tradeName" &&
        key !== "businessAddress" &&
        key !== "zipCode" && 
        value === ""
      ){
        return  setMessage({message: t("authorize.errors.allInputEmpty"),type:"error"})
      }
    }
    if(newUser?.password !== confirmPass){
      setIsIdentity(false)
      return setMessage({message: t("dialogs.mismatch"),type:"error"})
    }else if(!validMail){
      return setMessage({message:t("authorize.errors.notMail"),type:"error"})
    }else{
      setIsLoad(true)
      registrationNew(newUser).then((res) => {
        setSubmitClick(false)
        successSubmit(res)
        setConfirmPass("")
      })
    }
  };

  return(
    <div className={styles.reg_form} autoComplete="off"> 
      <TextField  size="small" sx={{m:.4}} 
        className={styles.reg_form_input}
        error={!newUser?.legalName && submitClick}
        name="legalName"
        value={newUser?.legalName}
        label={`${t("authorize.legalName")} *`} 
        onChange={(e)=>handleChange(e)}
      />
      <TextField  size="small" sx={{m:.4}} 
        error={!newUser?.legalAddress && submitClick }
        name="legalAddress"
        value={newUser?.legalAddress}
        label={`${t("authorize.legalAddress")} *`} 
        onChange={(e)=>handleChange(e)}
      />
      <TextField  size="small" sx={{m:.4}} 
        error={(!newUser?.tin && submitClick )|| (newUser?.tin && newUser?.tin?.length !==8)}
        type="number"
        name="tin"
        value={newUser?.tin}
        label={`${t("authorize.tin")} (8 ${t("productinputs.symb")}) *`} 
        inputProps={{ maxLength: 8, minLength: 8 }}
        onChange={(e)=>limitChar(e,8)}

      />
      <TextField  size="small" sx={{m:.4}} 
        name="tradeName"
        value={newUser?.tradeName}
        label={t("authorize.tradeName")}
        onChange={(e)=>handleChange(e)}
      />
      <TextField  size="small" sx={{m:.4}} 
        name="businessAddress"
        value={newUser?.businessAddress}
        label={t("authorize.businessAddress")}
        onChange={(e)=>handleChange(e)}
      />
      <div className={styles.reg_form_div}>
        <TextField  size="small" sx={{m:.4}} 
          error={!newUser?.firstName && submitClick}
          name="firstName"
          value={newUser?.firstName}
          label={`${t("authorize.first")} *`} 
          onChange={(e)=>handleChange(e)}
        />
        <TextField  size="small" sx={{m:.4}} 
          error={!newUser?.lastName && submitClick}
          name="lastName"
          value={newUser?.lastName}
          label={`${t("authorize.last")} *`}
          onChange={(e)=>handleChange(e)}
        />
      <TextField  size="small" sx={{m:.4}} 
          error={(!newUser?.phoneNumber && submitClick) ||(newUser?.phoneNumber && newUser?.phoneNumber?.length !==8)}
          name="phoneNumber"
          type="number"
          inputProps={{ maxLength: 8 }}
          value={newUser?.phoneNumber}
          label={`${t("authorize.phone")} *`}
          onChange={(e)=>limitChar(e,8)}
          InputProps={{
            startAdornment: <InputAdornment position="start">+374</InputAdornment>,
          }}
        />
        <TextField  size="small" sx={{m:.4}} 
          error={!newUser?.country && submitClick}
          name="country"
          value={newUser?.country}
          label={`${t("authorize.country")} *`}
          onChange={(e)=>handleChange(e)}
        />
        <TextField  size="small" sx={{m:.4}} 
          error={!newUser?.city && submitClick}
          label={`${t("authorize.city")} *`}
          name="city"
          value={newUser?.city}
          onChange={(e)=>handleChange(e)}
        />
        <TextField  size="small" sx={{m:.4}} 
          type="number"
          name="zipCode"
          value={newUser?.zipCode}
          label={`${t("authorize.zipCode")}`}
          onChange={(e)=>handleChange(e)}
        />
      </div>
      <TextField  size="small" sx={{m:.4}} 
          error={(!newUser?.email && submitClick) || (newUser?.email && !validMail)}
          name="email"
          type="email"
          value={newUser?.email}
          label={`${t("authorize.email")} *`}
          onChange={(e)=>isValidMail(e)}
        />
        <h6 style={{marginBottom:"1px"}}> {t("authorize.username")}</h6>
      <div className={styles.reg_form_div}>
        <FormControl style={{margin:"0px"}}>
          <p  size="small" sx={{m:.4}} 
            // inputProps={{
            //   autoComplete: 'off'
            // }}
            // error={!newUser?.userName && submitClick}
            // name="userName"
            // value={newUser?.userName}
            label={`${t("authorize.username")}* (${t("authorize.tin")})`}
            // onChange={(e)=>isunique(e)}
          >{}</p>
          <FormHelperText>
          <span className={!unique? styles.errorMessage: styles.successMessage}>
            {newUser?.userName && !unique && t("authorize.exist")}
            {newUser?.userName && unique && t("authorize.exist1")}
          </span>
         </FormHelperText>
        </FormControl>
        <TextField  size="small" sx={{m:.4}} 
          error={!newUser?.password && submitClick}
          autoComplete="new-password"
          name="password"
          type="password"
          value={newUser?.password}
          label={`${t("authorize.password")} *`} 
          onChange={(e)=>handleChange(e)}
        />
        <TextField  size="small" sx={{m:.4}} 
          error={(!confirmPass && submitClick) || !isIdentity}
          // style={{ border:!confirmPass && submitClick ? "solid red 2px": "null"}}
          autoComplete="new-password"
          name=""
          type="password"
          value={confirmPass}
          label={`${t("settings.confirmpassword")} *`}
          onChange={(e)=>setConfirmPass(e.target.value)}
        />    
      </div>
      <div>
        {message?.message &&  
          <span className={styles.errorMessage} style={{height:"15px"}}>
            { message?.message}
          </span>
        }
      </div>
      <PreRegistrateAgreement agree={agree} setAgree={setAgree} t={t} title={<TermsConditionsLink t={t} />}/>

      <Button 
        type="submit" 
        variant="contained"
        // disabled={!agree}
        onClick={() => {
          
          if(!agree)setMessage({message: `${t("authorize.beforeRegisterDialog")} ${t("authorize.beforeRegisterTerms")}`, type:"error"})
          else if(!submitClick)registrateUser(newUser)
        }}
        sx={{ backgroundColor:"rgb(17, 46, 17)",width:"300px",alignSelf:"center",m:1}}
      >
        {t("authorize.register")}
      </Button>
    </div>
  )
};

export default memo(RegistrationForm);
