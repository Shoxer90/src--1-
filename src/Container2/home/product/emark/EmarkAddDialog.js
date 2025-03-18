import { AppBar, Dialog, IconButton, Slide, Toolbar, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import { forwardRef, memo } from "react";
import EmarkExcel from "./excel/EmarkExcel";
import EmarkInput from "./input/EmarkInput";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EmarkAddDialog = ({isExcel,open,setOpen}) => {
  
  
  const handleClose = () => {
    setOpen(false);
  };
 
  return (
    <Dialog
      open={open}
      fullScreen
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative',background:"#171A1C"}}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Add E - mark 
            </Typography>
          </Toolbar>
          </AppBar>
      {isExcel ?
        <EmarkExcel />:
        <EmarkInput />
      }
    </Dialog>
  )
};

export default memo(EmarkAddDialog);
