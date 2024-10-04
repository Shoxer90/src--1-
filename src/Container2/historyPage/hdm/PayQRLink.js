import { Box, Button, Dialog, DialogContent, Divider } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { QRCodeSVG } from "qrcode.react";
import React from "react";
import { memo } from "react";
import { useEffect } from "react";

const PayQRLink = ({
  cardAmount,
  t,
  totalPrice,
  qrData,
  closeLinkQrAndRefresh,
  seeBtn

}) => {

  useEffect(() => {
    qrData && navigator.clipboard.writeText(qrData)
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
          <Button onClick={closeLinkQrAndRefresh} style={{margin:0}}>
            <CloseIcon />
          </Button>
        </Box>
        <Divider sx={{bgcolor:"black"}}/>
        <Divider sx={{mb:2, bgcolor:"black"}}/>
      <div style={{display:"flex",justifyContent:"center"}}>
        <QRCodeSVG value={qrData} size={250}/>
      </div>
      { seeBtn &&
      <Button
        variant="disable"
        sx={{margin:3, color:"green"}}
      >
       {t("dialogs.linkcopy")}
      </Button>
      } 
      <p style={{justifyContent:"center",marginTop:"10px"}}>
        {t("basket.orderPayment")}: {cardAmount} {t("units.amd")}
      </p>
      <Divider sx={{bgcolor:"black"}}/>
      <Divider sx={{bgcolor:"black"}}/>
      <Button
        onClick={closeLinkQrAndRefresh}
      >
        {t("buttons.close")}
      </Button>
      </DialogContent>
    </Dialog>
  )
};

 export default memo(PayQRLink);
