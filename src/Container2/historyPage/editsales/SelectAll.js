import { memo } from "react";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";

const SelectAll = ({selectAllProducts}) => {
  const {t} = useTranslation();
  
  return(
    <div>
        <label className={styles.radioDialog}>
          <span style={{display:"flex",alignItems:"center"}}>
            <input 
              type="checkbox"
              onChange={(e)=>selectAllProducts(e.target.checked)}
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
