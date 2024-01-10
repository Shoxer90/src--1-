import React, { memo, useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, Divider, Slide } from "@mui/material";
import { t } from "i18next";
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import styles from "./index.module.scss";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PrepaymentConfirmation = ({open,close}) => {

  const [activeRow,setActiveRow] = useState(0)

  const subscriptionData = [
    {
      monthCount: 1,
      price: 3000
    },
    {
      monthCount: 2,
      price: 6000
    },
    {
      monthCount: 3,
      price: 9000
    },
    {
      monthCount: 4,
      price: 12000
    },
    {
      monthCount: 5,
      price: 15000
    },
    
  ];

  const activateRow = (row) => {
    if(activeRow === row){
      setActiveRow(0)
    }else{
      setActiveRow(row)
    }
  };
  const activeStyle = {
    boxShadow: "10px 5px 5px grey",
    scale:"1.04",
    transition: "width 2s",
    background: "rgb(200, 240, 240)"

  };
 const prepayment = () =>{
  console.log("oppa")
 };

 useEffect(() =>{
  setActiveRow(0)
 }, [close])

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
        <div  className={styles.subscription} >
          {
            subscriptionData && subscriptionData.map((item,index) => (
              <div 
                className={styles.subscription_item} 
                onClick={()=>activateRow(index+1)}
                style={activeRow === index+1 ? activeStyle: null}
              >
                <span>
                  <FileDownloadDoneIcon sx={{color:"green",mr:2}} />
                  {item?.monthCount} {t("cardService.monthCount")} 
                </span>
                <span style={{width:"20%"}}></span>
                <span>
                  {item?.price} {t("units.amd")}
                </span>
              </div>
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
    </Dialog>
  )
};

export default memo(PrepaymentConfirmation);
