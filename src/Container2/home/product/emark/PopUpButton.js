
import React, { useState } from 'react';
import { memo } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useTranslation } from 'react-i18next';
import EmarkButton from './EmarkButton';

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
  
const PopUpButton = () => {
  const [emarkData,setEmarkData] = useState([])
  const {t} = useTranslation();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    
    <div style={{fontSize: "70%"}}>
      <Button
        variant="contained"
        style={{color: "white",height: "35px",textTransform: "capitalize"}}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <ControlPointIcon style={{margin:"auto 1px"}}/>
        {t("emark.mainBtn")}
      </Button>

      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
      >
      <EmarkButton />
      </StyledMenu>
      <span style={{paddingLeft:"5px"}}>{t("emark.availableQr")} {emarkData?.length} {t("units.pcs")}</span>
    </div>
  );
}

export default memo(PopUpButton);
