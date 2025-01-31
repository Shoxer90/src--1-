import React, { memo, useState } from "react";

const ActiveIcon = ({isEhdm, t}) => {

  const [screen,setScreenWidth] = useState(window.innerWidth);

  const styleDiv = {
    background: isEhdm === 0 ? "#3FB68A" : isEhdm === 1? "grey" : "orange",
    minWidth: "90px",
    color:"white",
    borderRadius:"5px",
    fontSize:"80%",
    padding:"0px 7px",
    margin: "2px",
    textAlign:"center"
  }
  window.addEventListener('resize', function(event) {
    setScreenWidth(window.innerWidth)
  }, true);

  return(
    <span style={styleDiv}>
      <span style={{display: screen < 600 ?"none": "inline", }} >
        {/* {isEhdm ? t("settings.hdmstatus1"): t("settings.hdmstatus0")} */}
        { isEhdm === 0 ? t("settings.hdmstatus1") : isEhdm === 1? t("settings.hdmstatus0") : t("settings.hdmstatus2")}
      </span>
    </span>
  )
}
export default memo(ActiveIcon);
