import React, { memo, useEffect } from "react";

import styles from "./index.module.scss";
import { useState } from "react";
import { isUniqueNik } from "../../../../services/auth/auth";
import { Dialog, FormControl, FormHelperText, InputAdornment, TextField } from "@mui/material";
// import { mailValidate } from "../../../modules/mailValidate";
import validator from "validator";
import SnackErr from "../../../../Container2/dialogs/SnackErr";

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { mailValidate } from "../../../../modules/mailValidate";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

const UpdateForm = ({data, setNewData, newData}) => {
// needed
  const dispatch= useDispatch;
  const {t} = useTranslation();

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
    setInfoDialog({
      isOpen: false,
      message:"",
      type:"",
    })
    setNewData({
      ...newData,
      [e.target.name]:e.target.value
    })
  };

  const isunique = (e) => {
    setUnique(true)
    setNewData({
      ...newData,
      "userName": newData?.tin
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
    handleChange(e)
     const res= await mailValidate(e.target.value)
      setValidMail(res)
      !res ?
    
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


  useEffect(() => {
    isunique(newData?.tin)
  }, [newData?.tin]);
  return(
    <div>
        <TextField sx={{m:.6,w:"100%"}} 
        autoComplete="off"
        inputProps={{
          style: {
            height: "26px",
            padding:"1px 10px"
          }
        }}
        className={styles.reg_form_input}
        error={!newData?.legalName && submitClick}
        name="legalName"
        value={newData?.legalName}
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
        error={!newData?.legalAddress && submitClick }
        name="legalAddress"
        value={newData?.legalAddress}
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
          error={(!newData?.tin && submitClick)|| (newData?.tin && newData?.tin?.length !==8) || (newData?.tin && !unique)}
          name="tin"
          value={newData?.tin}
          placeholder={`${t("authorize.tin")} (8 ${t("productinputs.symb")}) *`} 
          onChange={(e)=>limitChar(e,8)}     
          />
          <span style={{fontSize:"70%",marginLeft:"5px"}} className={!unique? styles.errorMessage: styles.successMessage}>
            {newData?.tin?.length >7 && !unique && t("authorize.existTin")}

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
        value={newData?.tradeName}
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
        value={newData?.businessAddress}
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
          error={!newData?.firstName && submitClick}
          name="firstName"
          value={newData?.firstName}
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
          error={!newData?.lastName && submitClick}
          name="lastName"
          value={newData?.lastName}
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
          error={(!newData?.phoneNumber && submitClick) ||(newData?.phoneNumber && newData?.phoneNumber?.length !==8)}
          name="phoneNumber"
          value={newData?.phoneNumber}
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
          error={(!newData?.email && submitClick) || (newData?.email && !validMail)}
          name="email"
          type="email"
          value={newData?.email}
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
          value={newData?.country}
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
          value={newData?.city}
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
          value={newData?.zipCode}
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
              textAlign:"flex-start",
              // textAlign:"start"
            }}>
            {`Login (${t("authorize.tin")}): ${newData?.userName} `}
          </span>
          <FormHelperText >
          <span className={!unique? styles.errorMessage: styles.successMessage}>
            {newData?.userName && !unique && t("authorize.exist")}
            {newData?.userName && newData?.userName.length>4 && unique && t("authorize.exist1")}
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
              </InputAdornment>,
          }}
           helperText={newData?.password?.length ? errorMessage?.message : ""}
          error={!newData?.password && submitClick}
          autoComplete="new-password"
          name="password"
          type={seePass ? "text" : "password"}
          value={newData?.password}
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
      </div>
      
      
      {infoDialog?.message &&
        <Dialog open={infoDialog?.isOpen} onClose={()=>setInfoDialog({isOpen: false, message:"",type:"info"})}>
          <SnackErr type={infoDialog?.type} message={infoDialog?.message}  close={()=>setInfoDialog({isOpen: false, message:"",type:"info"})}/>
        </Dialog>
      }
    </div>
  )
};

export default memo(UpdateForm);

// {
//   "director": {
//     "id": 0,
//     "email": "string",
//     "businessAddress": "string",
//     "phoneNumber": "string",
//     "city": "string",
//     "country": "string",
//     "zipCode": "string",
//     "firstName": "string",
//     "lastName": "string",
//     "isInDate": true,
//     "days": 0,
//     "showPaymentPage": true,
//     "isRegisteredInEhdm": true,
//     "activeServiceType": 0,
//     "contractLink": "string",
//     "nextPaymentDate": "2025-02-21T12:09:34.308Z",
//     "cashiersMaxCount": 0,
//     "confirmation": true,
//     "registrationCode": "string",
//     "isActive": true,
//     "status": 0,
//     "agreementDate": "string",
//     "agreementNo": "string",
//     "completedRegistration": true,
//     "regDate": "2025-02-21T12:09:34.308Z"
//   },
//   "store": {
//     "id": 0,
//     "legalName": "string",
//     "logo": "string",
//     "legalAddress": "string",
//     "city": "string",
//     "tin": "string",
//     "zipCode": "string",
//     "tid_Api": "string",
//     "tid_Password": "string",
//     "status": true,
//     "taxRegime": 0,
//     "merchantXExist": true,
//     "merchantType": 0,
//     "directorId": 0
//   }
// }