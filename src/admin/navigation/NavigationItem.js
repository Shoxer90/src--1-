import { memo } from "react";
import { useTranslation } from "react-i18next";

const NavigationItem = ({ title, isActive, id, changeNavigation}) => {
  const {t} = useTranslation();

  return (
    <span 
      onClick={()=>{
        if(!isActive){
          changeNavigation(id)
        }
      }} 
      style={{color: isActive && "orange"}}
    >
      {t(`${title}`)?.toUpperCase()}
    </span>
  )
};

export default memo(NavigationItem);
