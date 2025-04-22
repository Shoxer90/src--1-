import React, { useState, useEffect, useRef } from 'react';
import Badge from '@mui/material/Badge';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsIcon from '@mui/icons-material/Notifications';
import sound from "../modules/sound_notification.wav";
import Notifications from './Notifications';
import { useGetNotificationHistoryQuery, useLazyGetNotificationHistoryQuery } from '../store/notification/notificationApi';
import { onMessage } from 'firebase/messaging';
import { generateToken, messaging } from '../firebase/firebase-config';
import { sendDeviceToken } from '../services/notifications/notificatonRequests';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { IconButton, Tooltip } from '@mui/material';

const PER_PAGE = 8;

const NotificationBell = ({
  user,
  setNotifTrigger,
  notifTrigger
}) => {

  const [notificationCount, setNotificationCount] = useState(0);
  
  const bellStyle = {
    position:"relative",
    top:"5px",
    left:"5px",
    color:!notificationCount?"darkgrey":"#3FB68A" ,
    cursor:"pointer",
    margin:"5px",
  };
  const [anchorEl, setAnchorEl] = useState(false);
  const audioRef = useRef(null)
  const open = Boolean(anchorEl);
  const [page, setPage] = useState(1);
  const [flag, setFlag] = useState(0);
  const [trigger, { data:notif, isFetching, error }] = useLazyGetNotificationHistoryQuery();

  const [notifications, setNotifications] = useState(); 

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'REFRESH_PAGE') {
        console.log('🔄 Страница будет обновлена из-за push-сообщения:', event.data.payload);
        setNotifTrigger(!notifTrigger)
        audioRef.current.click()
        window.location.reload();
      }
    });
  };

  const play = () => {
    new Audio(sound).play()
    setNotifTrigger(!notifTrigger)
  };
      
  const handleClick = (e) => {
    setAnchorEl(e?.currentTarget);
  };

  const changePage = (event, value) => {
    setPage(value)
  };

  const getDeviceTokenForNotifs = async() => {
    const appToken = await generateToken();
    sendDeviceToken(appToken)
  };
  
  onMessage(messaging, (payload) => {
    audioRef.current.click()
    // setNotifications([
    //   {
    //     "id": Math.random,
    //     "title": payload?.notification?.title,
    //     "message": payload?.notification?.body,
    //     "status": false,
    //     "isImportant": false,
    //     "createdAt": new Date(),
    //     "readDate": new Date()
    //   },
    //   ...notif
    // ])
    console.log(payload)
  });


console.log(notif,"notf")
console.log(notifications,"notifications");

  useEffect(() => {
    setNotificationCount(user?.notificationsReadCount)
    trigger({
      page:page,
      // count: PER_PAGE,
      count:1000,
      "byDate": {
        "startDate": "2025-04-12T10:49:12.938Z",
        "endDate": "2025-04-22T10:49:12.938Z"
      }
    })
    setNotifications(notif)
  }, [user,notif, notifications, notifTrigger]);

  useEffect(() => {
    getDeviceTokenForNotifs()
  }, []); 

    return (
    <>
    <Tooltip
      onClick={handleClick} 
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      >
      <IconButton size="large" style={{backgroundColor: 'transparent' }} >
        <Badge 
          
          badgeContent={notificationCount}
          color="warning" 
          overlap="circular" 
          style={{  transform: 'translate(45px, -14px)', zIndex:10,fontWeight:700}}
        >        </Badge>
        {notificationCount ?
          <NotificationsActiveIcon style={bellStyle} fontSize="large" />
          :<NotificationsIcon style={bellStyle} fontSize="large" />
        }
      </IconButton>
    </Tooltip>
         
          <button style={{display:'none'}}  ref={audioRef} onClick={play} ></button>
    {notifications && <Notifications 
      anchorEl={anchorEl} 
      setAnchorEl={setAnchorEl}
      open={open}
      // notifications={notif} 
      notifications={notifications[0].list} 
      notificationCount={notificationCount}
      setNotificationCount={setNotificationCount}
      PER_PAGE={PER_PAGE}
      changePage={changePage}
      page={page}
      setFlag={setFlag}
      flag={flag}
      setNotifTrigger={setNotifTrigger}
      notifTrigger={notifTrigger}
      date={notifications[0].dateTime}
    />}

  </>
  );
};

export default NotificationBell;