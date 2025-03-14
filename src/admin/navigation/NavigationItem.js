import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const NavigationItem = ({ title, isActive, id, changeNavigation}) => {
  
  const {t} = useTranslation();
  const userName = JSON.parse(localStorage.getItem("customer"))

  return (
    <span 
      onClick={()=>{
        // if(!isActive){
          changeNavigation(id)
        // }
      }} 
      style={{color: isActive && "orange"}}
    >
      {id === "01" ? userName?.store?.legalName : t(`${title}`)?.toUpperCase()}
      
    </span>
  )
};

export default memo(NavigationItem);
