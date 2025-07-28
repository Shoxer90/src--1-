import { useEffect , useContext, memo, useState} from "react";
import { useLocation, useNavigate} from "react-router-dom";

import Logo from "./Logo";
import MenuBurger from "./MenuBurger";
import {LimitContext} from "../../context/Context";

import { Badge, Button, IconButton, Tooltip } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import styles from "./index.module.scss";

import UserInfo from "./userAvatar/index"
import { useTranslation } from "react-i18next";
import NotificationBell from "../../notification/NotificationBell";
import OnOffScanner from "../emarkScanner/OnOffScanner";

// const StyledMenu = styled((props) => (
//   <Menu
//     elevation={0}
//     anchorOrigin={{
//       vertical: 'bottom',
//     }}
//     {...props}
//   />
// ))(({ theme }) => ({
//   '& .MuiPaper-root': {
//     borderRadius: 4,
//     marginTop: theme.spacing(1),
//     color:
//     theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
//     boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
//     '& .MuiMenu-list': {
//     },
//     '& .MuiMenuItem-root': {
//       '& .MuiSvgIcon-root': {
//         color: theme.palette.text.secondary,
//       },
//       '&:active': {
//         position: "none",
//         backgroundColor: alpha(
//         theme.palette.primary.main,
//         theme.palette.action.selectedOpacity,
//         ),
//       },
//     },
//   },
// }));

const Header = ({
  setOpenBasket,
  basketGoodsqty,
  logOutFunc,
  user,
  logo,
  activeBtn,
  setActiveBtn,
  setNotifTrigger,
  notifTrigger,
  setFrom,
}) => {
  const {t} = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [windWidth, setWidWidth] = useState(window.screen.availWidth)
  const {limitedUsing} = useContext(LimitContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  useEffect(() => {
    setActiveBtn(location.pathname)
  },[]);

  window.addEventListener("resize", ()=>setWidWidth(window.screen.availWidth));
  return (
      <div className={styles.containerXX}> 
        <div 
          onClick={() => {
            navigate("/")
            setActiveBtn("/")
          }
        }>
          <Logo />
        </div>
        <div className={styles.middleMenu} >
          <div className={styles.headerLinkBtn}>
            <h6
              style={{ 
                color:(activeBtn === "/" ? "#FFA500" : "#383838"),
                fontSize:(activeBtn === "/" && "140%")
              }}
              onClick={() => {
                if(activeBtn === "/"){
                  return
                }else{
                  navigate("/")
                  setActiveBtn("/")
                }
              }}
            >
              <HomeIcon 
                fontSize="large" 
                sx={{
                  color:(activeBtn === "/" ? "#FFA500": "#3FB68A"),
                }}
              />
              <span className={styles.routeName}>{t("menubar.home")}</span>
            </h6>
            <h6 
              style={{
                color:(activeBtn === "/history"? "#FFA500" : "#383838"),
                fontSize:(activeBtn === "/history" &&"140%")
              }}
              onClick={() => {
                navigate("/history?status=Paid&page=1")
                setActiveBtn("/history")
              }}
            >
              <HistoryIcon fontSize="large"
                sx={{
                  color:(activeBtn === "/history"? "#FFA500": "#3FB68A"),
                }}
              />
              <span className={styles.routeName}>{t("menubar.history")}</span>
            </h6>
            <h6 
              style={{
                color:(anchorEl? "#FFA500" : "#383838"),
                fontSize:(anchorEl && "140%")
              }}
              onClick={(e) => {
                setAnchorEl(e.currentTarget)
              }}
            >
              <QrCodeScannerIcon  
                fontSize="large"  
                sx={{ color:(anchorEl? "#FFA500": "#3FB68A")}}
              />

              <span className={styles.routeName}>Emark</span>
            </h6>
            <h6 
              style={{
                color:(activeBtn === "/prepayment"? "#FFA500" : "#383838"),
                fontSize:(activeBtn === "/prepayment" &&"140%")
              }}
              onClick={() => {
                navigate("/prepayment?page=1")
                setActiveBtn("/prepayment")
              }}
            >
              <ProductionQuantityLimitsIcon 
                fontSize="large"  
                sx={{ color:(activeBtn === "/prepayment"? "#FFA500": "#3FB68A")}} 
              />
              <span className={styles.routeName}>{t("basket.useprepayment")}</span>
            </h6>
             <NotificationBell 
                user={user} 
                setNotifTrigger={setNotifTrigger}
                notifTrigger={notifTrigger}
              />
          </div>
        </div>

        <div className={styles.contentX}>
        
          { user?.firstname === undefined ? "":  
            <UserInfo setActiveBtn={setActiveBtn} user={user?.firstname+ " " + user?.lastname} logo={logo} mode={user?.ehdmMode} t={t}  limitedUsing={limitedUsing}/>
          }
          <Badge
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
              transform: 'translate(45px, -14px)'
            }}
            badgeContent={basketGoodsqty}
            color="warning"
            style={{height:"40px"}}
          >
            <Button
              className={styles.basketBTN}
              variant="contained"
              style={
                {background:"#3FB68A",
                borderRadius:"8px",
                textTransform: "capitalize",
                // fontWeight: "bold",    
              }}
              onClick={()=>{
                setFrom("basket")
                setOpenBasket(true)
              }}
            >
              <ShoppingCartIcon/>
              <span className={styles.routeName}>{t("menubar.basket")}</span> 
            </Button>
          </Badge>
          <MenuBurger logout={logOutFunc} setActiveBtn={setActiveBtn} user={user}/>
          <OnOffScanner
            open={anchorEl}
            close={() => setAnchorEl(null)}
          />
        </div>
     </div>
  );
}

export default memo(Header);
  