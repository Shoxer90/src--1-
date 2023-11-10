import { Alert, Snackbar } from "@mui/material";
import React, { memo, useState } from "react";

const ActionMessage = ({type, message, setMessage }) => {
  const [open, setOpen] = useState(true);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setMessage("")
  }; 

    return (
      <Snackbar 
        open={open}  
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="info" sx={{ width: '200%' }}>
          <strong>{type}</strong>
          <p>{message}</p>
        </Alert>
    </Snackbar>
  )
};

export default memo(ActionMessage);
