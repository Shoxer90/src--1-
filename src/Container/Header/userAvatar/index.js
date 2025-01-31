import React from "react";
import { memo } from "react";

import styles from "../index.module.scss";
import { useNavigate } from "react-router-dom";
import ActiveIcon from "../../../Container2/activehdm/ActiveIcon";
import { useState } from "react";
import { StyledBadgeGreen, StyledBadgeGrey, StyledBadgeOrange } from "../../../modules/AvatarDot";
import { useTranslation } from "react-i18next";


const UserInfo = ({ user,logo,mode,setActiveBtn,limitedUsing}) => {

  const {t} = useTranslation()
  const navigate = useNavigate();
  const [screen, setScreenWidth] = useState(window.innerWidth);

  window.addEventListener('resize', function(event) {
    setScreenWidth(window.innerWidth)
  }, true);
  return(
    <div 
      className={styles.headerLogo_username} 
        onClick={()=>{
          setActiveBtn("")

        // return  navigate("/setting/user")
        return  !limitedUsing ? navigate("/setting/user"):null
      }} 
    > 
      {screen < 785 ?
        <>
          {mode === 0 &&
            <StyledBadgeGreen
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <img 
                src={logo ? logo:"/defaultAvatar.png"}
                className={styles.avatarImg} 
                style={{border:"solid #3FB68A 1px"}} 
                alt=""
              />
            </StyledBadgeGreen> }
            {mode === 1 && <StyledBadgeGrey
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <img src={logo? logo:"/defaultAvatar.png"} className={styles.avatarImg} style={{border:"solid grey 1px"}} alt="" />
            </StyledBadgeGrey>
          }
           {mode === 2 &&
            <StyledBadgeOrange
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <img src={logo? logo:"/defaultAvatar.png"} className={styles.avatarImg} style={{border:"solid grey 1px"}} alt="" />
            </StyledBadgeOrange>
           
           }
        <span style={{alignSelf:"center",margin:"2px"}} className={styles.routeName}> {user} </span>
        </>:
        <>
          <img src={logo? logo:"/defaultAvatar.png"} style={{border:mode ===0 ?"solid #3FB68A 1px" :mode === 1 ?"solid grey 1px": "solid orange 1px"}} className={styles.avatarImg} alt="" />
          <div style={{display:"flex",flexDirection:"column"}}>
            <span style={{alignSelf:"center",margin:"2px"}}>{user} </span>
            <ActiveIcon isEhdm={mode} t={t}/>
          </div>
        </>
      }
    </div>
   
  ) 
};

export default  memo(UserInfo); 