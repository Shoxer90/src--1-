import React, { memo } from "react";

import SocialFrame from "./SocialFrame";
import SocialItem from "./SocialItem";

import styles from "./index.module.scss";

const SocialMediaGroup = ({w}) => {
  const social = [
    {
      name:"facebook",
      link:"https://www.facebook.com/profile.php?id=100094019746193&mibextid=LQQJ4d",
      icon: <i class="fab fa-facebook " style={{color:"white"}}></i>,
      backgr:"#3B5998",
    },{
      name:"linkedIn",
      link:"https://www.linkedin.com/company/payx-payment-express/",
      icon: <i class="fab fa-linkedin " style={{color:"white"}}></i>,
      backgr:"#0077B5",
    },{
      name:"instagram",
      link:"https://www.instagram.com/storex.am/",
      icon: <i class="fab fa-instagram " style={{color:"white"}}></i>,
      backgr:"rgba(244, 21, 59, 0.849)",
      backgr:"darkviolet",
    },{
      name:"youtube",
      link:"https://www.youtube.com/channel/UCKMJNfgHvLIsU4NrbZ1l1Ow",
      icon: <i class="fab fa-youtube " style={{color:"white"}}></i>,
      backgr:"red",
    }
  ];

  return (
    <div className={styles.socialContainer} style={{width:`${w}px`}}>
      {social && social.map((item,i) => (
        <SocialItem 
          key={i}
          children={
            <SocialFrame 
              children={item?.icon} 
              color={item?.backgr} 
              w={w}
            />
          } 
          url={item?.link} 
        />
      ))}
    </div>
  )
};

export default memo(SocialMediaGroup);
