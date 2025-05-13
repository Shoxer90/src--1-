import { memo, useState } from "react";
import { Divider } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from "../Container2/dialogs/ConfirmDialog";
import { datePainter, datePainterClock } from "../modules/modules";
import { readNotificationsPush } from "../services/notifications/notificatonRequests";
import { setNotifications } from "../store/notification/notificationSlice";
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';

const notifCardStyle = {
  display:"flex",
  flexFlow:"row nowrap",
  justifyContent:"space-between",
  padding:"1px 8px",
  cursor:"pointer",
  alignItems:"flex-start"
};

const notifImage = {
  height: "60px",
  width: "60px",
  objectFit: "contain",
  margin:"3px",
};
const notifIcon = {
  margin:"3px",
};
const NotificationItem = ({
  id,
  message,
  setFlag,
  flag,
  title, 
  status,
  createdAt,
  setNotifTrigger,
  notifTrigger
}) => {
  const [openAll,setOpenAll] = useState(false)
  const [isOpen,setIsOpen] = useState(status)
  
  const notifText = {
    flexFlow:"column nowrap",
    fontWeight:  !status ? 700: 400
  };
  
  const handleClick = () => {
    if(!status) {
      readNotificationsPush(id)
      setNotifTrigger(!notifTrigger)
      // setFlag(flag+1)
      // setNotificationCount(notificationCount?  notificationCount- 1 : "")
    }
    setOpenAll(!openAll)
  };

  const closeNotif = () => {
    setIsOpen(true)
    setOpenAll(!openAll)
  }
  return (
    <>
      <div style={notifCardStyle}>
        {/* <div style={notifImage}>
          <img alt={id} src={icon || image || "/default-placeholder.png"} style={{width:"60px"}} />
        </div> */}
        <div style={notifIcon}>
          <MarkChatUnreadIcon fontSize="small" sx={{color:"orange"}} />
        </div>

        <div style={notifText} onClick={handleClick}>
          <div style={{fontSize:"80%",fontWeight:600, color:"#3fb68A"}}>
            <span>{title}</span>
          </div>
          <span style={{fontSize:"70%", fontWeight:isOpen?400:800}}>
            {message?.length < 50  ? message:` ${message.slice(0,45)}.... (more)`}
            </span>
            <div style={{fontSize:"60%", fontWeight:isOpen?400:800,textAlign:"end"}}>{datePainter(createdAt)}, {datePainterClock(createdAt)}</div>
        </div>
        <DeleteIcon 
          onClick={()=> console.log(id)}
          fontSize="medium" 
          sx={{"&:hover":{color:"#3fb68A"}, color:"#FFA500"}} 
        />
      </div>
      <Divider color="black" sx={{m:0.5}} />
      <ConfirmDialog 
        question={message}
        func={closeNotif}
        title={title}
        open={openAll}
        close={closeNotif}
        content={" "}
        nobutton={true}
      />
    </>
  )  
};

export default memo(NotificationItem);
