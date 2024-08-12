import React, { memo, useEffect } from "react";

import styles from "./index.module.scss";
import { useState } from "react";
import { isUniqueNik, registrationNew } from "../../../services/auth/auth";
import { Dialog, FormControl, FormHelperText, InputAdornment, TextField } from "@mui/material";
import { mailValidate } from "../../../modules/mailValidate";
import TermsConditionsLink from "../../registration/preRegistrate/TermsConditionsLink";
import PreRegistrateAgreement from "../../registration/preRegistrate/PreRegistrateAgreement"
import BackAndOk from "../buttonGroup/backAndOk";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import validator from "validator";
import SnackErr from "../../../Container2/dialogs/SnackErr";

const RegistrationForm = ({newUser, setNewUser, t, successSubmit,  setIsLoad}) => { 

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

   const reg = () => {
    if(!agree)setMessage({message: `${t("authorize.beforeRegisterDialog")} ${t("authorize.beforeRegisterTerms")}`, type:"error"})
        // else if(!submitClick)registrateUser(newUser)
      else{
        registrateUser(newUser)
      }
   }

  const registrateUser = () => {
    console.log(confirmPass,"conf")
    console.log(newUser?.password, 'Pass')
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
      setInfoDialog({
        isOpen:true,
        message:`${t("dialogs.mismatch")} \n\n ${ t("dialogs.passSuccess")} `,
        type: "error"
      })
      // return setMessage({message: t("dialogs.mismatch"),type:"error"})
    }else if(!errorMessage?.ok){
      return setMessage({message: t("dialogs.novalidatepass"),type:"error"})

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
    setNewUser({
      ...newUser,
      "userName": "+374" + newUser?.phoneNumber
    })
  }, [newUser?.phoneNumber]);

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
      <TextField sx={{m:.6}} 
        inputProps={{
          style: {
            height: "26px",
            padding:"1px 10px"
          }
        }}
        error={(!newUser?.tin && submitClick )|| (newUser?.tin && newUser?.tin?.length !==8)}
        type="number"
        name="tin"
        value={newUser?.tin}
        placeholder={`${t("authorize.tin")} (8 ${t("productinputs.symb")}) *`} 
        // inputProps={{ maxLength: 8, minLength: 8 }}
        onChange={(e)=>limitChar(e,8)}     
      />

      {/* </div> */}
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
      {/* NEW FIELD */}
      <div className={styles.reg_form_div}>
        <TextField sx={{m:.6}} 
          inputProps={{
            style: {
              height: "26px",
              padding:"1px 10px"
            }
          }}
          // error={!newUser?.city && submitClick}
          placeholder={`${t("authorize.city")} `}
          name="city"
          value={newUser?.city}
          onChange={(e)=>handleChange(e)}
        />
       
      </div>
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
          type="number"
          // inputProps={{ maxLength: 8 }}
          value={newUser?.phoneNumber}
          label={`${t("authorize.phone")} *`}
          onChange={(e)=>{
            limitChar(e,8)

          }
          }
          InputProps={{
            startAdornment: <InputAdornment position="start">+374</InputAdornment>,
            // startAdornment: <InputAdornment position="start"> <span><LocalPhoneIcon fontSize="small" sx={{p:0}}/>+374</span></InputAdornment>,
          }}
        />
        </div>
        {/* NEW FIELD */}
        <TextField sx={{m:.6}} 
           inputProps={{
            style: {
              height: "26px",
              padding:"1px 10px"
            }
          }}
          // error={!newUser?.legalAddress && submitClick }
          placeholder={`${t("authorize.address")}`} 
          // onChange={(e)=>handleChange(e)}
        />
        <div className={styles.reg_form_div}>

        <TextField sx={{m:.6}} 
          inputProps={{
            style: {
              height: "26px",
              padding:"1px 10px"
            }
          }}
          // error={!newUser?.country && submitClick}
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
          // error={!newUser?.city && submitClick}
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

      <TextField sx={{m:.6}} 
         inputProps={{
          style: {
            height: "26px",
            padding:"1px 10px"
          }
        }}
        error={(!newUser?.email && submitClick) || (newUser?.email && !validMail)}
        name="email"
        type="email"
        value={newUser?.email}
        placeholder={`${t("authorize.email")} *`}
        onChange={(e)=>isValidMail(e)}
      />

      <span style={{margin:"3px 10px",textAlign:"start",color:"orange",fontWeight:600}}> {t("authorize.username")} {t("authorize.usernamePassword")}</span>
      <div className={styles.reg_form_div}>
        <FormControl style={{margin:"0px"}}>
          <TextField sx={{m:.6}} 
            inputProps={{
              autoComplete: 'off',
              style: {
                height: "26px",
                padding:"1px 10px"
              }
            }}
            error={!newUser?.userName && submitClick}
            name="userName"
            value={`${newUser?.userName}`}
            // value={newUser?.userName}
            placeholder={`${t("authorize.username")}*`}
            // onChange={(e)=>isunique(e)}
            aria-readonly
          />
          <FormHelperText >
          <span className={!unique? styles.errorMessage: styles.successMessage} style={{height:"12px"}}>
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
            endAdornment: <InputAdornment position="end">
              <span onClick={openDialog} style={{fontWeight:700,color:"green", fontSize:"130%", cursor:"pointer"}}>?</span>
            </InputAdornment>,
          }}
           helperText={newUser?.password?.length ? errorMessage?.message : ""}
          error={!newUser?.password && submitClick}
          autoComplete="new-password"
          name="password"
          type="password"
          value={newUser?.password}
          placeholder={`${t("authorize.password")} *`} 
          onChange={(e)=>handleChange(e)}
        />
        
        <TextField sx={{m:.6}} 
          inputProps={{
            style: {
              height: "26px",
              padding:"1px 10px"
            }
          }}
          error={(!confirmPass && submitClick) || !isIdentity}
          autoComplete="new-password"

          name=""
          type="password"
          value={confirmPass}
          placeholder={`${t("settings.confirmpassword")} *`}
          onChange={(e)=>{
            setMessage("")
            setConfirmPass(e.target.value)}}
        />    
      </div>
      <div style={{display:"flex",justifyContent:"space-between"}}>
          <span className={styles.errorMessage} style={{height:"15px"}}>
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
