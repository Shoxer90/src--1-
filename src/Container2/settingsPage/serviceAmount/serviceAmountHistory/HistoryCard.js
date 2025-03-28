import React, { memo } from "react";
import HistoryIcon from '@mui/icons-material/History';
import { Button } from "@mui/material";


const HistoryCard = ({setOpenHistory,t}) =>  {
  return (
    <Button 
      startIcon={ <HistoryIcon />}
      variant="contained"
      style={{
        background:"rgba(40,48,72,1)",
        margin:"21px",
        alignSelf:"start",
        textTransform: "capitalize"
      }}
      onClick={()=>setOpenHistory(true)}
    >
      {t("cardService.historySubTitle")}
    </Button>
  )
};

export default memo(HistoryCard);
