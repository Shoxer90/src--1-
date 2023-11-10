import { Button, Divider } from "@mui/material";
import React, { memo } from "react";
import styles from "./index.module.scss";
import ConfirmDialog from "../../Container2/dialogs/ConfirmDialog";
import { useState } from "react";


const BasketFooter = ({totalPrice, t, paymentInfo, handleChangeInput, createMessage,deleteBasketGoods}) => {
  const [openDialog,setOpenDialog] = useState(false);
  
  return(
    <> 
    <div style={{display:"flex",justifyContent:"space-between"}}>
   
    <div className={styles.nonArrow} > 
      <label htmlFor="pt">
        {t("basket.partner")}{" "}
        <input
          style={{width:"120px"}}
          name="partnerTin"
          type="number"
          onChange={(e) => handleChangeInput(e)}
        />
      </label>
      </div>
      <Button 
        variant="contained" 
        onClick={()=>setOpenDialog(true)} 
        size="small"
        style={{justifyContent:"space-end",margin:"7px",fontSize:"80%"}}
      >
        {t("basket.removeallprod").slice(0,-1)}
      </Button>
    </div>
    <div className={styles.bask_container_body_footer_pay}>
    <Divider flexItem  sx={{ bgcolor:"black"}} />
    {/* <div>
      {t("basket.total")} 
      {totalPrice.toFixed(2)} {" "}
      {t("units.amd")}
    </div>
    <label className={styles.basket_details_inputs}>
      {t("basket.discount")}
      <input
        min="0"
        max={99} 
        type="number"
        name="discount"
        value={paymentInfo?.discount ? paymentInfo?.discount : ""}
        onChange={(e) => {
          if(e.target.value>99){
          createMessage("error",`${t("dialogs.sorry")}, ${t("authorize.errors.discount2")}`)
          }
          handleChangeInput(e)
        }}
      />% = {" "}
      {paymentInfo?.discount > 0 ?
        <span>
          {(
            totalPrice - (
              totalPrice - (
                totalPrice * (paymentInfo?.discount )
              ) / 100
            )
          ).toFixed(2)}
          {t("units.amd")}
        </span> : 0
      }
    </label> */}
    <span style={{color:"orangered",fontWeight:"800"}}>
      {t("basket.totalndiscount")}
      {(
        totalPrice - (
          totalPrice * (paymentInfo?.discount || 0)
      ) / 100 
      ).toFixed(2)}
      {t("units.amd")}
    </span>
  </div>
  <ConfirmDialog 
    question={t("basket.removeallprod")}
    func={deleteBasketGoods}
    title={t("settings.remove")}
    open={openDialog}
    close={setOpenDialog}
    content={" "}
    t={t}
  />
  </>
  )
};

export default memo(BasketFooter);