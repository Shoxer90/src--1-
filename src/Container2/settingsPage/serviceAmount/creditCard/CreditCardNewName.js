import { Button, Dialog, DialogContent, Divider, IconButton } from "@mui/material";
import React, { memo } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from "react-i18next";


const CreditCardNewName = ({open, cardName, setCardName,close,func}) => {

  const {t} = useTranslation();
  return (
    <Dialog open={open} width="lg">
      <DialogContent style={{display:"flex",flexFlow:"column"}}>
        <div style={{display:"flex", justifyContent:"space-between",alignItems:"center"}}>
        <span>{t("cardService.editName")}</span>
        <IconButton
          onClick={close}
          style={{color:"gray", left:2}}
        > 
        <CloseIcon />
      </IconButton>
      </div>
        <Divider sx={{m:1}} color="black" />
        <input type="text" value={cardName?.name} onChange={(e)=> setCardName({...cardName,name:e.target.value})}/>
        <Button variant="contained" sx={{m:2,textTransform: "capitalize"}} onClick={func}>
          {t("buttons.update")}
        </Button>
      </DialogContent>

    </Dialog>
  )
};

export default memo(CreditCardNewName);
