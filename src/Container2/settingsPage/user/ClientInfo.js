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
    <Card className={styles.settingsCont}>
      <div className={styles.settingsCont_info_name_header}>
        <PhoneInTalkIcon sx={{m:1}} />
        <span className={styles.settingsCont_info_item}>
          {user?.phoneNewForm?.includes("+374") ?
            <>
             {user?.phoneNewForm?.slice(0,4)} ({user?.phoneNewForm?.slice(4,6)}) {user?.phoneNewForm?.slice(6, 8)}-{user?.phoneNewForm?.slice(8, 10)}-{user?.phoneNewForm?.slice(6,8)} 
            </>:
            <>
              +374({user?.phoneNewForm?.slice(0,2)}) {user?.phoneNewForm?.slice(2, 4)}-{user?.phoneNewForm?.slice(4, 6)}-{user?.phoneNewForm?.slice(6,8)}
            </>
          }
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
        {user?.email}
      </div>
    </Card>
  )
};

export default memo(ClientInfo);
