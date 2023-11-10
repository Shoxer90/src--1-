import React, { memo, useState } from "react";


const HdmStatus = ({t,status,mode}) => {
    const [screen, setScreenWidth] = useState(window.innerWidth);

    const styling={
        width:screen<600 ? "10px":"auto",
        height:screen<600? "10px" : "20px",
        borderRadius:"4px",
        backgroundColor: (status || mode) ? "green": "orangered",
        fontSize:"75%",
        color:"white",
        border:"none",
        padding: "2px",
        alignText:"center",
        margin:screen<600 ?"auto":"2px"
    }
    window.addEventListener('resize', function(event) {
        setScreenWidth(window.innerWidth)
      }, true);

    return(
       <button style={styling}>
        {screen > 600 ? mode ?  t("history.hdm"): status ? t("settings.switcher") :t("history.receiptNoHmd"): ""}
        </button>
    )
};

export default memo(HdmStatus);
