import { ButtonGroup } from "@mui/material";
import React, { memo } from "react";
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import  {IconButton}  from '@mui/material';
import ReactToPrint from "react-to-print";

const ReceiptHeader = ({
  handleClickOpen, 
  componentRef,
  setMessage, 
  saleData,
  t, 
}) => {

  const openInNewTab = url => window.location.href = url
  // const openInNewTab = url => window.open(url, '_blank', 'noopener,noreferrer');

  const copyLink = () => {
    navigator.clipboard.writeText(saleData?.link)
    setMessage(t("dialogs.linkcopy"))
    setTimeout(()=> setMessage(""), 3000)
  };

  return (
    <ButtonGroup styles={{display:"flex", flexDirection:"column"}}>

      <IconButton onClick={()=>openInNewTab(saleData?.link)}>
        <DownloadIcon />
      </IconButton>

      <IconButton onClick={handleClickOpen}>
        <ShareIcon/>
      </IconButton>

      <IconButton onClick={copyLink}>
        <ContentCopyIcon sx={{m:1}} />
      </IconButton>

      <IconButton>
        <ReactToPrint
          trigger={() => <PrintIcon  sx={{m:1}}/>}
          content={() =>componentRef.current}
          pageStyle="print"
        />
      </IconButton>

    </ButtonGroup>
  )
};

export default memo(ReceiptHeader);
