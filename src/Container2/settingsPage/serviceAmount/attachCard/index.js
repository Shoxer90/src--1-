import React, { memo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SnackErr from "../../../dialogs/SnackErr";
import { Dialog } from "@mui/material";
import Loader from "../../../loading/Loader";
import { useTranslation } from "react-i18next";

const CheckStatusArCa = ({logOutFunc}) => {
  
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [message,setMessage] = useState();
  
  const search = useLocation().search;
  const queryParams = new URLSearchParams(search)
  const statusCall = queryParams.get("status");
  
  const removeURLPart = () => {
    queryParams.delete("status")
  }
  
  useEffect(() =>{
    statusCall && getResponse(statusCall) && removeURLPart()
  },[statusCall]);

  const closeSuccessMessage = () => {
    setMessage({message:"", type:""})
    navigate("/setting/services")
  };

    const getResponse = (statusCall) => {
    if(statusCall === "1") {
      // VJARVAC E
      return setMessage({type:"success", message:t("dialogs.checkCardStatus200")})
    }else if(statusCall === "2") {
      return setMessage({type:"error", message:t("dialogs.checkCardStatus410")}) 
    }else if(statusCall === "4") {
      return setMessage({type:"error", message:t("dialogs.checkCardStatus400")}) 
    }else if(statusCall === "3") {
      return setMessage({type:"error", message:t("dialogs.checkCardStatus412")}) 
    }else if(statusCall === "5") {
      // kCVAC E
      return setMessage({type:"success", message:t("dialogs.checkCardStatus201")}) 
    }else if(statusCall === 401) {
      logOutFunc()
    }else {
      return setMessage({type:"error", message:t("dialogs.checkCardStatus400")})
    }
  };

  return (
    <div style={{marginTop: "300px"}}>
      {!statusCall ?
        <Loader t={t}/> :
        <Dialog open={Boolean(message?.message)}>
          <SnackErr 
            open={message?.message} 
            message={message?.message} 
            type={message?.type} 
            close={closeSuccessMessage}
          />
        </Dialog>
      }
      <h5>{t("settings.checkArcaStatus")}</h5>
    </div>
  )
};

export default memo(CheckStatusArCa);
