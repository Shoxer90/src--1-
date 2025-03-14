import React, { useState, useEffect } from 'react';
import Badge from '@mui/material/Badge';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsIcon from '@mui/icons-material/Notifications';
import sound from "../modules/sound_notification.wav";
import BellMenu from './BellMenu';

const bellStyle={
  position:"relative",
  top:"5px",
  left:"5px",
  color:"darkgrey",
  cursor:"pointer",
};

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [notificationCount, setNotificationCount] = useState(9);
  const [isNotClicked, setIsNotClicked] = useState(true);

  const play = () => {
    new Audio(sound).play()
  };
      
  const handleClick = (e) => {
    setAnchorEl(e?.currentTarget);
    setNotificationCount(0); 
  };
  
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setIsNotClicked(true)
  //       setNotificationCount(prevCount => Math.floor(Math.random() * 5));
  //   }, 3000);
  //   return () => clearInterval(interval); 
  // }, []);

  // useEffect(() => {
  //   notificationCount && play()
  // }, [notificationCount]);

    return (
    <>
      <Badge 
        onClick={handleClick} 
        badgeContent={notificationCount} 
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiBadge-dot': {
            position: 'absolute',
            transform: 'translate(-50%, -20%)'
          },
          '& .MuiBadge-badge': {
              minWidth: '20px', 
              height: '20px',    
              borderRadius: '10px',
              display: 'flex',    
              justifyContent: 'center',
              alignItems: 'center', 
              textAlign: 'center',
          },
        }}
        color="error" 
        invisible={notificationCount === 0}
      >
      {notificationCount ?
        <NotificationsActiveIcon style={bellStyle} fontSize="large" />
        :<NotificationsIcon style={bellStyle} fontSize="large" />
      }
    </Badge>
    <BellMenu 
      anchorEl={anchorEl} 
      setAnchorEl={setAnchorEl}
      isNotClicked={isNotClicked}
      setIsNotClicked={setIsNotClicked}
    />
  </>
  );
};

export default NotificationBell;