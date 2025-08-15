import { memo, useState } from "react";

import CloseIcon from '@mui/icons-material/Close';
import { Button, IconButton } from "@mui/material";

import ConfirmDialog from "../../../Container2/dialogs/ConfirmDialog";
import styles from "../index.module.scss";

const BasketHeader = ({
  t, 
  setOpenBasket,
  deleteBasketGoods, 
  basketContent, 
  setSingleClick,
  freezeCount,
  closeBasketDialog,
}) => {

  const [openDialog,setOpenDialog] = useState(false);

   const cleanAllGoods = () => {
   setSingleClick({pointerEvents:"none"})
   deleteBasketGoods()
    setOpenDialog(false)
  };


  return(
    <div className={styles.bask_container_header}>
      <span style={{fontSize:"130%"}}>{t("basket.title")}</span>
      <>
      { basketContent?.length  ?
        <Button 
          variant="contained" 
          onClick={()=>setOpenDialog(true)} 
          size="small"
          style={{justifyContent:"space-end",fontSize:"70%", textTransform: "capitalize",}}
        >
          {t("basket.removeallprod").slice(0,-1)}
        </Button>: ""
      }
      </>
      <IconButton onClick={()=>closeBasketDialog()} style={{color:"gray", left:2}}> 
        <CloseIcon />
      </IconButton>
      <ConfirmDialog 
        question={<>
          {t("basket.removeallprod")} <br />
          {t("basket.removeEmarks")}
        </>}
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
