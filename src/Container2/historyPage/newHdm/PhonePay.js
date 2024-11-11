import { Button, Dialog, DialogContent, Divider, InputAdornment, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { memo } from "react";
import styles from "./index.module.scss";
import CloseIcon from '@mui/icons-material/Close';
import { Box } from "@mui/system";
import MobileScreenShareIcon from '@mui/icons-material/MobileScreenShare';
import { useState } from "react";
import SnackErr from "../../dialogs/SnackErr";
import { sendSmsForPay } from "../../../services/pay/pay";

const PhonePay = ({
  t,
  openPhonePay,
  paymentInfo,
  setPaymentInfo,
  closePhoneDialog,
  price,
  setLoader,
  responseTreatment,
  deleteBasketGoods,
  loadBasket,
  logOutFunc,
  multiSaleProducts
}) => {
  const [response,setResponse] = useState({message:"",status:""});
  const [isSent,setIsSent] = useState(false);

  const sendSms = async() => {
    setIsSent(true)
    if(!paymentInfo?.phone ||`${paymentInfo?.phone}`?.length !== 8){
      setResponse({
        message: t("authorize.errors.wrongnumber"),
        status: "error"
      })
      return
    }
    multiSaleProducts(3)
    // await sendSmsForPay({
    //   ...paymentInfo,
    //   phone: `+374${paymentInfo.phone}`
    // }).then((res) => {
    //   if(res?.status === 203) {
    //     setResponse({
    //       message: t("authorize.errors.bank_agreement"),
    //       status: "error"
    //     })
    //   }else{
        
    //     closePhoneDialog()
    //     responseTreatment(res, 3)
    //   }
    // })
  };
  
  const handleChangeInput = (e) => {
    setIsSent(false)
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value
    })
  };

  return (
    <>
    <Dialog
      open={!!openPhonePay}
      maxWidth="sm"
    >
      <DialogContent style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
        <Box style={{display:"flex", justifyContent:"space-between"}}>
          <h4>{t("basket.sms")}</h4>
          <Button onClick={closePhoneDialog}>
            <CloseIcon />
          </Button>
        </Box>
        <Divider sx={{color:"darkgray"}}/>
        <Divider sx={{m:1,color:"darkgray"}}/>
        <div className={styles.phone_pay_content}>
          <div>{t("basket.totalndiscount")} {price} {t("units.amd")}</div>
          <Box>
            <MobileScreenShareIcon fontSize="large" sx={{ color: 'action.active', m:1}}/>
            <TextField
              autoComplete="off"
              type="number"
              label={t("authorize.phone")}
              placeholder="91123456"
              name="phone"
              value={paymentInfo?.phone}
              InputProps={{
                startAdornment: <InputAdornment position="start">374</InputAdornment>,
              }}
              onChange={(e)=>handleChangeInput(e)}
              sx={{ "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
              "input[type=number]": {
                MozAppearance: "textfield",
              },}}
              style={{paddingBottom: "15px",fontSize:"medium"}}
              variant="standard"
            />
          </Box>
        </div>
        <Button
          variant="contained"
          style={{background:"FFA500"}}
          onClick={sendSms}
          disabled={isSent}
        >
          {t("buttons.send")}
        </Button>
      </DialogContent>

      <Dialog open={Boolean(response?.message)}>
        <SnackErr type={response?.status} message={response?.message} close={() => setResponse({message:"", status:""})} />
      </Dialog>

    </Dialog>

   
   </>
  )
};

export default memo(PhonePay);