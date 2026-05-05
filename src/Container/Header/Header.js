import { useEffect, useContext, memo, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Logo from "./Logo";
import MenuBurger from "./MenuBurger";
import { LimitContext } from "../../context/Context";

import { Badge, Button, Box, MenuItem } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import styles from "./index.module.scss";

import UserInfo from "./userAvatar/index"
import { useTranslation } from "react-i18next";
import NotificationBell from "../../notification/NotificationBell";
import OnOffScanner from "../emarkScanner/OnOffScanner";

const NAV_COMPACT_BREAKPOINT_PX = 1000;

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

  paymentInfo, setPaymentInfo,
  message,
  setMessage,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { limitedUsing } = useContext(LimitContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const emarkCompactAnchorRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(
    () => (typeof window !== "undefined" ? window.innerWidth : NAV_COMPACT_BREAKPOINT_PX)
  );

  const compactNav = windowWidth < NAV_COMPACT_BREAKPOINT_PX;

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    setActiveBtn(location.pathname)
  }, []);

  const collapsedNavRender = compactNav
    ? (closeMenu) => (
      <>
        <Box style={{ display: 'flex' }}>
          <HomeIcon style={{ marginLeft: "10px", marginTop: "6px", color: activeBtn === "/" ? "#FFA500" : "#3FB68A" }} />
          <MenuItem
            fontSize="medium"
            onClick={() => {
              closeMenu();
              if (activeBtn !== "/") {
                navigate("/");
                setActiveBtn("/");
              }
            }}
          >
            <h5>{t("menubar.home")}</h5>
          </MenuItem>
        </Box>
        <Box style={{ display: 'flex' }}>
          <HistoryIcon style={{ marginLeft: "10px", marginTop: "6px", color: activeBtn === "/history" ? "#FFA500" : "#3FB68A" }} />
          <MenuItem
            fontSize="medium"
            onClick={() => {
              closeMenu();
              navigate("/history?status=Paid&page=1");
              setActiveBtn("/history");
            }}
          >
            <h5>{t("menubar.history")}</h5>
          </MenuItem>
        </Box>
        <Box style={{ display: 'flex' }}>
          <QrCodeScannerIcon style={{ marginLeft: "10px", marginTop: "6px", color: anchorEl ? "#FFA500" : "#3FB68A" }} />
          <MenuItem
            fontSize="medium"
            onClick={() => {
              closeMenu();
              setTimeout(() => {
                if (emarkCompactAnchorRef.current) {
                  setAnchorEl(emarkCompactAnchorRef.current);
                }
              }, 0);
            }}
          >
            <h5>Emark</h5>
          </MenuItem>
        </Box>
        <Box style={{ display: 'flex' }}>
          <ProductionQuantityLimitsIcon style={{ marginLeft: "10px", marginTop: "6px", color: activeBtn === "/prepayment" ? "#FFA500" : "#3FB68A" }} />
          <MenuItem
            fontSize="medium"
            onClick={() => {
              closeMenu();
              navigate("/prepayment?page=1");
              setActiveBtn("/prepayment");
            }}
          >
            <h5>{t("basket.useprepayment")}</h5>
          </MenuItem>
        </Box>
      </>
    )
    : null;

  return (
    <div className={styles.containerXX}>
      <div
        onClick={() => {
          navigate("/")
          setActiveBtn("/")
        }}
      >
        <Logo />
      </div>
      <div className={styles.middleMenu}>
        {!compactNav ? (
          <div className={styles.headerLinkBtn}>
            <h6
              style={{
                color: (activeBtn === "/" ? "#FFA500" : "#383838"),
                fontSize: (activeBtn === "/" && "140%")
              }}
              onClick={() => {
                if (activeBtn === "/") {
                  return
                } else {
                  navigate("/")
                  setActiveBtn("/")
                }
              }}
            >
              <HomeIcon
                fontSize="large"
                sx={{
                  color: (activeBtn === "/" ? "#FFA500" : "#3FB68A"),
                }}
              />
              <span className={styles.routeName}>{t("menubar.home")}</span>
            </h6>
            <h6
              style={{
                color: (activeBtn === "/history" ? "#FFA500" : "#383838"),
                fontSize: (activeBtn === "/history" && "140%")
              }}
              onClick={() => {
                navigate("/history?status=Paid&page=1")
                setActiveBtn("/history")
              }}
            >
              <HistoryIcon fontSize="large"
                sx={{
                  color: (activeBtn === "/history" ? "#FFA500" : "#3FB68A"),
                }}
              />
              <span className={styles.routeName}>{t("menubar.history")}</span>
            </h6>
            <h6
              style={{
                color: (anchorEl ? "#FFA500" : "#383838"),
                fontSize: (anchorEl && "140%")
              }}
              onClick={(e) => {
                setAnchorEl(e.currentTarget)
              }}
            >
              <QrCodeScannerIcon
                fontSize="large"
                sx={{ color: (anchorEl ? "#FFA500" : "#3FB68A") }}
              />

              <span className={styles.routeName}>Emark</span>
            </h6>
            <h6
              style={{
                color: (activeBtn === "/prepayment" ? "#FFA500" : "#383838"),
                fontSize: (activeBtn === "/prepayment" && "140%")
              }}
              onClick={() => {
                navigate("/prepayment?page=1")
                setActiveBtn("/prepayment")
              }}
            >
              <ProductionQuantityLimitsIcon
                fontSize="large"
                sx={{ color: (activeBtn === "/prepayment" ? "#FFA500" : "#3FB68A") }}
              />
              <span className={styles.routeName}>{t("basket.useprepayment")}</span>
            </h6>

            {/* <h6 
              style={{
                color:(activeBtn === "/invoicing"? "#FFA500" : "#383838"),
                fontSize:(activeBtn === "/invoicing" &&"140%")
              }}
              onClick={()=> {
                if(user?.isRegisteredForTaxService) {
                  navigate("/invoicing")
                  setActiveBtn("/invoicing")
                } else{
                  setMessage({
                    // isOpen: true,
                    message: t("settings.needInvoiceAuth"),
                    type:"error"
                  })
                }
              }}
            >
              <AssignmentIcon 
                fontSize="large"  
                sx={{ color:(activeBtn === "/invoicing"? "#FFA500": "#3FB68A")}} 
              />
              <span className={styles.routeName}>E-invoicing</span>
            </h6> */}



            <NotificationBell
              user={user}
              setNotifTrigger={setNotifTrigger}
              notifTrigger={notifTrigger}
            />
          </div>
        ) : null}
      </div>

      <div className={styles.contentX}>
        <span
          ref={emarkCompactAnchorRef}
          aria-hidden
          style={{
            position: "fixed",
            top: 56,
            left: "50%",
            transform: "translateX(-50%)",
            width: 2,
            height: 2,
            opacity: 0,
            pointerEvents: "none",
          }}
        />

        {compactNav ? (
          <div className={styles.contentXUserCluster}>
            <NotificationBell
              user={user}
              setNotifTrigger={setNotifTrigger}
              notifTrigger={notifTrigger}
            />
            {user?.firstname === undefined ? null : (
              <UserInfo setActiveBtn={setActiveBtn} user={user?.firstname + " " + user?.lastname} logo={logo} mode={user?.ehdmMode} t={t} limitedUsing={limitedUsing} />
            )}
          </div>
        ) : (
          user?.firstname === undefined ? "" : (
            <UserInfo setActiveBtn={setActiveBtn} user={user?.firstname + " " + user?.lastname} logo={logo} mode={user?.ehdmMode} t={t} limitedUsing={limitedUsing} />
          )
        )}
        <Badge
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
            transform: 'translate(45px, -14px)'
          }}
          badgeContent={basketGoodsqty}
          color="warning"
          style={{ height: "40px" }}
        >
          <Button
            className={styles.basketBTN}
            variant="contained"
            style={{
                background: "#3FB68A",
                borderRadius: "8px",
                textTransform: "capitalize",
              }}
            onClick={() => {
              setFrom("basket")
              setOpenBasket(true)
            }}
          >
            <ShoppingCartIcon />
            <span className={styles.routeName}>{t("menubar.basket")}</span>
          </Button>
        </Badge>
        <MenuBurger
          logout={logOutFunc}
          setActiveBtn={setActiveBtn}
          user={user}
          collapsedNavRender={collapsedNavRender}
        />
        <OnOffScanner
          open={anchorEl}
          close={() => setAnchorEl(null)}
        />
      </div>
    </div>
  );
}

export default memo(Header);
