import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
import { memo } from "react";

const ConfirmDialog = ({
  question,
  func, 
  title,
  open,
  close,
  content,
  t,
  nobutton
}) => {

  return(
    <Dialog
      open={open}
      maxWidth="sm"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {question}  
        <strong>{content}</strong> 
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>close(false)}>
          {nobutton || t("buttons.no")}
        </Button>
        <Button onClick={func}>{t("buttons.yes")}</Button>
      </DialogActions>
    </Dialog>
  )
};

export default memo(ConfirmDialog);
