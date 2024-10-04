import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
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
  openDetails,
  id, 
  products,
  setOpenDetails,
  cashier,
  originTotal,
  date,
  message,
  setMessage,
  hdmMode,
  item,
  amountForPrePayment, 
  setAmountForPrePayment
}) {
  const {t} = useTranslation();
  const [prodItems, setProdItems] = useState([]);

  const handleClose = () => {
    setMessage()
    setOpenDetails(false);
  };

  const totalCounterForPrePayment = () => {
    let total = 0
    let arr = []
    products && products.map((product, index) => {
      total += product?.count * product?.discountedPrice
      return arr.push(<HistoryDetailsItem key={index} {...product} t={t} index={index+1} />)
    })
    setAmountForPrePayment({rest:total - originTotal,amount:total})
    setProdItems(arr)
  }

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
          <span>  {id} {t("history.check_details")}</span>
          <Button onClick={handleClose}> <CloseIcon /> </Button>
        </DialogTitle>

        <Divider color="black" />
        
        <div>{hdmMode ===2 && "Fizikakan"}</div>
        <div style={{margin:"3px 10px", display:"flex",justifyContent:"space-between"}}>
          <div>
            <div>{date.slice(0,10)} {date.slice(11,19)} </div>
            <div>{t("settings.cashier")}: {cashier}</div>
          </div>
        </div>
        <Divider sx={{bgColor:"black"}} />
        <DialogContent sx={{p:1}}>
          {prodItems}
          <HistoryDetailsFooter 
            item={item} 
            amountForPrePayment={amountForPrePayment}
          />
        </DialogContent>
      </div> 
      {message &&
        <Dialog open={Boolean(message)}>
          <SnackErr message={message} close={setMessage} type="error" />
        </Dialog>
      }
    </Dialog>
  );
}
