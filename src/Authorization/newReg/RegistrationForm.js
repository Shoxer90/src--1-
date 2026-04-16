import React, { memo, useEffect } from "react";

import styles from "./index.module.scss";
import { useState } from "react";
import { getDataByTin, registrationNew , requestVerifyEmail,requestVerifyPhone} from "../../services/auth/auth";
import { Box, Button, Checkbox, Dialog, FormControl, FormControlLabel, Input, InputAdornment, InputLabel, MenuItem, OutlinedInput, Radio, RadioGroup, Select, styled, TextField } from "@mui/material";
import { mailValidate } from "../../modules/mailValidate";
import TermsConditionsLink from "../loginAuth/preRegistrate/TermsConditionsLink";
import PreRegistrateAgreement from "../loginAuth/preRegistrate/PreRegistrateAgreement";

import SnackErr from "../../Container2/dialogs/SnackErr";
import BackAndOk from "../loginAuth/buttonGroup/backAndOk";
import { useTranslation } from "react-i18next";
import VerifyDialoge from "./verify/VerifyDialoge";
import { useSuccessSound } from "../../modules/PlaySound";
// import styled from "styled-components";

const RegistrationForm = ({newUser, setNewUser, successSubmit,  setIsLoad}) => { 
  const {t} = useTranslation();
  const [message,setMessage] = useState({message:"", type:""});
  const [verifyCode, setVerifyCode] = useState("");

  const [submitClick, setSubmitClick] = useState(false);
  const [validMail, setValidMail] = useState(false);
  const [agree,setAgree] = useState(false);
  const [infoDialog,setInfoDialog] = useState({
    isOpen: false,
    message:"",
    type:"info",
  });
  const [isVerify,setIsVerify] = useState({
    email: false,
    phone: false,
  });


  const [openVerify, setOpenVerify] = useState({
    type:"",  //email or phone,
    isOpen:false
  });


  const GreenDisabledButton = styled(Button)({
    '&.Mui-disabled': {
      color: 'green'
    }
  });

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
    setIsLoad(true)
    registrationNew(newUser).then((res) => {
    setIsLoad(false)
      setSubmitClick(false)
      successSubmit(res)
    }) 
  };


  const reg = () => {
    setSubmitClick(true)
    if(!isVerify?.email) {
      return  setInfoDialog({
        isOpen: true,
        message:t("authorize.notVerifiedEmail"),
        type:"error"
      })
    }
    if(!isVerify?.phone) {
      return  setInfoDialog({
        isOpen: true,
        message:t("authorize.notVerifiedPhone"),
        type:"error"
      })
    }
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

  const playSuccess = useSuccessSound();

  const sendVerifyCodeRequest = async(str) => {
    setIsLoad(true)
    setVerifyCode("")

    let data = null
    if(str === "email") {
       data = await requestVerifyEmail({
        email:newUser?.email
      })
    }else if(str === "phone") {
      data = await requestVerifyPhone({
        phone:newUser?.phoneNumber
      })
    }
    setIsLoad(false)

    data && data?.status !== 200 && 
    setInfoDialog({
      message:data?.data?.message,
      type:"error",
      isOpen:true
    })
    if( data && data?.status === 200) {
      playSuccess()
      setOpenVerify({
       type:str,
       isOpen:true
     })
    setInfoDialog({
      message:data?.message,
      type:"success",
      isOpen:true
    })

    }
  }


  return(
    <div className={styles.reg_form} autoComplete="off"> 
      <div style={{display:"flex",padding:"6px"}}>
        <TextField
          inputProps={{style: {height: "26px",padding:"1px 10px"}}}
          style={{flex:1}}
          error={(!newUser?.email && submitClick) || (newUser?.email && !validMail) || (!isVerify?.email&& submitClick )}
          name="email"
          type="email"
          value={newUser?.email}
          placeholder={`${t("authorize.email")} *`}
          onChange={(e)=>{
            setIsVerify({
              ...isVerify,
              [e.target.name]: false
            })
            isValidMail(e)
          }}
        />
  { !isVerify?.email ? <Button 
            size="small"
            variant="contained" 
            style={{height: "27px",textTransform: "capitalize",width:"100px", marginLeft:"10px"}}
            onClick={()=> sendVerifyCodeRequest("email")}
          >
            {t("buttons.confirm")}
          </Button>:
          <GreenDisabledButton 
            variant="contained" 
            size="small"
            style={{height: "27px",textTransform: "capitalize",width:"100px", marginLeft:"10px"}}
            disabled
          >
           {t("buttons.confirmed")}
          </GreenDisabledButton>
        }
      </div>

      <div style={{display:"flex", padding:"6px"}}>
        <TextField 
          inputProps={{style: {height: "26px",padding:"1px 10px"}}}
          error={(!newUser?.phoneNumber && submitClick) ||(newUser?.phoneNumber && newUser?.phoneNumber?.length !==8) || (!isVerify?.phone && submitClick )}
          name="phoneNumber"
          value={newUser?.phoneNumber}
          label={`${t("authorize.phone")} *`}
          style={{flex:1}}
          onChange={(e)=>{
            setIsVerify({
              ...isVerify,
              phone: false
            })
            limitChar(e,8)
          }}
          InputProps={{startAdornment: <InputAdornment position="start">+374</InputAdornment>}}
        />
        { !isVerify?.phone ? <Button 
            size="small"
            variant="contained" 
            style={{height: "27px",textTransform: "capitalize",width:"100px", marginLeft:"10px"}}
            onClick={()=> sendVerifyCodeRequest("phone")}
          >
            {t("buttons.confirm")}
          </Button>:
          <GreenDisabledButton 
            variant="contained" 
            size="small"
            style={{height: "27px",textTransform: "capitalize",width:"100px", marginLeft:"10px"}}
            disabled
          >
           {t("buttons.confirmed")}
          </GreenDisabledButton>
        }

      </div>



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
          error={(!newUser?.tin && submitClick)|| (newUser?.tin && newUser?.tin?.length !==8 )}
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
          
      {infoDialog?.message &&
        <Dialog open={infoDialog?.isOpen} onClose={()=>setInfoDialog({isOpen: false, message:"",type:"info"})}>
          <SnackErr type={infoDialog?.type} message={infoDialog?.message}  close={()=>setInfoDialog({isOpen: false, message:"",type:"info"})}/>
        </Dialog>
      }
      <VerifyDialoge
        open={openVerify?.isOpen}
        close={()=>{
          setOpenVerify({
            isOpen:false,
            type:""
          })
        }}
        content={openVerify}
        newUser={newUser}
        isVerify={isVerify} 
        setIsVerify={setIsVerify}
        setInfoDialog={setInfoDialog}
        sendVerifyCodeRequest={sendVerifyCodeRequest}
        verifyCode={verifyCode} 
        setVerifyCode={setVerifyCode}

      />

    </div>
  )
};

export default memo(RegistrationForm);
