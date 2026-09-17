import React, { useState } from 'react';
import { memo } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import EditNoteIcon from '@mui/icons-material/EditNote';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 4,
    marginTop: theme.spacing(1),
    color:
    theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        color: theme.palette.text.secondary,
      },
      '&:active': {
        position: "none",
        backgroundColor: alpha(
        theme.palette.primary.main,
        theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

const ExcelBurger = ({t,setOpenNewProduct}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const redirect = useNavigate();

  return (
    
    <div style={{fontSize: "70%"}}>
      <Button
        variant="contained"
        style={{color: "white",height: "35px",textTransform: "capitalize"}}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <BrowserUpdatedIcon style={{margin:"auto 1px"}}/>
        {window.innerWidth> 481 && t("mainnavigation.productManagement")}
      </Button>

      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem 
        style={{padding:"1px 5px"}}
          fontSize="medium"
          onClick={()=>{
            setAnchorEl(null)
            setOpenNewProduct(true)}}
        >
          <div>
            <ControlPointIcon sx={{m:1}}/>
            {t("mainnavigation.newproduct")}
          </div>
        </MenuItem>

        <MenuItem 
        style={{padding:"1px 5px"}}
        fontSize="medium"
          onClick={()=>{
            setAnchorEl(null)
            redirect("/excel")
          }}
        >
          <div> 
            <InstallDesktopIcon sx={{m:1}}/>
            {t("mainnavigation.multipleproduct")}
          </div>
        </MenuItem>

        <MenuItem 
        style={{padding:"1px 5px"}}
        fontSize="medium"
          onClick={()=>{
            setAnchorEl(null)
            redirect("/excelUpdate")
          }}
        >
          <div> 
            <EditNoteIcon sx={{m:1}}/>
            {t("mainnavigation.quantityChange")}
          </div>
        </MenuItem>
      </StyledMenu>
    </div>
  );
}

export default memo(ExcelBurger);
