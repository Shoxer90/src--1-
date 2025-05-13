import React, { useState, useEffect, useRef } from 'react';

import sound from "../modules/sound_notification.wav";
import Notifications from './content/Notifications';
import { useLazyGetNotificationHistoryQuery, useRemoveNotificationListMutation } from '../store/notification/notificationApi';
import { onMessage } from 'firebase/messaging';
import { generateToken, messaging } from '../firebase/firebase-config';
import { sendDeviceToken } from '../services/notifications/notificatonRequests';
import { Menu, styled, alpha } from '@mui/material';
import OpenBtn from './button/OpenBtn';
import HeaderNotification from './header/HeaderNotification';

const PER_PAGE = 8;

const notifStyle = {
  maxHeight: "400px",       
  overflowY: 'auto'
};

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchororigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(2),
    minWidth: 320,
    overflowY:"hidden",
    color:
    theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '0px',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 4,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(20),
      },
      '&:active': {
        position: "none",
        backgroundColor: alpha(
        theme.palette.primary.main,
        theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

const getOneMnthEarlr = () => {
  let currentDate = new Date();
  let previousDate = new Date(currentDate)
  previousDate.setMonth(currentDate.getMonth()-1)
  return previousDate.toISOString()
}

const NotificationBell = ({
  user,
  setNotifTrigger,
  notifTrigger,
  logOutFunc
}) => {

  const [notificationCount, setNotificationCount] = useState(0);

  const [anchorEl, setAnchorEl] = useState(false);
  const audioRef = useRef(null);
  const buttonRef = useRef(null);

  const open = Boolean(anchorEl);
  const [page, setPage] = useState(1);
  const [flag, setFlag] = useState(0);
  const [choose, setChoose] = useState(false);
  const [notifIdArr, setNotifIdArr] = useState([]);
  const [unreadIds, setUnreadIds] = useState([]);
  
  const [trigger, { data:notif, isFetching, error }] = useLazyGetNotificationHistoryQuery();
  const [removeNotifList, result] = useRemoveNotificationListMutation();

  const [notifications, setNotifications] = useState([]); 

  const [initDate, setInitDate] = useState({  
    "endDate": new Date().toISOString(),
    "startDate": getOneMnthEarlr(),
  })

  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.addEventListener('message', (event) => {
  //     if (event.data?.type === 'REFRESH_PAGE') {
  //       console.log('🔄 Страница будет обновлена из-за push-сообщения:', event.data.payload);
  //       setNotifTrigger(!notifTrigger)
  //       audioRef.current.click()
  //       window.location.reload();
  //     }
  //   });
  // };


  const playSound = () => {
    new Audio(sound)?.play()
    setNotifTrigger(!notifTrigger)
  };
      
  const handleClick = (e) => {
    setAnchorEl(e?.currentTarget);
  };

  const getDeviceTokenForNotifs = async() => {
    const appToken = await generateToken();
    sendDeviceToken(appToken)
  };
  
  onMessage(messaging, (payload) => {
    console.log(payload,"payload in bell")
    audioRef.current.click()
    setNotifTrigger(!notifTrigger)
    setAnchorEl(buttonRef.current)
  });

  useEffect(() => {
    setNotificationCount(user?.notificationsReadCount)
    trigger({
      page:page,
      count:1000,
      "byDate": {
        ...initDate
      }
    })
    setNotifications([])

    setNotifications(notif)
  }, [user,notif, notifTrigger]);

  useEffect(() => {
    getDeviceTokenForNotifs()
  }, []); 
  

  return (
    <div>
      <button onClick={generateToken} style={{display:"none"}}></button>
      <OpenBtn clickFunc={(handleClick)} notificationCount={notificationCount} buttonRef={buttonRef} open={anchorEl} />        
      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(false)}
        style={{minWidth:"500px", padding:"0px 10px"}}
      >
        <div>
          <HeaderNotification  
            initDate={initDate} 
            setInitDate={setInitDate} 
            changeFunction={setNotifTrigger}
            setChoose={setChoose}
            choose={choose}
            notifIdArr={notifIdArr} 
            setNotifIdArr={setNotifIdArr}
            setUnreadIds={setUnreadIds}
            unreadIds={unreadIds}
            setNotifTrigger={setNotifTrigger}
            notifTrigger={notifTrigger}
            notifications={notifications}
            setNotifications={setNotifications}
          />
          <div style={notifStyle}>

            { notifications ? notifications.map((notsByDay) => (
              <Notifications
                key={notsByDay?.dateTime} 
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
                setNotifTrigger={setNotifTrigger}
                notifTrigger={notifTrigger}
                setFlag={setFlag}
                flag={flag}
                {...notsByDay}
                logOutFunc={logOutFunc}

                setNotifIdArr={setNotifIdArr}
                notifIdArr={notifIdArr}
                choose={choose}
                setChoose={setChoose}

              />
            )) :<span style={{color:"lightGrey", fontWeight:600 ,margin:"20px"}}>you have not notificationd</span>}
          </div>

        </div>

        {/* <Pagination 
          count={Math.ceil(count/PER_PAGE)} 
          color="primary"
          page={page} 
          onChange={changePage} 
          size="small"
          sx={{alignItems:"center"}}
        /> */}
      </StyledMenu>  
      <button style={{display:'none'}}  ref={audioRef} onClick={playSound} ></button>
    </div>
  );
};

export default NotificationBell;