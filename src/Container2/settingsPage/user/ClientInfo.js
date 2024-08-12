import {Card} from "@mui/material";
import React, { useEffect, memo, useState } from "react";
import styles from "./index.module.scss";
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import HomeIcon from '@mui/icons-material/Home';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { useSelector } from "react-redux";

const ClientInfo = () => {
const {user} = useSelector(state => state.user);
const [formatPhone, setFormatPhone] = useState("");

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
    <Card className={styles.settingsCont}>
      {formatPhone && 
        <div className={styles.settingsCont_info_name_header}>
          <PhoneInTalkIcon sx={{m:1}} />
          <span className={styles.settingsCont_info_item}>
            <>
              {formatPhone?.slice(0,4)} ({formatPhone?.slice(4,6)}) {formatPhone?.slice(6, 8)}-{formatPhone?.slice(8, 10)}-{formatPhone?.slice(10,12)} 
            </>
          </span>
        </div>
      }
      <div className={styles.settingsCont_info_name_header}>
        <HomeIcon sx={{m:1}} />
        <span className={styles.settingsCont_info_item} style={{fontSize:"74%"}}>
          { user?.addressNewForm}
        </span>
      </div>
      <div className={styles.settingsCont_info_name_header}>
        <AlternateEmailIcon sx={{m:1}} />
        {user?.email}
      </div>
    </Card>
  )
};

export default memo(ClientInfo);
