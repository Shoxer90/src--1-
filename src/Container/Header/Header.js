import React, { useEffect , useContext, memo, useState} from "react";
import { useLocation, useNavigate} from "react-router-dom";

import Logo from "./Logo";
import MenuBurger from "./MenuBurger";
import {LimitContext} from "../../context/Context";

import { Badge, Button } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import InventorySharpIcon from '@mui/icons-material/InventorySharp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import styles from "./index.module.scss";

import UserInfo from "./userAvatar/index"

const Header = ({
  t,
  setOpenBasket,
  basketGoodsqty,
  logOutFunc,
  // setCurrentPage,
  user,
  logo,
  active,
  setContent,
  activeBtn, setActiveBtn
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {limitedUsing} = useContext(LimitContext);
  const [isEmptyBasket, setIsEmptyBasket] = useState(localStorage.getItem("bascket1"));

  useEffect(() => {
    setActiveBtn(location.pathname)
  },[]);
  
  useEffect(() => {
    if(localStorage.getItem("bascket1")){
      setIsEmptyBasket(localStorage.getItem("bascket1"))

    }else{
      setOpenBasket(false)
      setIsEmptyBasket(localStorage.getItem("bascket1"))

    }
  },[localStorage.getItem("bascket1")]);

  return (
      <div className={styles.containerXX}> 
        <div style={{display:"flex", padding:"5px"}}
          onClick={() => {
            // setCurrentPage(1)
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
                  // setContent([])
                  // setCurrentPage(1)
                  navigate("/")
                  setActiveBtn("/")
                }
              }}
            >
              <HomeIcon fontSize="large" />
              <span className={styles.routeName}>{t("menubar.home")}</span>
            </h6>
            <h6 
              style={{
                color:(activeBtn === "/history"? "#FFA500" : "#383838"),
                fontSize:(activeBtn === "/history" &&"140%")
              }}
              onClick={() => {
                // setContent([])
                // setCurrentPage(1)
                navigate("/history?status=Paid&page=1")
                setActiveBtn("/history")
              }}
            >
              <HistoryIcon fontSize="large"/>
              <span className={styles.routeName}>{t("menubar.history")}</span>
            </h6>
            {!limitedUsing && <h6 
              style={{
                color:(activeBtn === "/product-info/updates"? "#FFA500" : "#383838"),
                fontSize:(activeBtn === "/product-info/updates" && "140%")
              }}
              onClick={() => {
                // setContent([])
                // setCurrentPage(1)
                setActiveBtn("/product-info/updates")
                navigate("/product-info")
              }}
            >
              <InventorySharpIcon fontSize="large"/>
              <span className={styles.routeName}>{t("menubar.product")}</span>
            </h6>}
          </div>
        </div>
        <div className={styles.contentX}>
          { user?.firstname === undefined ? "":  
            <UserInfo user={user?.firstname+ " " + user?.lastname} logo={logo} active={active} t={t} limitedUsing={limitedUsing}/>
          }
          <div style={{width:"120px"}} className={styles.routeName}></div>
          <Badge
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            badgeContent={basketGoodsqty}
            color="warning"
            style={{height:"40px" }}
          >
            <Button
              className={styles.basketBTN}
              variant="contained"
              style={{background:"#28A745",borderRadius:"8px"}}
              onClick={()=>{
                // if(isEmptyBasket.length){
                  setOpenBasket(true)

                // }
              }}
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
  