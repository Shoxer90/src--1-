import React, { memo, useEffect } from "react";

import styles from "./index.module.scss";
import { useState } from "react";
import { Button, Checkbox, Dialog, FormControl, FormControlLabel, InputAdornment, Radio, RadioGroup, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { completeEhdmRegistration, getDataByTin } from "../../../services/auth/auth";
import SnackErr from "../../dialogs/SnackErr";
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import StoreIcon from '@mui/icons-material/Store';
import { useSelector } from "react-redux";
import CertificateUploader from "./CertificateUploader";
import AddNewClientInfo from "../../dialogs/AddNewClientInfo";
import ConfirmDialog from "../../dialogs/ConfirmDialog";
import BusinessIcon from '@mui/icons-material/Business';
import Loader from "../../loading/Loader";


const CompleteUserData = ({formatPhone ,logOutFunc, setMessage, switchStatus}) => { 
  const {user} = useSelector(state => state.user);
const [newUser, setNewUser] = useState({});

  const {t} = useTranslation();
  const [submitClick, setSubmitClick] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [changeInfo, setChangeInfo] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
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
    setChangeInfo(true)
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

  const completeReg = () => {
    setOpenConfirmation(false)
    setSubmitClick(true)
    if(!newUser?.tradeName) {
      return setMessage({
        t:"error",
        m:t("authorize.errors.allInputEmpty")
      })
    }else if(newUser?.tin && newUser?.taxRegime && newUser?.legalAddress && newUser?.legalName){
      setNewUser({
        ...newUser,
        isRegisteredForEhdm: true
      })
    }else {
      setNewUser({
        ...newUser,
        isRegisteredForEhdm: false
      })
    }
    setLoaded(true)
    completeEhdmRegistration({
      ...newUser, 
      taxRegime: newUser?.taxRegime? newUser?.taxRegime: 0 
    }).then((res) => {
      setLoaded(false)
      if(res.status === 200) {
        setChangeInfo(false)
        return setMessage({
          t:"success",
          m:t("dialogs.done")
        })

      }else{
        setMessage({
          t:"error",
          m:t("dialogs.wrong")
        })
      }
    })
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
          setLoaded(true)
          getDataByTin(e.target.value).then((res) => {
            setLoaded(false)
            if(res?.status === 200) {
              setChangeInfo(true)
              setSubmitClick(false)
              setNewUser({
                ...newUser,
                tin: e.target.value,
                legalName: res?.data?.legalName,
                legalAddress: res?.data?.legalAddress
              })
            }else{
              setInfoDialog({isOpen: true, message:res?.response?.data?.message,type:"error"})
            }
          })
        }
      }
    }
  };

  const disableBtn = () => {
    if(newUser?.isRegisteredForEhdm) {
      if(!newUser?.tin || !newUser?.taxRegime || !newUser?.legalName || !newUser?.legalAddress){
        return true
      }else{
        return false
      }
    }else{
      return false
    }
  }


  useEffect(() => {
    user && setNewUser({
      tin: user?.tin || "",
      legalName:user?.legalName ||"",
      legalAddress: user?.legalAddress || "",
      taxRegime: user?.taxRegime || "",
      businessAddress: user?.businessAddress || "",
      tradeName: user?.tradeName || "",
      isRegisteredForEhdm: user?.isRegisteredForEhdm || false
    })
    
  }, [user]);

  return(
    <div className={styles.reg_form} autoComplete="off"> 
    <h3>{t("settings.info")}</h3>
  
    <div style={{display:"flex", alignItems:"center"}}>
      <h6 style={{marginLeft:"20px",marginRight:"15px"}}><AlternateEmailIcon sx={{color:"#fd7e14"}} /></h6>
      <h6>{user?.email}</h6>
    </div>
    <div style={{display:"flex", alignItems:"center"}}>
      <h6 style={{marginLeft:"20px",marginRight:"15px"}}><PhoneInTalkIcon sx={{color:"#fd7e14"}} /></h6>
      <h6>{`${formatPhone?.slice(0,4)} (${formatPhone?.slice(4,6)}) ${formatPhone?.slice(6, 8)}-${formatPhone?.slice(8, 10)}-${formatPhone?.slice(10,12)}`}</h6>
    </div>
      <TextField 
        autoComplete="off"
        onFocus={changeInfo}
          inputProps={{
            style: {
              height: "30px",
              padding:"1px 10px"
            }
          }}
          name="tradeName"
          value={newUser?.tradeName}
          error={!newUser?.tradeName && submitClick}
          placeholder={`${t("authorize.tradeName")} *`}
          onChange={(e)=>handleChange(e)}
          InputProps={{
            startAdornment: <InputAdornment position="start">
              <StoreIcon sx={{m:.5, color:"#fd7e14"}} />
            </InputAdornment>,
          }}
        />
        <TextField 
          sx={{
            mt:.6,
          }} 
          disablePortal
          autoComplete="off"
          inputProps={{
            style: {
              height: "30px",
              padding:"1px"
            }
          }}
          name="businessAddress"
          value={newUser?.businessAddress ||""}
          placeholder={t("authorize.businessAddress")}
          onChange={(e)=>handleChange(e)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><BusinessIcon sx={{m:1, color:"#fd7e14"}} /></InputAdornment>,
          }}
        />
      
        <FormControlLabel
          autoComplete="off"
          sx={{ml:1.8,color:"black"}}
          checked={newUser?.isRegisteredForEhdm ? true: false}
          name="isRegisteredForEhdm"
          control={<Checkbox size="small" sx={{mr:1.2}}/>}
          label={t("settings.ETRM")}
          disabled={user?.isRegisteredForEhdm && user?.tin}
          onChange={(e)=> {
            if(e.target.checked === false) {
              setNewUser({
                ...newUser,
                isRegisteredForEhdm: false,
                tin:"",
                taxRegime: "",
                legalName: "" ,
                legalAddress:""
              })
            }else{
              setNewUser({
                ...newUser,
                isRegisteredForEhdm: true,
              })
            }
          }}
        />
       


        {(user?.isRegisteredForEhdm || newUser?.isRegisteredForEhdm) && 
          <>
            <div style={{display:"flex", justifyContent:"flex-start"}}>
                
            <TextField 
              sx={{mt:.6,ml:4,width:"300px"}} 
              autoComplete="off"
              inputProps={{
                style: {
                  height: "30px",
                  padding:"1px 10px"
                }
              }}
              error={(!newUser?.tin && submitClick)|| (newUser?.tin && newUser?.tin?.length !==8)}
              name="tin"
              value={newUser?.tin}
              disabled={user?.tin}
              placeholder={`${t("authorize.tin")} (8 ${t("productinputs.symb")}) *`} 
              onChange={(e)=>limitChar(e,8)} 
              InputProps={{
                startAdornment: <InputAdornment position="start">{`${t("authorize.tin")} `}</InputAdornment>,
              }}   
              />
           
              </div>

          <span style={{color:"black", textAlign:"start", margin:"5px 20px", fontSize:"80%"}}>
            <div>
              <span style={{fontWeight:500}}>{`${t("authorize.legalName")} *`}</span>
              <span>{newUser?.legalName}</span>
            </div>
            <div>
              <span style={{fontWeight:500}}>{`${t("authorize.legalAddress")} *`}</span>
              <span>{newUser?.legalAddress}</span>
            </div>
          </span>
            <h6 style={{textAlign:"start",marginLeft:"20px"}}>{`${t("authorize.taxType") } *`}</h6>
          <FormControl>
            <RadioGroup
              name="taxRegime"
              value={newUser?.taxRegime}
              onChange={(e)=>handleChange(e)}
              defaultValue={newUser?.taxRegime || user?.taxRegime}
            >
            {taxtType && taxtType.map((item) => (
              <FormControlLabel sx={{p:0,ml:2}} value={item?.id} control={<Radio 
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: 12,
                  }}}
                />} label={item?.name} />
            ))}
            </RadioGroup>
          </FormControl>
        </>}
        <CertificateUploader 
          isRegisteredInEhdm={user?.isRegisteredInEhdm }
          activeServiceType={user?.activeServiceType}
          switchStatus={switchStatus}
        />
        {/* {!user?.isRegisteredInEhdm && user?.activeServiceType === 3 ?  <CertificateUploader /> : ""} */}
       
      { changeInfo &&
        <Button
          variant="contained"
          onClick={()=>setOpenConfirmation(true)}
          disabled={disableBtn()}
          sx={{
            background: "#fd7e14",
            padding: "10px",
            m: 4,
          }}
        >
          {t("buttons.save")}
        </Button>
        }
      
      <AddNewClientInfo 
        setMessage={setMessage}
        openAddDialog={openAddDialog}
        setOpenAddDialog={setOpenAddDialog}
        logOutFunc={logOutFunc}

      />

      {infoDialog?.message &&
        <Dialog open={infoDialog?.isOpen} onClose={()=>setInfoDialog({isOpen: false, message:"",type:"info"})}>
          <SnackErr type={infoDialog?.type} message={infoDialog?.message}  close={()=>setInfoDialog({isOpen: false, message:"",type:"info"})}/>
        </Dialog>
      }
      {openConfirmation && 
         <ConfirmDialog
          func={completeReg}
          open={openConfirmation}
          close={setOpenConfirmation}
          content={t("settings.checkInfo")}
        />
      }
      <Dialog open={!!loaded}>
      <Loader close={!loaded} />
      </Dialog>
    </div>
  )
};

export default memo(CompleteUserData);
