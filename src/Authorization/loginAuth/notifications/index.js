import { memo, useEffect, useState } from "react";
import { getNews } from "../../../services/auth/auth";
import styles from "../index.module.scss";

const NotificationComponent = ({t}) => {
  const [notificationList, setNotificationList] = useState([]);

  useEffect(() => {
    getNews().then((res) => {

      if(localStorage.getItem("lang") === "en") {
        setNotificationList(res?.engl.split("\n\n"))

      }else if(localStorage.getItem("lang") === "ru") {
        setNotificationList(res?.ru.split("\n\n"))

      }else if(localStorage.getItem("lang") === "am") {
        setNotificationList(res?.arm.split("\n\n"))
      }
    })
  }, [localStorage.getItem("lang")]);

  
    return(
      <div className={styles.notifications}>
        <div style={{height:"2px", backgroundColor:"#3FB68A", margin:"5px 1px"}}></div>
        <div style={{color:"#3FB68A",fontSize:"110%", width:"fit-content", padding:"10px 0px"}}>{t("updates.changes")}</div>
        { notificationList && notificationList.map((item) => <div style={{padding:"10px 0px"}}>{item}</div>)}
     </div> 

    )
};

export default memo(NotificationComponent);
