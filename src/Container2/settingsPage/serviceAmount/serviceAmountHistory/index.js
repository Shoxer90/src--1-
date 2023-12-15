import React, { memo } from 'react';

import HistoryTable  from "./HistoryTable"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';

const ServiceAmountHistory = ({serviceHistory, t}) => (

  <Accordion  elevation={0}>
    <AccordionSummary  sx={{justifyContent:"start",padding:0}} expandIcon={<ExpandMoreIcon />}>
     <Typography  align="left"> {t("cardService.historySubTitle")}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <HistoryTable history={serviceHistory} />
    </AccordionDetails>
  </Accordion>

)

export default memo(ServiceAmountHistory);
