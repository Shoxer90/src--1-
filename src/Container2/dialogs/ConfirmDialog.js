import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
import { memo } from "react";
import { useTranslation } from "react-i18next";

const ConfirmDialog = ({
  func, 
  open,
  title,
  close,
  content,
  nobutton,
  question,
}) => {
  const {t} = useTranslation();
  

  return(
    <Dialog
      open={!!open}
      maxWidth="sm"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {question}  
        <strong>{content}</strong> 
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>close(false)} sx={{textTransform: "capitalize"}}>
          {nobutton || t("buttons.close")}
        </Button>
        <Button onClick={func} sx={{textTransform: "capitalize"}}>{t("buttons.yes")}</Button>
      </DialogActions>
    </Dialog>
  )
};

export default memo(ConfirmDialog);
