import React, { memo } from "react";
import ClientPay from "../ClientPay";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const History = ({
  t,
  cardArr,
  service,
  page,
  setPage,
  currentCard,
  setCurrentCard,
  changeActiveCard,
  historyAndCardData
  }) => {


  return (
    <div>
      <Accordion
        style={{margin:"15px",background:"#63B48D"}}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{service?.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
           <HistoryItem />
          
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default memo(History);
