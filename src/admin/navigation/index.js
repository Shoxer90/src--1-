import {  forwardRef, memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NAV_TITLES } from "../modules/variables";

import NavigationItem from "./NavigationItem";
import { useGetAdminUserQuery } from "../../store/admin/adminApi";

import styles from "./index.module.scss";
import { AppBar, Slide } from "@mui/material";


const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const Navigation = ({setTitle}) => {
  
  const navigate = useNavigate();
  const [navDirect, setNavDirect] = useState();
  const {data: admin, isFetching} = useGetAdminUserQuery()

  const changeNavigation = (id) => {
    let path = ""
    let newNav = navDirect.map((navItem) => {
      if(navItem?.id === id){
        setTitle({
          subtitle: navItem?.subtitle || "",
          title: navItem?.title
        })
        path = navItem?.path
        return {
          ...navItem,
          isActive: true
        }
      }else {
        return {
          ...navItem,
          isActive: false
        }
      }
    })
    setNavDirect(newNav)
    navigate(path)
  }

  useEffect(() => {
    setNavDirect(NAV_TITLES)
  }, []);
  
  if(isFetching){
   <div>"...Loading"</div>
  }

  return (
    <AppBar>
      <div className={styles.navigation}>
        <nav className={styles.navigation_container}>
        <span>{admin?.firstname} {admin?.lastname}</span>
          {navDirect && navDirect.map((navItem)=>(
            <NavigationItem 
              key={navItem?.path}
              changeNavigation={changeNavigation}
              {...navItem}
            />
          ))}
        </nav>
      </div>
      </AppBar>
  )
};

export default memo(Navigation);
