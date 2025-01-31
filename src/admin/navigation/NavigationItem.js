import { memo } from "react";
import styles from "./index.module.scss";


const NavigationItem = ({
  title,
  path,
  isActive,
  id,
  changeNavigation
}) => {
  
  const linkStyle = {
    color: isActive && "orange",
    // fontSize: "160%"
  };

  return (
    <div 
      className={styles.navigation_container_item} 
      onClick={()=>changeNavigation(id)} 
      style={linkStyle}
    >
      {title.toUpperCase()}
    </div>
  )
};

export default memo(NavigationItem);
