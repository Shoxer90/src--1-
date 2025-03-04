import { memo, useEffect, useState } from "react";
import { getNews } from "../../../services/auth/auth";
import styles from "../index.module.scss";
import { useTranslation } from "react-i18next";

const NotificationComponent = () => {
  const {t} = useTranslation();
  
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    if(localStorage.getItem("lang")=== "hy" ||
      localStorage.getItem("lang")=== "ru" ||
      localStorage.getItem("lang")=== "eng" 
    ){getNews(localStorage.getItem("lang")).then((res) => {
      setNotification(res?.news)
    })}else{
      getNews().then((res) => {
      setNotification(res?.news)
    })}
  }, [localStorage.getItem("lang")]);
  
  return(
    <div className={styles.notifications}>
      <div style={{height:"2px", backgroundColor:"#3FB68A", margin:"5px 1px"}}></div>
      <div style={{color:"#3FB68A",fontSize:"110%", width:"fit-content", padding:"10px 0px"}}>
        {t("updates.changes")}
      </div>
      { notification && notification.map((item, index) => 
        <div key={index} style={{padding:"10px 0px"}}>
          {item}
        </div>
      )}
    </div> 
  )
};

export default memo(NotificationComponent);
