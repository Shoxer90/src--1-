import { Badge, IconButton, Tooltip } from "@mui/material"
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { memo } from "react";
import styles from "../index.module.scss";
import styles2 from "../../Container/Header/index.module.scss";
import { useTranslation } from "react-i18next";


const OpenBtn = ({clickFunc, buttonRef, notificationCount, open}) => {
  const {t} = useTranslation();
  const bellStyle = {
    position:"relative",
    top:"-10px",
    left:"5px",
    cursor:"pointer",
    margin:"5px",
    color:open ? "#FFA500": "#3FB68A"
  };

  return (
    <Tooltip
      onClick={clickFunc} 
      ref={buttonRef}
      anchororigin={{
        vertical: 'top',
        horizontal: 'right',
        zIndex:0
      }}
      >
      <IconButton size="small" style={{backgroundColor: 'transparent' }} >
        <Badge 
          badgeContent={notificationCount}
          color="warning" 
          overlap="circular" 
          style={{  transform: 'translate(45px, -14px)', zIndex:10,fontWeight:700}}
        > </Badge>

        {notificationCount ?
          <NotificationsActiveIcon style={bellStyle} fontSize="large" />
          :<NotificationsIcon style={bellStyle} fontSize="large" />
        }
      </IconButton>
    </Tooltip>
  )
};
 export default memo(OpenBtn);
