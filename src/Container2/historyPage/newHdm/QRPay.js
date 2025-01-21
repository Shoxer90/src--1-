import React, { useState } from "react";
import { useEffect } from "react";
import { memo } from "react";

import { QRCodeSVG } from "qrcode.react";


import { Box } from "@mui/system";
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Button, Dialog, DialogContent, Divider } from "@mui/material";

import styles from "./index.module.scss";
import { transferQuery } from "../../../services/pay/pay";

const QRPay = ({
  t,
  openQr, 
  closeQr, 
  value, 
  trsf, 
  deleteBasketGoods, 
  setOpenBasket, 
  loadBasket,
  paymentInfo
}) => {
  const [message,setMessage] = useState();
  
  useEffect(() => {
    let interval = setInterval(() => {
      transferQuery(trsf).then((res) => {
        if(res?.status === 200){
          setMessage(t("basket.paymentsuccess"))
          clearInterval(interval)
          deleteBasketGoods()
        }
      })
  	}, 3000);
    if(openQr === false || message){
      clearInterval(interval)
      loadBasket()
    }
    return  () => {
      setOpenBasket(false)
      clearInterval(interval)
    }
  }, [openQr]);

  return (
    <Dialog
      open={!!openQr}
      sx={{height: "95vh"}}
    >
      {!message ? 
      <DialogContent style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
        <Box style={{display:"flex", flexDirection:"row", justifyContent:"space-between", textAlign:"center"}}>
          <div style={{fontSize:"xlarge",marginTop:"10px"}}>
            <h5>
              {t("basket.scan")} 
            </h5>
          </div>
          <Button onClick={closeQr} style={{margin:0,textTransform: "capitalize"}}>
            <CloseIcon   />
          </Button>
        </Box>
        <Divider sx={{bgcolor:"black"}}/>
        <Divider sx={{mb:2,bgcolor:"black"}}/>
          <div className={styles.qr_qr}>
            <div style={{textAlign:"center"}}>
              <QRCodeSVG value={value} size={250} />
            </div>
            <Divider sx={{mb:2,mt:2,bgcolor:"black"}}/>
            <h6>
             {t("basket.orderPayment")}: {paymentInfo?.cardAmount} {t("units.amd")}
            </h6>
          </div>
      </DialogContent>:
      <Alert onClose={closeQr} severity="info"
       sx={{ width: '100%' }}>
        {message}
      </Alert>
    }
    </Dialog>
  )
};

export default memo(QRPay);
