import { memo, useEffect, useState } from "react";
import PrivacyForgotLinks from "../PrivacyForgotLinks";
import SocialMediaGroup from "../../../Container2/social";
import LogInFormNew from "../login/LoginForm";
import LangSelect from "../../../Container2/langSelect";
import { useTranslation } from "react-i18next";

const Login = ({whereIsMyUs,setIsLogIn}) => {
  const {t} = useTranslation();
  const [message, setMessage] = useState();
  const [screenWidth, setScreenWidth] = useState();


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
          />
          <PrivacyForgotLinks />
          <span style={{fontWeight:600,textAlign:"start",width:"80%",padding:"0px 10px"}}>
            <div>Storex on-line առևտրային ծրագիրը նախատեսված է առևտուրը պարզ և հեշտ կատարելու համար:</div>
            <div>Մանրամասն տեղեկությունների համար այցելեք <a href="www.storex.am" style={{color:"#3FB68A"}}>www.storex.am</a> :</div>
          </span>
          <div style={{display:"flex",flexFlow:"column",alignItems:"center"}}>
            <SocialMediaGroup w={170}/>
          </div>
          <p style={{fontWeight:600,textAlign:"start",width:"80%"}}>Ներբեռնեք նաև StoreX հավելվածը՝ առևտուրը հեռախոսի միջոցով կազմակերպելու համար։</p>
          <span id="apple">
          <img src="/11223.png" alt="" style={{ width:"110px"}}/>
          </span>
          <span id="storexQR">
            <img src="/storexQr.png" alt="" style={{ width:"80px"}}/>
          </span>
          <span id="android">
            <img src="/11230.png" alt="" style={{ width:"110px"}}/>
          </span>
    </div>
      
  )
};
export default memo(Login);