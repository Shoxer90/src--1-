 import { Alert, Snackbar } from "@mui/material";
import React from "react";
import { memo } from "react";

 const SnackErr = ({message, type, close}) => {

  return (
    <Snackbar 
      open={message} 
      sx={{ height: "100%"}}
      anchorOrigin={{   
        vertical: "top",
        horizontal: "center"
      }}
    >
      <Alert onClose={()=>close()} severity={type} sx={{ width: '100%' ,fontWeight:600,padding:"20px", fontSize: "120%"}}>
        <strong>
          {message}
           </strong>
      </Alert>
    </Snackbar>
  )
};

export default memo(SnackErr);
