import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { connectScanner, disconnectScanner } from './ScannerManager';
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


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

const OnOffScanner = ({open, close}) => {
  const {t} = useTranslation();
  return (
     <StyledMenu
            anchorEl={open}
            open={open}
            onClose={close}
          >
            <MenuItem 
              style={{padding:"1px 5px",margin:"5px"}}
              fontSize="medium"
              onClick={()=>{
                connectScanner()
                close()
              }}
            >
              ✅ {t("emark.onScan")}
            </MenuItem>
    
            <MenuItem 
              style={{padding:"1px 5px", margin:"5px"}}
              fontSize="medium"
              onClick={()=> {
                disconnectScanner()
                close()
              }}
            >
              ❌ {t("emark.offScan")}
            </MenuItem>
          </StyledMenu>
  )
};

export default memo(OnOffScanner);

