import React, { memo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendIdForPayStatusChecking } from "../../../../services/cardpayments/internalPayments";
import SnackErr from "../../../dialogs/SnackErr";
import { Dialog } from "@mui/material";
import Loader from "../../../loading/Loader";
import { useTranslation } from "react-i18next";

const CheckStatusArCa = () => {
  const search = useLocation().search;
  const orderId = new URLSearchParams(search).get("orderId");
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [message,setMessage] = useState();
  const [load, setLoad] = useState();

  const closeSuccessMessage = () => {
    setMessage({message:"", type:""})
    navigate("/setting/services")
  };

  const openCheckStatusPage = () => {
    setLoad(true)
    orderId && orderId !== null && sendIdForPayStatusChecking(`${orderId}`).then((res) => {
      setLoad(false)
      if(res === 200) {
        return setMessage({type:"success", message:t("dialogs.checkCardStatus200")}) 
      }else if(res === 410) {
        return setMessage({type:"error", message:t("dialogs.checkCardStatus410")}) 
      }else if(res === 411) {
        return setMessage({type:"error", message:t("dialogs.checkCardStatus411")}) 
      }else if(res === 412) {
        return setMessage({type:"error", message:t("dialogs.checkCardStatus412")}) 
      }else {
        return setMessage({type:"error", message:t("dialogs.checkCardStatus400")})
      }
    })
  };

  useEffect(() => {
    openCheckStatusPage()
  },[]); 

  return (
    <div style={{marginTop: "300px"}}>
      {!orderId ?
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
