import {Card} from "@mui/material";
import React from "react";
import { memo } from "react";
import styles from "./index.module.scss";
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import HomeIcon from '@mui/icons-material/Home';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { useSelector } from "react-redux";

const ClientInfo = () => {
const {user} = useSelector(state => state.user)
  return (
    <Card sx={{m:1}}>
      <div className={styles.settingsCont_info_name_header}>
        <PhoneInTalkIcon sx={{m:1}} />
        <span className={styles.settingsCont_info_item}>
          ({user.phoneNewForm?.slice(0,3)}) {user.phoneNewForm?.slice(3, 5)}-{user.phoneNewForm?.slice(5, 7)}-{user.phoneNewForm?.slice(7,9)}
        </span>
      </div>
      <div className={styles.settingsCont_info_name_header}>
        <HomeIcon sx={{m:1}} />
        <span className={styles.settingsCont_info_item} style={{fontSize:"74%"}}>
          { user?.addressNewForm}
        </span>
      </div>
      <div className={styles.settingsCont_info_name_header}>
        <AlternateEmailIcon sx={{m:1}} />
        { user?.email}
      </div>
    </Card>
  )
};

export default memo(ClientInfo);
