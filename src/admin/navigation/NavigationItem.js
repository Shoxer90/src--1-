import { memo } from "react";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";


const NavigationItem = ({
  title,
  path,
  isActive,
  id,
  changeNavigation
}) => {
  const {t} = useTranslation();
  
  const linkStyle = {
    color: isActive && "orange",
  };

  return (
    <span 
      // className={styles.navigation_container_item} 
      onClick={()=>changeNavigation(id)} 
      style={linkStyle}
    >
      {t(`${title}`)?.toUpperCase()}
    </span>
  )
};

export default memo(NavigationItem);
