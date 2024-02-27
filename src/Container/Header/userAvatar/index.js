import React from "react";
import { memo } from "react";

import styles from "../index.module.scss";
import { useNavigate } from "react-router-dom";
import ActiveIcon from "../../../Container2/activehdm/ActiveIcon";
import { useState } from "react";
import { StyledBadgeGreen, StyledBadgeGrey } from "../../../modules/AvatarDot";


const UserInfo = ({ user,logo,active, limitedUsing,t}) => {

  const navigate = useNavigate();
  const [screen, setScreenWidth] = useState(window.innerWidth);

  window.addEventListener('resize', function(event) {
    setScreenWidth(window.innerWidth)
  }, true);
  return(
    <div 
      className={styles.headerLogo_username} 
        onClick={()=>{
        return  !limitedUsing ? navigate("/setting/services"):null
      }} 
    > 
      {screen < 785 ?
        <>
          {active ?
            <StyledBadgeGreen
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <img 
                src={logo ? logo:"/defaultAvatar.png"}
                className={styles.avatarImg} 
                style={{border:"solid green 1px"}} 
                alt=""
              />
            </StyledBadgeGreen> :
            <StyledBadgeGrey
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <img src={logo? logo:"/defaultAvatar.png"} className={styles.avatarImg} style={{border:"solid grey 1px"}} alt="" />
            </StyledBadgeGrey>
          }
        <span style={{alignSelf:"center",margin:"2px"}} className={styles.routeName}> {user} </span>
        </>:
        <>
          <img src={logo? logo:"/defaultAvatar.png"} style={{border:active ?"solid green 1px" :"solid grey 1px"}} className={styles.avatarImg} alt="" />
          <div style={{display:"flex",flexDirection:"column"}}>
            <span style={{alignSelf:"center",margin:"2px"}}>{user} </span>
            <ActiveIcon isEhdm={active} t={t}/>
          </div>
        </>
      }
    </div>
  ) 
};

export default  memo(UserInfo); 