import { memo } from "react";
import Logo from "../../Container/Header/Logo";
import Footer from "./footer/Footer";
import NotificationComponent from "../loginAuth/notifications";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";

const LoginAuthContainer =({children}) => {
const {t} = useTranslation();

  return (
    <div style={{position:"relative"}}>
      <div style={{display:"flex",justifyContent:"space-between",flexFlow:"column", color:"#3FB68A", padding:"0px 10px"}}>
        <Logo />
        <div className={styles.regContent}>
          <div className={styles.regContent_content} > 
            <div style={{height:"2px", backgroundColor:"#3FB68A", margin:"5px 1px"}}></div>
            {children}
          </div>
          <NotificationComponent t={t} />
        </div>
        <Footer color="#3FB68A" />
      </div>
    </div>
  )
};

export default memo(LoginAuthContainer);
