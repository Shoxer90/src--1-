import { memo } from "react";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";

const SelectAll = ({selectAllProducts,isAllSelected}) => {
  const {t} = useTranslation();
  
  return(
    <div  style={{fontWeight:600}}>
      <label className={styles.radioDialog}>
        <span style={{display:"flex",alignItems:"center"}}>
          <input 
            type="checkbox"
            onChange={(e)=>selectAllProducts(e.target.checked)}
            checked={isAllSelected}
          />
          <span style={{marginLeft:"15px"}}>
            {t("history.selectAll")}
          </span>
        </span>
      </label>
    </div>
  )
};

export default memo(SelectAll);
