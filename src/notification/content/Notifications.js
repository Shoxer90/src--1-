import { memo, useEffect, useState } from "react";
import NotificationItem from "./NotificationItem";
import { datePainter } from "../../modules/modules";

import styles from "../index.module.scss";

const Notifications = ({
  notificationCount,
  setNotificationCount,
  setNotifTrigger,
  notifTrigger,
  dateTime,
  list,
  setNotifIdArr,
  notifIdArr,
  choose,
  setChoose,
  logOutFunc
}) => {
 const [newDayList, setNewDayList] = useState([]);

  useEffect(() => {
    setNewDayList(list)
  }, [list])
  
  return (
    <div>
      <div className={styles.notifications_mainDate}>
        {datePainter(dateTime)}
      </div>
      {newDayList ? newDayList?.map((notification) => (
        <NotificationItem 
          key={notification?.id}
          notificationCount={notificationCount}
          setNotificationCount={setNotificationCount}
          setNotifTrigger={setNotifTrigger}
          notifTrigger={notifTrigger}
          {...notification}
          setNotifIdArr={setNotifIdArr}
          notifIdArr={notifIdArr}
          setChoose={setChoose}
          choose={choose}
          logOutFunc={logOutFunc}
        />
      )) :<span style={{color:"lightGrey", fontWeight:600,margin:"20px"}}>No data</span>}
    </div>
  )
};

export default memo(Notifications);
