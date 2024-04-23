import React, { useContext, useState } from 'react';
import { memo } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';

import LogoutIcon from '@mui/icons-material/Logout';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { LimitContext } from '../../context/Context';
import styles from "./index.module.scss";
import Flags from '../../Container2/language/Flags';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(0),
    minWidth: 180,
    color:
    theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 4,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(20),
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

const MenuBurger = ({logout,setActiveBtn, user}) => {
  const {limitedUsing} = useContext(LimitContext);
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <div>
      <Button
        variant="text"
        style={{
          color: "#383838",
          display:"flex",
          flexDirection:"column"
        }}
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
      >
        <MenuIcon fontSize="large" />
        <p className={styles.routeName}>{t("menuburger.title")}</p>
      </Button>
      <StyledMenu
        anchorEl={anchorEl}
        PaperProps={{  
          style: {  
            width: 270,  
          },  
       }} 
        open={open}
        onClose={() => setAnchorEl(null)}
        style={{minWidth:"300px"}}
      >
        {!limitedUsing && 
          <Box style={{display:'flex'}}>
            <MiscellaneousServicesIcon style={{marginLeft:"25px",marginTop:"6px"}}/>
            <MenuItem fontSize="medium"
              onClick={() => {
                setActiveBtn("")
                navigate("/setting/user")
                setAnchorEl(null)
              }}
            >
            <h5>{t("menuburger.setting")}</h5>
            </MenuItem>
          </Box>
        }
        {!limitedUsing && 
         <Box style={{display:'flex'}}>
        <AccountCircleIcon style={{marginLeft:"25px",marginTop:"6px"}}/>
          <MenuItem fontSize="medium"
            onClick={() => {
              setActiveBtn("")
              navigate("/setting/cashiers")
              setAnchorEl(null)
            }}
          >
           <h5>{t("settings.cashiers")}</h5>
          </MenuItem>
        </Box>}
        {!limitedUsing && user?.showPaymentPage && 
          <Box style={{display:'flex'}}>
            <HomeRepairServiceIcon style={{marginLeft:"25px",marginTop:"6px"}}/>
            <MenuItem fontSize="medium"
              onClick={() => {
                setActiveBtn("")
                navigate("/setting/services")
                setAnchorEl(null)
              }}
            >
            <h5>{t("cardService.btnTitle")}</h5>
            </MenuItem>
          </Box>
        }
       
        <Box style={{display:'flex'}}>
          <QuestionAnswerIcon style={{marginLeft:"25px",marginTop:"6px"}}/>
          <MenuItem fontSize="medium"
            onClick={() => {
              navigate("/feedback")
              setActiveBtn("")

              setAnchorEl(null)
            }}
          >
           <h5>{t("menuburger.feedback")}</h5>
          </MenuItem>
        </Box>
        <Flags />
        <Divider flexItem  style={{margin:1, backgroundColor:"gray"}}/>
        <Box style={{display:"flex",justifyContent:"center"}}>
          <LogoutIcon style={{marginTop: "6px"}} />
          <MenuItem style={{}} onClick={logout} disableRipple>
            <h5>{t("menuburger.logout")}</h5> 
          </MenuItem>
        </Box>
      </StyledMenu>
    </div>
  );
}

export default memo(MenuBurger);
