import React from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Divider } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SnackErr from "../../dialogs/SnackErr";

import HistoryDetailsItem from "./HistoryDetailsItem";
import styles from "../index.module.scss";
import HistoryDetailsFooter from "./HistoryDetailsFooter";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function HistoryDetails({
  t,
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
  item
}) {

  const handleClose = () => {
    setMessage()
    setOpenDetails(false);
  };

  return (
    <Dialog
      open={!!openDetails}
      TransitionComponent={Transition}
      keepMounted
      maxWidth="sx"
    >
      <div style={{fontSize:"80%", padding:"5px"}}>
        <DialogTitle style={{display:"flex", justifyContent:"space-between", padding:"0px",paddingLeft:"10px",position:"sticky"}}>
          <span>{t("history.check_details")} #{id}</span>
          <Button onClick={handleClose}> <CloseIcon /> </Button>
        </DialogTitle>

        <Divider color="black" />
        <div>{hdmMode ===2 && "Fizikakan"}</div>
        <div style={{margin:"0 10px"}}>
          <div>{date.slice(0,10)} {date.slice(11,19)} </div>
          <div>{t("history.performer")}: {cashier}</div>
        </div>
        <Divider sx={{bgColor:"black"}}/>
        <DialogContent sx={{p:1}}>
          {item?.saleType === 5 ?  
            <div style={{display:"flex",justifyContent:"space-around"}}>
              <strong>{t("basket.useprepayment")}</strong>
              <strong>{item?.total} {t("units.amd")}</strong>
            </div>:
            products.map((product, index) =>
            <HistoryDetailsItem  key={index} {...product} t={t} index={index+1}/>)
          }
          <HistoryDetailsFooter item={item} originTotal={originTotal} />
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
