import {Card, Dialog} from "@mui/material";
import React, { useEffect, memo, useState } from "react";
import styles from "./index.module.scss";
import { useSelector } from "react-redux";
import SnackErr from "../../dialogs/SnackErr";
import CompleteUserData from "./CompleteUserData";

const ClientInfo = ({limitedUsing, setIsLoad, logOutFunc}) => {
const {user} = useSelector(state => state.user);
const [formatPhone, setFormatPhone] = useState("");
const [registerMessage, setRegisterMessage] = useState({});

const formatePhoneNumber = () => {
  let number = user?.phoneNewForm
  if(user?.phoneNewForm[0] === "0") {
    number = user?.phoneNewForm.slice(1, user?.phoneNewForm.length)
  }
  if(!number.includes("+374")) {
    number = `+374${number}`
  }
  setFormatPhone(number.split(" ").join(""))
};


useEffect(() => {
  user?.phoneNewForm && formatePhoneNumber()
}, [user]);

  return (
    <div className={styles.settingsCont}>
      <CompleteUserData 
        setIsLoad={setIsLoad}
        formatPhone={formatPhone}
        message={registerMessage} 
        setMessage={setRegisterMessage}
      />
      <Dialog open={Boolean(registerMessage.m)} onClose={()=>setRegisterMessage({m:"",t:""})}>
        <SnackErr 
          message={registerMessage.m} 
          type={registerMessage?.t} 
          close={()=>{
            setRegisterMessage({m:"",t:""})
          }}
        />
      </Dialog>
    </div>
  )
};

export default memo(ClientInfo);
