import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Divider } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SnackErr from "../../dialogs/SnackErr";
import HistoryDetailsItem from "./HistoryDetailsItem";
import HistoryDetailsFooter from "./HistoryDetailsFooter";
import { useTranslation } from "react-i18next";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function HistoryDetails({
  item,
  openDetails,
  originTotal,
  setOpenDetails,
  message,
  setMessage,
  amountForPrePayment, 
  setAmountForPrePayment
}) {

  const {t} = useTranslation();

  const handleClose = () => {
    setMessage()
    setOpenDetails(false);
  };
  
  const totalCounterForPrePayment = () => {
    let total = 0
    item?.products && item?.products.map((product, index) => {
      total += product?.count * product?.discountedPrice
    })
    setAmountForPrePayment({rest:total - originTotal, amount:total})
  };

  useEffect(() => {
    item?.saleType === 5 && 
    totalCounterForPrePayment() && 
    localStorage.setItem("prepaymentAmount", item?.cardAmount + item?.cashAmount)
  }, []);

  return (
    <Dialog
      open={!!openDetails}
      TransitionComponent={Transition}
      keepMounted
      maxWidth="sx"
    >
      <div style={{fontSize:"80%", padding:"5px"}}>
        <DialogTitle style={{display:"flex", justifyContent:"space-between", padding:"0px",paddingLeft:"10px",position:"sticky"}}>
          <span>  {item?.id} {t("history.check_details")}</span>
          <Button onClick={handleClose} sx={{textTransform: "capitalize"}}> <CloseIcon /> </Button>
        </DialogTitle>

        <Divider color="black" />
        
        <div>{item?.hdmMode ===2 && "Fizikakan"}</div>
        <div style={{margin:"3px 10px", display:"flex",justifyContent:"space-between"}}>
          <div>
            <div>{item?.date.slice(0,10)} {item?.date.slice(11,19)} </div>
            <div>{t("settings.cashier")}: {item?.cashier?.id}</div>
          </div>
        </div>

        {
          item?.products && item?.products.map((prod,index) => {
            return <HistoryDetailsItem
              key={prod?.id}
              index={index}
              {...prod}
            />
          })
        }

        <Divider sx={{bgColor:"black"}} />
          <HistoryDetailsFooter item={item} amountForPrePayment={amountForPrePayment} />
      </div> 
      {message &&
        <Dialog open={Boolean(message)}>
          <SnackErr message={message} close={setMessage} type="error" />
        </Dialog>
      }
    </Dialog>
  );
}
