import React, { memo, useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, Divider, Slide } from "@mui/material";
import { t } from "i18next";
import styles from "./index.module.scss";
import PrepaymentItem from "./PrepaymentItem";
import PaymentConfirm from "./PaymentConfirm";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const activeStyle = {
  boxShadow: "10px 5px 5px grey",
  scale:"1.04",
  transition: "width 2s",
  background: "rgb(200, 240, 240)"
};

const PrepaymentConfirmation = ({open,close,setPayData,payData, content}) => {

  const [activeRow,setActiveRow] = useState(0);
  const [openPaymentConfirm, setOpenPaymentConfirm] = useState(false);
  const [price, setPrice] = useState(0);

  const subscriptionData = [
    {
      months: 1,
      price: 3000
    },
    {
      months: 2,
      price: 6000
    },
    {
      months: 3,
      price: 9000
    },
  ];

  const activateRow = (row) => {
    if(activeRow === row){
      setActiveRow(0)
    }else{
      setActiveRow(row)
    }
  };


 const prepayment = () =>{
  setOpenPaymentConfirm(true)
 };

  return(
    <Dialog 
      open={open} 
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogContent>
        <p style={{fontSize:"150%",margin:"5px 20px"}}>{t("cardService.subscription")}</p>
        <Divider  sx={{m:1}}  color="black" />
        <div  className={styles.subscription}>
          {
            subscriptionData && subscriptionData.map((item,index) => (
              <PrepaymentItem
                {...item} 
                activeRow={activeRow}
                setActiveRow={setActiveRow}
                index={index}
                activeStyle={activeStyle}
                activateRow={activateRow}
                setPaymentData={setPayData}
                paymentData={payData}
                setPrice={setPrice}
              />
            ))
          }
        </div>
        <DialogActions>
          {activeRow ? 
            <Button 
            variant="contained" 
            onClick={prepayment}
            >
              {t("basket.linkPayment")}
            </Button>: ""
          }
          <Button onClick={close}>{t("buttons.cancel")}</Button>
        </DialogActions>
      </DialogContent>

      <PaymentConfirm
        isPrepayment={true}
        open={openPaymentConfirm}
        close={()=> setOpenPaymentConfirm(false)}
        cardArr={content?.cards}
        setPayData={setPayData}
        payData={payData}
        content={content}
        price={price}
        // logOutFunc={logOutFunc}
      />
    </Dialog>
  )
};

export default memo(PrepaymentConfirmation);
