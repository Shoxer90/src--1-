import React from 'react';
import styles from "../index.module.scss";

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const CreditCardWrapper = ({element, setOpenConfirmation}) => {
  
  return (
    <div style={{position:"relative",width:"fit-content"}}>
      <span style={{position:"absolute",right:"20px",top:"20px",zIndex:"2"}}>
        {/* <span className={styles.creditCard_bank_icon} onClick={()=>setIsOpenUpdate(true)}><DriveFileRenameOutlineIcon fontSize='large' color="whute" /></span> */}
        <span className={styles.creditCard_bank_icon} onClick={()=>setOpenConfirmation(true)}>
          <DeleteOutlineIcon fontSize='large' />
        </span>
      </span>
      {element}
    </div>
  )
}

export default CreditCardWrapper;
