import { memo } from "react";
import { Menu, styled, alpha, Pagination } from '@mui/material';
import NotificationItem from "./NotificationItem";
import { useSelector } from "react-redux";


const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(2),
    minWidth: 280,
    color:
    theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
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

const Notifications = ({
  anchorEl, 
  setAnchorEl,
  open,
  notifications,
  notificationCount,
  setNotificationCount,
  PER_PAGE,
  changePage, 
  page,
  setFlag,
  flag,
  setNotifTrigger,
  notifTrigger,
  date
}) => {
  const count = useSelector(state=> state?.notification?.count);
 
  return(
    <StyledMenu
      anchorEl={anchorEl}
      open={open}
      onClose={() => setAnchorEl(false)}
      style={{width:"320px", padding:"5px"}}
    >
      <div>
        date {date} 
        {/* date {date?.startDate} - {date?.endDate}  */}
      </div>
      <div>
        {notifications && notifications?.map((notification) => (
         <NotificationItem 
            key={notification?.id}
            {...notification}
            notificationCount={notificationCount}
            setNotificationCount={setNotificationCount}
            setFlag={setFlag}
            flag={flag}
            setNotifTrigger={setNotifTrigger}
            notifTrigger={notifTrigger}
          />
        ))}
      </div>
      <Pagination 
        count={Math.ceil(count/PER_PAGE)} 
        color="primary"
        page={page} 
        onChange={changePage} 
        size="small"
        sx={{alignItems:"center"}}
      />
    </StyledMenu>
  )
};

  export default memo(Notifications);

  