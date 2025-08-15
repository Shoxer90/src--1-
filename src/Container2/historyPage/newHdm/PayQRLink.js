import { Box, Button, Dialog, DialogContent, Divider } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { QRCodeSVG } from "qrcode.react";
import React, { useState } from "react";
import { memo } from "react";
import { useEffect } from "react";



const PayQRLink = ({
  cardAmount,
  t,
  qrData,
  closeLinkQrAndRefresh,
  seeBtn

}) => {
  const [isBtn, setIsBtn] = useState(false)

  const isIOSSafari = () => {
    const ua = navigator.userAgent;
    return /iPad|iPhone|iPod/.test(ua) && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  };

  useEffect(() => {
    const isIOS =  isIOSSafari()
    if(!isIOS) {
      qrData && navigator.clipboard.writeText(qrData)
    }else{
      setIsBtn(true)
    }
  }, []);

  return(
    <Dialog
      sx={{ height: '98vh'}}
      open={Boolean(qrData)}
    >
      <DialogContent style={{display:"flex",flexDirection: "column", justifyContent: "center"}}>
        <Box style={{display:"flex", flexDirection:"row", justifyContent: "space-between", textAlign:"center"}}>
          <div style={{fontSize:"xlarge",marginTop:"10px"}}>
            <h5>
              {t("basket.qrlink")} 
            </h5>
          </div>
          <Button onClick={closeLinkQrAndRefresh} style={{margin:0,textTransform: "capitalize"}}>
            <CloseIcon />
          </Button>
        </Box>
        <Divider sx={{bgcolor:"black"}}/>
        <Divider sx={{mb:2, bgcolor:"black"}}/>
      <div style={{display:"flex",justifyContent:"center"}}>
        <QRCodeSVG value={qrData} size={250}/>
      </div>
      { seeBtn && !isBtn &&
      <Button
        variant="disable"
        sx={{margin:3, color:"green",textTransform: "capitalize"}}
      >
       {t("dialogs.linkcopy")}
      </Button>
      } 
      {isBtn &&  <Button
        variant="contained"
        onClick={()=>navigator.clipboard.writeText(qrData)}
        sx={{margin:3, background:"#3FB68A",textTransform: "capitalize"}}
      >
       {t("dialogs.linkcopyIOS")}
      </Button>}
      <p style={{justifyContent:"center",marginTop:"10px"}}>
        {t("basket.orderPayment")}: {cardAmount} {t("units.amd")}
      </p>
      <Divider sx={{bgcolor:"black"}}/>
      <Divider sx={{bgcolor:"black"}}/>
      <Button
        onClick={closeLinkQrAndRefresh}
        sx={{textTransform: "capitalize"}}
      >
        {t("buttons.close")}
      </Button>
      </DialogContent>
    </Dialog>
  )
};

 export default memo(PayQRLink);
