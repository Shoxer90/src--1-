import { useState, useEffect, useRef } from 'react';

import sound from "../modules/sound_notification.wav";
import Notifications from './content/Notifications';
import { useLazyGetNotificationHistoryQuery } from '../store/notification/notificationApi';
import { firebaseConfig} from '../firebase/firebase-config';
import { sendDeviceToken } from '../services/notifications/notificatonRequests';
import { Menu, styled, alpha, Dialog } from '@mui/material';
import OpenBtn from './button/OpenBtn';
import HeaderNotification from './header/HeaderNotification';
// fb
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

import { canUsePush } from '../firebase/helper';
import SnackErr from "../Container2/dialogs/SnackErr";
// 
const notifStyle = {maxHeight: "400px", overflowY: 'auto'};

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
  const [infoDialog, setInfoDialog] = useState({message:"",type:""});
  const [iSClicked, setIsClicked] = useState(false);

  const [anchorEl, setAnchorEl] = useState(false);
  const audioRef = useRef(null);
  const buttonRef = useRef(null);

  const open = Boolean(anchorEl);
  const [flag, setFlag] = useState(0);
  const [choose, setChoose] = useState(false);
  const [notifIdArr, setNotifIdArr] = useState([]);
  const [unreadIds, setUnreadIds] = useState([]);
  
  const [trigger, { data:notif, isFetching, error }] = useLazyGetNotificationHistoryQuery();

  const [notifications, setNotifications] = useState([]); 

  const [initDate, setInitDate] = useState({  
    "endDate": new Date().toISOString(),
    "startDate": getOneMnthEarlr(),
  });
  // FB
  const firebaseApp = initializeApp(firebaseConfig);
  // 
  
  const handleClick = (e) => {
    setAnchorEl(e?.currentTarget);
  };
  
  const playSound = () => {
    if(iSClicked){
      new Audio(sound)?.play()
    }
    setNotifTrigger(!notifTrigger)
    audioRef?.current?.click()
  };


const askNotificationPermission = async () => {
  if (!(await isSupported())) return;

  const permission = Notification.permission;

  if (permission === "granted") {
    const messaging = getMessaging();
    const token = await getToken(messaging, { vapidKey: "<YOUR_VAPID_KEY>" });
    console.log("TOKEN", token);
  } else if (permission === "default") {
    const result = await Notification.requestPermission();
    if (result === "granted") {
      const messaging = getMessaging();
      const token = await getToken(messaging, { vapidKey: "<YOUR_VAPID_KEY>" });
      console.log("TOKEN", token);
    } else {
      console.warn("Notifications denied by user");
    }
  } else {
    console.warn("Notifications permission blocked. Ask user to enable in browser settings.");
  }
};




  if(canUsePush()){
    const messaging = getMessaging(firebaseApp);
    const permission = Notification.permission;
    console.log(permission)
    // if(!localStorage.getItem("dt") && permission === "granted") {
    if(!localStorage.getItem("dt") ) {

      getToken(messaging, { vapidKey: "BL9M8IRH_J6IAHVHod8G0_aVhdQfSDlAJBQ76VIYpnfGeCxtsbMuV3uxrP0ZjLLN0SPWu2CigsToA-2KVW9JI5c"})
      .then((currentToken) => {
        localStorage.setItem("dt", currentToken)
        sendDeviceToken(currentToken)
      })
    }
    // else{
    //    console.warn("Notifications denied by user");
    // }
    onMessage(messaging, (payload) => {
      audioRef.current.click()
      setAnchorEl(buttonRef.current)
    })
  };

  
  useEffect(() => {
    setNotificationCount(user?.notificationsReadCount)
    trigger({
      page:1,
      count:1000,
      "byDate": {
        ...initDate
      }
    })
    setNotifications([])
    setNotifications(notif)
  }, [user,notif, notifTrigger]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'REFRESH_PAGE') {
          audioRef?.current?.click()
          setAnchorEl(buttonRef.current)
        }
      })
    }
  }, []);

  window.addEventListener('click', () => {
    setIsClicked(true)
  });

  return (
    <div>
      <OpenBtn clickFunc={handleClick} notificationCount={notificationCount} buttonRef={buttonRef} open={anchorEl} />        
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
      </StyledMenu>  
      <button style={{display:'none'}}  ref={audioRef} onClick={playSound} ></button>
        {infoDialog?.message &&
          <Dialog open={!!infoDialog?.message} onClose={()=>setInfoDialog({message:"",type:"info"})}>
            <SnackErr type={infoDialog?.type} message={infoDialog?.message}  close={()=>setInfoDialog({message:"",type:"info"})}/>
          </Dialog>
        }
    </div>
  );
};

export default NotificationBell;