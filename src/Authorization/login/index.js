import React, {useState, memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogInForm from './form/LogInForm';
import styles from "../index.module.scss"
import { Divider } from '@mui/material';
import SocialMediaGroup from "../../Container2/social/index"

const LogIn = ({t,setIsLogIn,whereIsMyUs}) => {
  const [message, setMessage] = useState();
  const [screenWidth, setScreenWidth] = useState();
  const navigate = useNavigate();

  window.addEventListener('resize', function(event) {
    setScreenWidth(window.innerWidth)
  }, true);
 
  useEffect(() => {
    setScreenWidth(window.innerWidth)
  }, []);

  return (
    <div>
      <LogInForm
        screenWidth={screenWidth}
        message={message}
        setMessage={setMessage}
        t={t}
        setIsLogIn={setIsLogIn}
        whereIsMyUs={whereIsMyUs}
      />
       <span >
        <span className={styles.auth_container_signIn_link} >
          <strong onClick={()=>navigate("/registration")}>
            {t("authorize.create")}
          </strong> 
        </span>
        <div style={{fontSize:"80%", color:"green",margin:"2px"}}>
          <a href="/privacy_policy">{t("intro.privacyPolicy")}</a>
      </div >
      
        <span className={styles.auth_container_signIn_link} onClick={() => navigate("/forgot-password")}>
          {t("authorize.forgot")}
        </span> 
        <div style={{display:"flex",flexFlow:"column",alignItems:"center",margin:"15px"}}>
          <span style={{fontSize:"80%",fontWeight:"700",color:"rgb(17, 46, 17)"}}>{t("settings.phone")} : +(374)55 522 225</span>
          <span style={{fontSize:"80%",fontWeight:"700",color:"rgb(17, 46, 17)"}}>{t("settings.email")} info@payx.am</span>
          <span style={{fontSize:"80%",fontWeight:"700",color:"rgb(17, 46, 17)"}}>{t("settings.adressText")}</span>
          <Divider sx={{m:1,backgroundColor:"gray"}} color="black" />
          <span >
            <SocialMediaGroup w={170}/>
          </span>
            <div style={{fontSize:"80%", color:"green",margin:"2px"}}>
              {t("intro.visitLink")} <a href="https://storex.am">storex.am</a>
            </div >
        </div>
      </span>

    </div>
  )
}

export default memo(LogIn);
