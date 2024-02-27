import React, { memo } from "react";
import HistoryIcon from '@mui/icons-material/History';
import { Button, Card } from "@mui/material";

import { t } from "i18next";

import styles from "../index.module.scss";

const HistoryCard = ({setOpenHistory}) =>  {
  return (
    <Button 
      startIcon={ <HistoryIcon fontSize="small" />}

      variant="contained"
      size="small"
      sx={{borderRadius:1,background:"#def7ee", color:"blue", margin:1}}
      onClick={()=>setOpenHistory(true)}
    >
      {t("cardService.historySubTitle")}
    </Button>
  //    <Card 
  //    className={styles.attachCardContainer} 
  //    sx={{borderRadius:4,background:"#def7ee"}}
  //    onClick={()=>setOpenHistory(true)}
  //  >
  //    <div>
  //      <HistoryIcon fontSize="large" />
  //      <span style={{fontWeight: 600}}>
  //        {t("cardService.historySubTitle")}
  //      </span>
  //    </div>
  //  </Card>
  )
};

export default memo(HistoryCard);
