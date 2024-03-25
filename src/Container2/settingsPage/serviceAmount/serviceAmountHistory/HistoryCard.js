import React, { memo } from "react";
import HistoryIcon from '@mui/icons-material/History';
import { Button } from "@mui/material";

import { t } from "i18next";

const HistoryCard = ({setOpenHistory}) =>  {
  return (
    <Button 
      startIcon={ <HistoryIcon />}
      variant="contained"
      style={{background:"rgba(40,48,72,1)"}}
      onClick={()=>setOpenHistory(true)}
    >
      {t("cardService.historySubTitle")}
    </Button>
  )
};

export default memo(HistoryCard);
