import { memo, useEffect, useState } from "react";
import LangSelect from "../../Container2/langSelect";
import { useTranslation } from "react-i18next";
import RegistrationForm from "./RegistrationForm";
import SnackErr from "../../Container2/dialogs/SnackErr";
import { Dialog } from "@mui/material";
import Loader from "../../Container2/loading/Loader";
import { useNavigate } from "react-router-dom";

  const initialUserData = {
    "email": "",
    "phoneNumber": "",
    "tradeName": "",
    "businessAddress": "",
    "taxRegime": 0,
    "tin": "",
    "legalName": "",
    "legalAddress": "",
    "isRegisteredForEhdm": false,
    // "country": "",
    // "city": "",
    // "firstName": "",
    // "lastName": "",
    // "zipCode": "",
    // "userName": "",
  }

const NewSimpleRegistration = ({logOutFunc}) => {
  const {t} = useTranslation();
  const [registerMessage,setRegisterMessage] = useState({m:"",t:""});
  const [isLoad,setIsLoad] = useState(false);
  const navigate = useNavigate()
  const [newUser, setNewUser] = useState(initialUserData);

  const successSubmit = (res) => {
    setIsLoad(false)
    if (res?.status === 200) {
      setRegisterMessage({
        m: res?.data?.message,
        t:"success"
      })
      return setNewUser(initialUserData)
    }else if(res?.response?.data?.message){
      setRegisterMessage({
        m: res?.response?.data?.message,
        t:"error"
      })
    }else{
      setRegisterMessage({
      m: t("dialogs.wrong"),
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
          close={()=>{
            if(registerMessage?.t === "success") {
              navigate("/login")
            }
            setRegisterMessage({m:"",t:""})
          }} 
        />
      </Dialog>

      <Dialog open={isLoad}>
        <Loader/>
      </Dialog>

    </div>
  )
};

export default memo(NewSimpleRegistration);
