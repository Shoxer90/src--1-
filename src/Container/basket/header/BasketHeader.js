import React, { memo } from "react";

import CloseIcon from '@mui/icons-material/Close';
import { Button, IconButton } from "@mui/material";

import styles from "../index.module.scss";
import ConfirmDialog from "../../../Container2/dialogs/ConfirmDialog";
import { useState } from "react";

const BasketHeader = ({t, setOpenBasket, deleteBasketGoods, basketContent, setSingleClick, setFetching}) => {

  const [openDialog,setOpenDialog] = useState(false);

   const cleanAllGoods = () => {
    

   setSingleClick({pointerEvents:"none"})
   deleteBasketGoods()
    setOpenDialog(false)
  };

  return(
    <div className={styles.bask_container_header}>
      <span style={{fontSize:"130%"}}>{t("basket.title")}</span>
      { basketContent?.length  ?
        <Button 
          variant="contained" 
          onClick={()=>setOpenDialog(true)} 
          size="small"
          style={{justifyContent:"space-end",margin:"5px",fontSize:"70%"}}
        >
          {t("basket.removeallprod").slice(0,-1)}
        </Button>: ""
      }
      <IconButton
        onClick={()=>{
          setOpenBasket(false)
        }}
        style={{color:"gray", left:2}}
      > 
        <CloseIcon />
      </IconButton>
      <ConfirmDialog 
        question={t("basket.removeallprod")}
        func={cleanAllGoods}
        title={t("settings.remove")}
        open={openDialog}
        close={setOpenDialog}
        content={" "}
        t={t}
      />
    </div>
  )
};

export default memo(BasketHeader);
