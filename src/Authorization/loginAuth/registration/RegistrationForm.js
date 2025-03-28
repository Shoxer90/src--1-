import React, { memo, useEffect } from "react";

import styles from "./index.module.scss";
import { useState } from "react";
import { isUniqueNik, registrationNew } from "../../../services/auth/auth";
import { Dialog, FormControl, FormHelperText, InputAdornment, TextField } from "@mui/material";
import { mailValidate } from "../../../modules/mailValidate";
import BackAndOk from "../buttonGroup/backAndOk";
import validator from "validator";
import SnackErr from "../../../Container2/dialogs/SnackErr";
import PreRegistrateAgreement from "../preRegistrate/PreRegistrateAgreement";
import TermsConditionsLink from "../preRegistrate/TermsConditionsLink";

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const RegistrationForm = ({newUser, setNewUser, t, successSubmit,  setIsLoad}) => { 
  const [seePass,setSeePass] = useState(false);
  const [seePass2,setSeePass2] = useState(false);

  const [message,setMessage] = useState({message:"", type:""});
  const [errorMessage, setErrorMessage] = useState({ok:false,message:""})
  const [confirmPass,setConfirmPass]= useState("");
  const [isIdentity,setIsIdentity] = useState(true);
  const [unique,setUnique] = useState(true);
  const [submitClick, setSubmitClick] = useState(false);
  const [validMail, setValidMail] = useState(false);
  const [agree,setAgree] = useState(false);
  const [infoDialog,setInfoDialog] = useState({
    isOpen: false,
    message:"",
    type:"info",
  })

 
  const handleChange = (e) => {
    setSubmitClick(false)
    // setMessage({message:"", type:""})
    setInfoDialog({
      isOpen: false,
      message:"",
      type:"",
    })
    setNewUser({
      ...newUser,
      [e.target.name]:e.target.value
    })
  };

  const isunique = (e) => {
    setUnique(true)
    setNewUser({
      ...newUser,
      "userName": newUser?.tin
    })
    isUniqueNik(e).then((res) => {
     if(!res?.isUnic) {
      setUnique(res?.isUnic) 
     }
    })
  };

  const isValidMail = async(e) => {
    setInfoDialog({
      isOpen: false,
      message:"",
      type:"",
    })
    // setMessage({message:"",type:""})
    handleChange(e)
     const res= await mailValidate(e.target.value)
      setValidMail(res)
      !res ?
      // setInfoDialog({
      //   isOpen: true,
      //   message:t("authorize.errors.notMail"),
      //   type:"error",
      // }): setInfoDialog({
      //   isOpen: false,
      //   message:"",
      //   type:"",
      // })
      setMessage({
        message:t("authorize.errors.notMail"),
        type:"error",
      }):
      setMessage({message:"",type:""})
  };

  const limitChar = (e,val) => {
    const text = e.target.value;  
      const valid = /^[0-9]*$/;
      if(valid.test(text) &&  text.length <= val) {
        return handleChange(e)
      }else {
        e.preventDefault(); 
      }
  };

   const reg = () => {
    if(!agree){
      setInfoDialog({
        isOpen: true,
        message:`${t("authorize.beforeRegisterDialog")} ${t("authorize.beforeRegisterTerms")}`,
        type:"error",
      })
    }
      // setMessage({message: `${t("authorize.beforeRegisterDialog")} ${t("authorize.beforeRegisterTerms")}`, type:"error"})
      else{
        registrateUser(newUser)
      }
   }

  const registrateUser = () => {
    setSubmitClick(true)
    for(let [key, value] of Object.entries(newUser)){
      if(
        key !== "tradeName" &&
        key !== "businessAddress" &&
        key !== "zipCode" && 
        key !== "city" && 
        key !== "country" && 
        value === ""
      ){
        return  setInfoDialog({
          isOpen: true,
          message: t("authorize.errors.allInputEmpty"),
          type:"error",
        })
      }
    }
    if(newUser?.password !== confirmPass){
      setIsIdentity(false)
      setInfoDialog({
        isOpen:true,
        message:t("dialogs.mismatch"),
        type: "error"
      })
    }else if(!errorMessage?.ok){
      return  setInfoDialog({
        isOpen: true,
        message: t("dialogs.novalidatepass"),
        type:"error",
      })
      // return setMessage({message: t("dialogs.novalidatepass"),type:"error"})

    }else if(!validMail){
      return  setInfoDialog({
        isOpen: true,
        message: t("authorize.errors.notMail"),
        type:"error",
      })
      // return setMessage({message:t("authorize.errors.notMail"),type:"error"})
    }else{
      setIsLoad(true)
      registrationNew(newUser).then((res) => {
        setSubmitClick(false)
        successSubmit(res)
        setConfirmPass("")
      })
    }
  };

  const passValidator = (value) => {
    if (validator.isStrongPassword(value, { 
      minLength: 8, minLowercase: 1, 
      minUppercase: 1, minNumbers: 1, minSymbols: 1 
    })) { 
      setErrorMessage({ok:true, message:<div style={{color:"green"}}>{t("dialogs.validatepass")}</div>}) 
    } else { 
      setErrorMessage({ok:false,message:<div style={{color:"red"}}>{t("dialogs.novalidatepass")}</div>}) 
    } 
  };

  const openDialog = () => {
    setInfoDialog({
      isOpen:true,
      message: t("dialogs.passSuccess"),
      type: "success"
    })
  };

  useEffect(() => {
    isunique(newUser?.tin)
  }, [newUser?.tin]);

  useEffect(() => {
    passValidator(newUser?.password)
  }, [newUser?.password]);


  return(
    <div className={styles.reg_form} autoComplete="off"> 
      <TextField sx={{m:.6,w:"100%"}} 
        autoComplete="off"
        inputProps={{
          style: {
            height: "26px",
            padding:"1px 10px"
          }
        }}
        className={styles.reg_form_input}
        error={!newUser?.legalName && submitClick}
        name="legalName"
        value={newUser?.legalName}
        placeholder={`${t("authorize.legalName")} *`} 
        onChange={(e)=>handleChange(e)}
      />
      <TextField sx={{m:.6}} 
        inputProps={{
          style: {
            height: "26px",
            padding:"1px 10px"
          }
        }}
        error={!newUser?.legalAddress && submitClick }
        name="legalAddress"
        value={newUser?.legalAddress}
        placeholder={`${t("authorize.legalAddress")} *`} 
        onChange={(e)=>handleChange(e)}
      />
      <>
        <TextField sx={{m:.6}} 
          inputProps={{
            style: {
              height: "26px",
              padding:"1px 10px"
            }
          }}
          error={(!newUser?.tin && submitClick)|| (newUser?.tin && newUser?.tin?.length !==8) || (newUser?.tin && !unique)}
          name="tin"
          value={newUser?.tin}
          placeholder={`${t("authorize.tin")} (8 ${t("productinputs.symb")}) *`} 
          onChange={(e)=>limitChar(e,8)}     
          />
          <span style={{fontSize:"70%",marginLeft:"5px"}} className={!unique? styles.errorMessage: styles.successMessage}>
            {newUser?.tin?.length >7 && !unique && t("authorize.existTin")}

          </span>
      </>

      <TextField sx={{m:.6}} 
        inputProps={{
          style: {
            height: "26px",
            padding:"1px 10px"
          }
        }}
        name="tradeName"
        value={newUser?.tradeName}
        placeholder={t("authorize.tradeName")}
        onChange={(e)=>handleChange(e)}
      />
      <TextField sx={{m:.6}} 
        inputProps={{
          style: {
            height: "26px",
            padding:"1px 10px"
          }
        }}
        name="businessAddress"
        value={newUser?.businessAddress}
        placeholder={t("authorize.businessAddress")}
        onChange={(e)=>handleChange(e)}
      />
      <span style={{margin:"3px 10px",textAlign:"start", color:"orange",fontWeight:600}}> {t("authorize.director")}</span>
      <div className={styles.reg_form_div}>
        <TextField sx={{m:.6}} 
          inputProps={{
            style: {
              height: "26px",
              padding:"1px 10px"
            }
          }}
          error={!newUser?.firstName && submitClick}
          name="firstName"
          value={newUser?.firstName}
          placeholder={`${t("authorize.first")} *`} 
          onChange={(e)=>handleChange(e)}
        />
        <TextField sx={{m:.6}} 
          inputProps={{
            style: {
              height: "26px",
              padding:"1px 10px"
            }
          }}
          error={!newUser?.lastName && submitClick}
          name="lastName"
          value={newUser?.lastName}
          placeholder={`${t("authorize.last")} *`}
          onChange={(e)=>handleChange(e)}
        />
      <TextField  sx={{m:.6}} 
        inputProps={{
          style: {
            height: "26px",
            padding:"1px"
          }
        }}
          error={(!newUser?.phoneNumber && submitClick) ||(newUser?.phoneNumber && newUser?.phoneNumber?.length !==8)}
          name="phoneNumber"
          value={newUser?.phoneNumber}
          label={`${t("authorize.phone")} *`}
          onChange={(e)=>{
            limitChar(e,8)
          }
          }
          InputProps={{
            startAdornment: <InputAdornment position="start">+374</InputAdornment>,
          }}
        />
        </div>
        {/* NEW FIELD */}
      <div className={styles.reg_form_div}>

        <TextField sx={{m:.6}} 
           inputProps={{
            style: {
              height: "26px",
              padding:"1px 10px"
            }
          }}
          placeholder={`${t("authorize.address")}`} 
        />

        <TextField sx={{m:.6}} 
          inputProps={{
            style: {
              height: "26px",
              padding:"1px 10px",
              fontSize:"85%"
            }
          }}
          error={(!newUser?.email && submitClick) || (newUser?.email && !validMail)}
          name="email"
          type="email"
          value={newUser?.email}
          placeholder={`${t("authorize.email")} *`}
          onChange={(e)=>isValidMail(e)}
       />

        </div>
        <div className={styles.reg_form_div}>

        <TextField sx={{m:.6}} 
          inputProps={{
            style: {
              height: "26px",
              padding:"1px 10px"
            }
          }}
          name="country"
          value={newUser?.country}
          placeholder={`${t("authorize.country")} `}
          onChange={(e)=>handleChange(e)}
        />
        <TextField sx={{m:.6}} 
          inputProps={{
            style: {
              height: "26px",
              padding:"1px 10px"
            }
          }}
          placeholder={`${t("authorize.city")} `}
          name="city"
          value={newUser?.city}
          onChange={(e)=>handleChange(e)}
        />
        <TextField sx={{m:.6}} 
          inputProps={{
            style: {
              height: "26px",
              padding:"1px 10px"
            }
          }}
          type="number"
          name="zipCode"
          value={newUser?.zipCode}
          placeholder={`${t("authorize.zipCode")}`}
          onChange={(e)=>handleChange(e)}
        />
      </div>
      <span style={{margin:"3px 10px",textAlign:"start",color:"orange",fontWeight:600}}> {t("authorize.usernamePassword")}</span>
      <div className={styles.reg_form_div}>
        <FormControl style={{margin:"0px"}}>
            <span style={{
              height: "26px",
              padding:"5px 10px",
              margin:"5px 0px",
              color:"orange",
              fontWeight:700,
              textDecoration:"underline",
              textAlign:"start"
            }}>
            {`Login (${t("authorize.tin")}): ${newUser?.userName} `}
          </span>
          <FormHelperText >
          <span className={!unique? styles.errorMessage: styles.successMessage}>
            {newUser?.userName && !unique && t("authorize.exist")}
            {newUser?.userName && newUser?.userName.length>4 && unique && t("authorize.exist1")}
          </span>
         </FormHelperText>
        </FormControl>

        <TextField sx={{m:.6}}
          inputProps={{
            style: {
              height: "26px",
              padding:"1px 10px"
            },
          }}
          InputProps={{
            endAdornment: 
              <InputAdornment position="end">
                {!seePass ?
                 <VisibilityIcon style={{padding:2}} onClick={()=>setSeePass(true)} /> :
                 <VisibilityOffIcon style={{padding:2}} onClick={()=>setSeePass(false)} />
                } 
                {/* <span onClick={openDialog} style={{fontWeight:700,color:"green", fontSize:"130%", cursor:"pointer",paddingLeft:"5px"}}>{"?"}</span> */}
              </InputAdornment>,
          }}
           helperText={newUser?.password?.length ? errorMessage?.message : ""}
          error={!newUser?.password && submitClick}
          autoComplete="new-password"
          name="password"
          type={seePass ? "text" : "password"}
          value={newUser?.password}
          placeholder={`${t("authorize.password")} *`} 
          onChange={(e)=>handleChange(e)}
        />
        
        <TextField sx={{m:.6}} 
          inputProps={{
            style: {
              height: "26px",
              padding:"1px 10px"
            },
            
          }}
          InputProps={{
            endAdornment: 
            <InputAdornment position="end">
              {!seePass2 ?
                 <VisibilityIcon style={{padding:2}} onClick={()=>setSeePass2(true)} /> :
                 <VisibilityOffIcon style={{padding:2}} onClick={()=>setSeePass2(false)} />
                 } 
            </InputAdornment>,
          }}
          error={(!confirmPass && submitClick) || !isIdentity}
          autoComplete="new-password"
          name=""
          type={seePass2 ? "text" : "password"}
          value={confirmPass}
          placeholder={`${t("settings.confirmpassword")} *`}
          onChange={(e)=>{
            setMessage("")
            setConfirmPass(e.target.value)}}
        />    
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:"85%"}}>
          <span className={styles.errorMessage} >
            {message?.message &&  message?.message}
          </span>
        <PreRegistrateAgreement agree={agree} setAgree={setAgree} t={t} title={<TermsConditionsLink t={t} />}/>
      </div>
      
      <BackAndOk func={reg} btnName={t("authorize.register")} link={"/login"} />
      {infoDialog?.message &&
        <Dialog open={infoDialog?.isOpen} onClose={()=>setInfoDialog({isOpen: false, message:"",type:"info"})}>
          <SnackErr type={infoDialog?.type} message={infoDialog?.message}  close={()=>setInfoDialog({isOpen: false, message:"",type:"info"})}/>
        </Dialog>
      }
    </div>
  )
};

export default memo(RegistrationForm);
