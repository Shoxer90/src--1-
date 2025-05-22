import  React from 'react';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { memo } from 'react';
import { Box } from '@mui/system';
import { DialogTitle } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const ChangesAnalyses = ({open, setOpen, content, name, t}) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={Boolean(open)}
      style={{background: "rgb(40,167,69,0.15)"}}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
    <AppBar 
      sx={{ 
        maxWidth: "270px", 
        height:"100%", 
        overflowY:"scroll",
        backgroundColor:"#F5F5F5", 
        color: "#172d44" 
      }}
    >
      <Box style={{padding:"10px"}}>
      <List style={{top:0}}>
        <DialogTitle style={{display:"flex", justifyContent:"space-between", padding:0}}>
          <span style={{alignContent:"center"}}>{name}</span>
          <IconButton
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider color="initial" style={{margin:1}} />
        <Divider color="initial" style={{margin:1}} />
        {content && content.map((item, index) => (
          <div key={index} style={{display:"flex",flexFlow:"column" , fontSize:"medium"}}>
            <span>
            { t("productinputs.date")}   {item.changeDate.slice(0,10)}  /  {item.changeDate.slice(11,item.changeDate?.length-3)}
            </span>
            <span>
            {t("productinputs.purchase")}: {item?.purchasePrice} {t("units.amd")}
            </span>
            <span>
            {t("productinputs.price")} : {item.price}  {t("units.amd")}
            </span>
            <span>
            {t("productinputs.count")} : {item?.count}
            </span>                    
            <Divider color="initial" style={{margin:1}} />
          </div>
        ))}
      </List>
      </Box>
    </AppBar>
    </Dialog>
  );
};

export default memo(ChangesAnalyses);
