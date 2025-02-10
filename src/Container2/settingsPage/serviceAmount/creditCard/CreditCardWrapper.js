import React from 'react';
import styles from "../index.module.scss";

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
const CreditCardWrapper = ({
  element, 
  cardId, 
  name, 
  isMain,
  handleOperation, 
}) => {
  const {t} = useTranslation();
  
  return (
    <div>
  <div style={{ position:"relative", width:"fit-content"}}>
    <div style={{position:"absolute",right:"10px",top:"5px",zIndex:"2"}}>
        {!isMain && 
          <span className={styles.creditCard_bank_icon} onClick={()=>handleOperation(1,cardId)}>
            <Tooltip title={t("cardService.chooseMain")} placement="bottom">
              <CreditScoreIcon fontSize='medium' color="white" />
            </Tooltip>
          </span>
        }
        <span className={styles.creditCard_bank_icon} onClick={()=>handleOperation(2,cardId,name)}>
          <Tooltip title={t("cardService.updateName")} placement="bottom">
          <DriveFileRenameOutlineIcon fontSize='medium' color="white"  title="Add" placement="bottom" />
          </Tooltip>
        </span>
        <span className={styles.creditCard_bank_icon} onClick={()=>handleOperation(3,cardId)}>
          <Tooltip title={t("settings.remove")} placement="bottom">
            <DeleteOutlineIcon fontSize='medium' />
          </Tooltip>
        </span>
      </div>
      {element}
    </div>
  </div>
  )
}

export default CreditCardWrapper;
