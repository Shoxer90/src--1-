import React, { memo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendIdForPayStatusChecking } from "../../../../services/cardpayments/internalPayments";
import SnackErr from "../../../dialogs/SnackErr";
import { Dialog } from "@mui/material";
import Loader from "../../../loading/Loader";
import { useTranslation } from "react-i18next";
const CheckStatusArCa = () => {
  const search = useLocation().search;
  const orderId = new URLSearchParams(search).get("OrderId");
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [message,setMessage] = useState();
  const closeSuccessMessage = () => {
    setMessage({message:"", type:""})
    navigate("/setting/club")
  }
  
  useEffect(() => {
    orderId && 
    sendIdForPayStatusChecking(`${orderId}`).then((res) => {
      res === 200 ?  
       setMessage({type:"success", message:t("basket.paymentsuccess")}) :
      setMessage({type:"error", message:t("dialogs.wrong")})
    })
  },[]);

  return (
    <div style={{marginTop: "300px"}}>
      {
        !orderId ?
        <Loader t={t}/>:
        <Dialog open={Boolean(message?.message)}>
          <SnackErr open={message?.message} message={message?.message} type={message?.type} close={closeSuccessMessage}/>
        </Dialog>
      }
      <h5>{t("settings.checkArcaStatus")}</h5>
    </div>
  )
};

export default memo(CheckStatusArCa);
