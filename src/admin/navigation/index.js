import { memo } from "react";
import { useLocation } from "react-router-dom";
import { AppBar } from "@mui/material";

import NavigationItem from "./NavigationItem";
import { useGetAdminUserQuery } from "../../store/admin/adminApi";
import LangSelect from "../../Container2/langSelect";

import styles from "./index.module.scss";

const Navigation = ({ currentNavigation, changeNavigation }) => {
  const customer = JSON.parse(localStorage.getItem('customer'))
  const search = useLocation().search;
  const storeId = new URLSearchParams(search).get("id");
  const {data: admin, isFetching} = useGetAdminUserQuery(); 

  const goToStorePage = (id) => {
    localStorage.removeItem("customer")
    changeNavigation(id)
  }
  
  if(isFetching) {<div>Loading...</div>};

  return (
    <AppBar sx={{background:"#171A1C"}}>
      <div className={styles.navigation}>

        <div className={styles.navigation_main_nav}>
          <NavigationItem 
            changeNavigation={goToStorePage}
            {...currentNavigation[0]}
          />
          <span className={styles.navigation_user_logo}>
            <span>{admin?.firstname} {admin?.lastname}</span>
            <LangSelect size={"22px"} />
          </span>
        </div>

        <nav className={styles.navigation_container}>
          {/* {!currentNavigation[0].isActive && storeId &&
            <span style={{ fontWeight:"600", color:"#3FB68A"}}>
              {customer?.store?.legalName|| ""}
            </span>
          }
           */}
          {customer?.store?.legalName && currentNavigation.map((navItem, index)=>{
            if(index !==0){
              return <NavigationItem 
                key={navItem?.path}
                changeNavigation={changeNavigation}
                {...navItem}
              />
            }
          })}
        </nav>
      </div>
    </AppBar>
  )
};

export default memo(Navigation);
