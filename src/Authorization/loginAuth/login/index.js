import { memo, useEffect, useState } from "react";
import PrivacyForgotLinks from "../PrivacyForgotLinks";
import SocialMediaGroup from "../../../Container2/social";
import LogInFormNew from "../login/LoginForm";
import LangSelect from "../../../Container2/langSelect";
import { useTranslation } from "react-i18next";
import Loader from "../../../Container2/loading/Loader";
import { Dialog } from "@mui/material";

const Login = ({whereIsMyUs,setIsLogIn}) => {
  const {t} = useTranslation();
  const [message, setMessage] = useState();
  const [screenWidth, setScreenWidth] = useState();
  const [loading, setLoading] = useState(false)
  
  window.addEventListener('resize', function(event) {
    setScreenWidth(window.innerWidth)
  }, true);
 
  useEffect(() => {
    setScreenWidth(window.innerWidth)
  }, []);

  return(
    <div>
      <div style={{display:"flex", justifyContent:"space-between",alignItems:"center"}}>
        <span style={{color:"#3FB68A",fontSize:"110%",fontWeight:600, textAlign:"start"}}>Storex On - line</span>
        <LangSelect size={"22px"} />
      </div>
      <LogInFormNew 
        screenWidth={screenWidth} 
        t={t} 
        setMessage={setMessage}
        whereIsMyUs={whereIsMyUs}
        message={message} 
        setIsLogIn={setIsLogIn} 
        setLoading={setLoading}
      />
      <PrivacyForgotLinks />
      <span style={{fontWeight:600,textAlign:"start",width:"80%",padding:"0px 10px"}}>
        <div>
          {t("authorize.infoInLoginPage1")}
        </div>
        <div>
          {t("authorize.infoInLoginPage2")}
          <a href="www.storex.am" style={{color:"#3FB68A"}}>www.storex.am</a> :</div>
      </span>
      <div style={{display:"flex",flexFlow:"column",alignItems:"center"}}>
        <SocialMediaGroup w={170}/>
      </div>
      <p style={{fontWeight:600,textAlign:"start",width:"80%"}}>
          {t("authorize.infoInLoginPage3")}
        </p>
      <span id="apple">
      <img src="/11223.png" alt="" style={{ height:"2dvw"}}/>
      {/* <img src="/11223.png" alt="" style={{ width:"110px"}}/> */}
      </span>
      <span id="storexQR">
        <img src="/storexQr.png" alt="" style={{ width:"80px"}}/>
        {/* <img src="/storexQr.png" alt="" style={{ width:"80px"}}/> */}
      </span>
      <span id="android">
        <img src="/11230.png" alt="" style={{ height:"2dvw"}}/>
        {/* <img src="/11230.png" alt="" style={{ width:"110px"}}/> */}
      </span>
      <Dialog open={loading}>
        <Loader/>
      </Dialog>
    </div>
      
  )
};
export default memo(Login);
