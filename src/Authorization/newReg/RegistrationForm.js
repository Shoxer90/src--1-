import React, { memo, useEffect } from "react";

import styles from "./index.module.scss";
import { useState } from "react";
import { getDataByTin, registrationNew } from "../../services/auth/auth";
import { Checkbox, Dialog, FormControl, FormControlLabel, InputAdornment, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from "@mui/material";
import { mailValidate } from "../../modules/mailValidate";
import TermsConditionsLink from "../loginAuth/preRegistrate/TermsConditionsLink";
import PreRegistrateAgreement from "../loginAuth/preRegistrate/PreRegistrateAgreement";

import SnackErr from "../../Container2/dialogs/SnackErr";
import BackAndOk from "../loginAuth/buttonGroup/backAndOk";
import { useTranslation } from "react-i18next";

const RegistrationForm = ({newUser, setNewUser, successSubmit,  setIsLoad}) => { 
  const {t} = useTranslation();
  const [message,setMessage] = useState({message:"", type:""});
  const [confirmPass,setConfirmPass]= useState("");
  const [submitClick, setSubmitClick] = useState(false);
  const [validMail, setValidMail] = useState(false);
  const [agree,setAgree] = useState(false);
  const [infoDialog,setInfoDialog] = useState({
    isOpen: false,
    message:"",
    type:"info",
  })
  const taxtType = [
    {
      id: 1,
      name: t("productinputs.nds"),
    },  {
      id: 2,
      name: t("productinputs.ndsNone"),
    },  {
      id: 3,
      name: t("productinputs.tax3"),
    },  {
      id: 7,
      name: t("productinputs.tax7"),
    },
  ]
 
  const handleChange = (e) => {
    setSubmitClick(false)
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
      setNewUser({
        ...newUser,
       [e.target.name]: e.target.value,
     
      })
      if(e.target.name === "tin") {
        setNewUser({
          ...newUser,
          [e.target.name]: e.target.value,
          legalName: "",
          legalAddress: ""
        })
        if(text.length === 8) {
          setIsLoad(true)
          getDataByTin(e.target.value).then((res) => {
            setIsLoad(false)
            if(res?.response?.status === 400) {
              setInfoDialog({isOpen: true, message:res?.response?.data?.message,type:"error"})
            }else{
              setNewUser({
                ...newUser,
                tin: e.target.value,
                legalName: res?.data?.legalName,
                legalAddress: res?.data?.legalAddress
              })
            }
          })
        }
      }
    }
  };

  const registrateNewUserV2 = () => {
    registrationNew(newUser).then((res) => {
      setSubmitClick(false)
      successSubmit(res)
      setConfirmPass("")
    }) 
  };


  const reg = () => {
    setSubmitClick(true)
    if(!agree){
      return setInfoDialog({
        isOpen: true,
        message:`${t("authorize.beforeRegisterDialog")} ${t("authorize.beforeRegisterTerms")}`,
        type:"error",
      })
    }if(!validMail){
      return  setInfoDialog({
        isOpen: true,
        message: t("authorize.errors.notMail"),
        type:"error",
      })
    }else if(newUser?.isRegisteredForEhdm) {
      if(
        !newUser?.phoneNumber ||
        !newUser?.email ||
        !newUser?.tradeName ||
        !newUser?.taxRegime ||
        !newUser?.legalName ||
        !newUser?.tin
      ) {
        return  setInfoDialog({
          isOpen: true,
          message: t("authorize.errors.allInputEmpty"),
          type:"error",
        })
      }else{
       return registrateNewUserV2()
      }
    }else {
      if(
        !newUser?.phoneNumber ||
        !newUser?.email ||
        !newUser?.tradeName
      ) {
        return  setInfoDialog({
          isOpen: true,
          message: t("authorize.errors.allInputEmpty"),
          type:"error",
        })
      }else{
       return registrateNewUserV2()
      }
    }
  };


  return(
    <div className={styles.reg_form} autoComplete="off"> 
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

       

        <TextField sx={{m:.6}} 
          error={!newUser?.tradeName && submitClick}
          inputProps={{
            style: {
              height: "26px",
              padding:"1px 10px"
            }
          }}
          name="tradeName"
          value={newUser?.tradeName}
          placeholder={`${t("authorize.tradeName")} *`}
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
        <FormControlLabel
          sx={{margin:"10px 0px", color:"black"}}
          value={newUser?.isRegisteredForEhdm}
          name="isRegisteredForEhdm"
          control={<Checkbox sx={{margin:"0px"}} />}
          label={t("authorize.ehdmConnect1")}
          labelPlacement="end"
          onChange={(e)=> {
            setNewUser({
              ...newUser,
              [e.target.name]:e.target.checked
            })
          }}
        />
        {newUser?.isRegisteredForEhdm && <>
         <TextField sx={{m:.6}} 
            autoComplete="off"
          inputProps={{
            style: {
              height: "26px",
              padding:"1px 10px"
            }
          }}
          error={(!newUser?.tin && submitClick)|| (newUser?.tin && newUser?.tin?.length !==8)}
          name="tin"
          value={newUser?.tin}
          placeholder={`${t("authorize.tin")} (8 ${t("productinputs.symb")}) *`} 
          onChange={(e)=>limitChar(e,8)}     
          />
          <span style={{color:"black", textAlign:"start", margin:"10px"}}>
            <div>
              <span style={{fontWeight:700}}>{`${t("authorize.legalName")} *`}</span>
              <span>{newUser?.legalName}</span>
            </div>
            <div>
              <span style={{fontWeight:700}}>{`${t("authorize.legalAddress")} *`}</span>
              <span>{newUser?.legalAddress}</span>
            </div>
          </span>
          {/* <FormControl sx={{ width: "60%", margin:"10px"}}>
            <InputLabel>{`${t("authorize.taxType")}*`}</InputLabel>
            <Select
              error={!newUser?.taxRegime && submitClick}
              size="small"
              name="taxRegime"
              value={newUser?.taxRegime}
              // label={`${t("authorize.taxType") }*`}
              onChange={(e)=>handleChange(e)}
              renderValue={(value) => (value ? value : `${t("authorize.taxType") } *`)} 

            >
              {taxtType && taxtType.map((item, index) => (
                <MenuItem 
                  key={item?.id} 
                  value={item?.id}
                >
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}

          <h5 style={{textAlign:"start",marginLeft:"25px",color:"black"}}>{`${t("authorize.taxType") } *`}</h5>
          <FormControl sx={{color:"black"}}>
            <RadioGroup
              name="taxRegime"
              value={newUser?.taxRegime}
              onChange={(e)=>handleChange(e)}
            >
            {taxtType && taxtType.map((item) => (
              <FormControlLabel sx={{ p:0,ml:2}} value={item?.id} control={<Radio />} label={item?.name} />
            ))}
            </RadioGroup>
          </FormControl>

        </>}
      <PreRegistrateAgreement agree={agree} setAgree={setAgree} t={t} title={<TermsConditionsLink t={t} />} />
      <div style={{marginBottom:"40px"}}>
        
      <BackAndOk func={reg} btnName={t("authorize.register")} link={"/login"} />
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

export default memo(RegistrationForm);
