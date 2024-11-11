import { memo, useEffect, useState } from "react";
import LangSelect from "../../../Container2/langSelect";
import { useTranslation } from "react-i18next";
import RegistrationForm from "./RegistrationForm";
import SnackErr from "../../../Container2/dialogs/SnackErr";
import { Dialog } from "@mui/material";
import Loader from "../../../Container2/loading/Loader";



const Registration = ({logOutFunc}) => {
  const {t} = useTranslation();
  const [registerMessage,setRegisterMessage] = useState({m:"",t:""});
  const [isLoad,setIsLoad] = useState(false);

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
    "userName": "+374",
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
        "userName": "+374",
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
    logOutFunc()
  },[]);

  return(
    <div>
      <div style={{display:"flex", justifyContent:"space-between",alignItems:"center", margin:"5px"}}>
        <h4 style={{color:"orange",fontSize:"110%",fontWeight: 600, textAlign:"start"}}>{t("authorize.registration")}</h4>
        <LangSelect size={"22px"} />
      </div>
      <RegistrationForm 
        newUser={newUser}
        setNewUser={setNewUser} 
        t={t}
        setIsLoad={setIsLoad}
        successSubmit={successSubmit}
      />

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
