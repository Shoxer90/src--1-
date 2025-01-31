import { memo, useEffect, useState } from "react";
import { NAV_TITLES } from "../modules/variables";

import styles from "./index.module.scss";
import NavigationItem from "./NavigationItem";
import { useNavigate } from "react-router-dom";
import { useGetAdminUserQuery } from "../../store/adminApi";

const LeftNavigation = ({setTitle}) => {
  const navigate = useNavigate();
  const [navDirect, setNavDirect] = useState();
  const {admin={}, isError, isLoading} = useGetAdminUserQuery()
  console.log(admin, "admin")

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
  
  if(isLoading){
   <div>"...Loading"</div>
  }

  return (
    <div className={styles.navigation}>
      <nav className={styles.navigation_container}>
        {navDirect && navDirect.map((navItem)=>(
          <NavigationItem 
            key={navItem?.path}
            changeNavigation={changeNavigation}
            {...navItem}
          />
        ))}
      </nav>
    </div>
  )
};

export default memo(LeftNavigation);
