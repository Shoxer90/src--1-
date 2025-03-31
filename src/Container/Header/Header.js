import React, { useEffect , useContext, memo, useState} from "react";
import { useLocation, useNavigate} from "react-router-dom";

import Logo from "./Logo";
import MenuBurger from "./MenuBurger";
import {LimitContext} from "../../context/Context";

import { Badge, Button } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';

import styles from "./index.module.scss";

import UserInfo from "./userAvatar/index"
import { useTranslation } from "react-i18next";
import NotificationBell from "../../notification/NotificationBell";

const Header = ({
  setOpenBasket,
  basketGoodsqty,
  logOutFunc,
  user,
  logo,
  activeBtn,
  setActiveBtn,
}) => {
  const {t} = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const {limitedUsing} = useContext(LimitContext);

  useEffect(() => {
    setActiveBtn(location.pathname)
  },[]);

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
                color:(activeBtn === "/"? "#FFA500" : "#383838"),
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
                  color:(activeBtn === "/"? "#FFA500": "#3FB68A"),
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
            {/* {!limitedUsing && <h6 
              style={{
                color:(activeBtn === "/product-info/updates"? "#FFA500" : "#383838"),
                fontSize:(activeBtn === "/product-info/updates" && "140%")
              }}
              onClick={() => {
                setActiveBtn("/product-info/updates")
                navigate("/product-info")
              }}
            >
              <InventorySharpIcon fontSize="large"/>
              <span className={styles.routeName}>{t("menubar.product")}</span>
            </h6>} */}
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
          </div>
        </div>

        <div className={styles.contentX}>
          {/* <NotificationBell /> */}

          { user?.firstname === undefined ? "":  
            <UserInfo setActiveBtn={setActiveBtn} user={user?.firstname+ " " + user?.lastname} logo={logo} mode={user?.ehdmMode} t={t}  limitedUsing={limitedUsing}/>
          }
          <Badge
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
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
              onClick={()=>setOpenBasket(true)}
            >
              <ShoppingCartIcon/>
              <span className={styles.routeName}>{t("menubar.basket")}</span> 
            </Button>
          </Badge>
          <MenuBurger logout={logOutFunc} setActiveBtn={setActiveBtn} user={user}/>
        </div>
     </div>
  );
}

export default memo(Header);
  