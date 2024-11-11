import React, { memo, useEffect } from "react";
import RegistrationForm from "./form/RegistrationForm";
import { useState } from "react";
import SnackErr from "../../Container2/dialogs/SnackErr";
import { Dialog } from "@mui/material";
import Loader from "../../Container2/loading/Loader";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from "react-i18next";



const Registration = ({logOutFunc}) => {
  const [registerMessage,setRegisterMessage] = useState({m:"",t:""});
  const [isLoad,setIsLoad] = useState(false);
  const {t} = useTranslation();

  const [newUser, setNewUser] = useState({
    "legalName": "",
    "legalAddress": "",
    "tin": "",
    "tradeName": "",
    "country": "",
    "city": "",
    "businessAddress": "",
    "firstName": "",
    "lastName": "",
    "email": "",
    "phoneNumber": "",
    "zipCode": "",
    "userName": "",
    "password": ""
  });

  const successSubmit = (res) => {
    setIsLoad(false)
    if (res === 200) {
      setRegisterMessage({
        m: t("authorize.success"),
        t:"success"
      })
      setNewUser({
        "legalName": "",
        "legalAddress": "",
        "tin": "",
        "tradeName": "",
        "country": "",
        "city": "",
        "businessAddress": "",
        "firstName": "",
        "lastName": "",
        "email": "",
        "phoneNumber": "",
        "zipCode": "",
        "userName": "",
        "password": ""
      })
    }else if (res === 405) {
      setRegisterMessage({
        m: t("authorize.dublicate"),
        t:"error"
      })
    }else if(res === 400) {
      setRegisterMessage({
        m: t("authorize.dublicate"),
        t:"error"
      })
    }
  }

  useEffect(() => {
    localStorage.removeItem("token");
    // logOutFunc()
    
  },[]);

  return(
    <div>
      <RegistrationForm 
        newUser={newUser}
        setNewUser={setNewUser} 
        t={t}
        setIsLoad={setIsLoad}
        successSubmit={successSubmit}
      />
{/* 
      <a href={"/login"} style={{display:"block", margin:"auto"}}>
        <ArrowBackIcon  fontSize="small"/> 
        {t("buttons.back")} 
      </a> */}

      <Dialog open={Boolean(registerMessage.m)} onClose={()=>setRegisterMessage({m:"",t:""})}>
        <SnackErr 
          message={registerMessage.m} 
          type={registerMessage?.t} 
          close={()=>setRegisterMessage({m:"",t:""})} 
        />
      </Dialog>

      <Dialog open={isLoad}>
        <Loader/>
      </Dialog>

    </div>
  )
}; 

export default memo(Registration);
