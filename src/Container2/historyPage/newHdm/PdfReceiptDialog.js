import { memo } from "react";
import { useTranslation } from "react-i18next";

import { Box, Button, Dialog, Divider } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';


const headerStyle = {
  display:"flex",
  justifyContent:"end",
  padding:"5px",
  width:"100%",
}

const btnStyle = {
  display:"flex",
  justifyContent:"end",
  padding:"5px",
  margin:"5px",
  alignSelf:"center",
};

const PdfReceiptDialog = ({open,close,func, text}) => {
  const {t} = useTranslation();

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <Box>
        <div style={headerStyle}>
          <CloseIcon onClick={close} />
        </div>
        <Divider />
        <Box sx={{mt:3,mb:3,textAlign:"center"}}>
          <div>
            {text}
          </div>
          <div>
            {t("dialogs.seePDF")}
          </div>
          
        </Box>
        <Divider />
        <div style={btnStyle}>
          <Button
            variant="contained"
            onClick={func}
            size="small"
            style={{ backgroundColor:"#3FB68A",textTransform: "capitalize",width:"30%"}}
            >
              {t("buttons.view")}
            </Button>
        </div>
      </Box>
    </Dialog>
  )
};

export default memo(PdfReceiptDialog);
