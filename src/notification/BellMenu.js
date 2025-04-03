import { memo } from "react";
import { Menu, styled, alpha } from '@mui/material';


const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(2),
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

const BellMenu = ({
  anchorEl, setAnchorEl,
  isNotClicked, setIsNotClicked
}) => {
  return(
    <StyledMenu
      anchorEl={anchorEl}
      open={anchorEl}
      onClose={() => setAnchorEl(false)}
      style={{minWidth:"550px", padding:"5px"}}
    >
      <ul>
        <li style={{fontWeight:isNotClicked? 800:400}} onClick={()=> setIsNotClicked(false)}>Notification</li>
        <li>Notification</li>
        <li>Notification</li>
        <li>Notification</li>
        <li>Notification</li>
      </ul>
    </StyledMenu>
  )
};

  export default memo(BellMenu);

  