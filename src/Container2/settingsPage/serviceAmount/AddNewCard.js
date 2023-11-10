import React, { memo } from 'react'

import CreditCard from './CreditCard';
import styles from "./index.module.scss";
import { Dialog, Divider } from '@mui/material';
import { useState } from 'react';
import NewCardForm from './NewCardForm';
import CloseIcon from '@mui/icons-material/Close';



// const AddNewCard = ({userCardInfo, t, isOpen, setIsOpen, createCreditCard}) => {
  const AddNewCard = ({
    func, 
    card,
    setCard, 
    isOpen, 
    setIsOpen, 
    t, 
    title,
    btn
    }) => {

  return (
    <div className={styles.newCard} >
      <Dialog
        open={isOpen}
        onClose={()=>setIsOpen(false)}
      >
        <div style={{display:'flex',justifyContent:"space-between",padding:"10px", alignItems:"center"}}>
          <h4>{title}</h4>
          <CloseIcon 
            sx={{":hover":{background:"#d6d3d3",borderRadius:"5px"}}}
            onClick={()=>setIsOpen(false)}
          /> 
        </div>
        <Divider sx={{bgcolor:"black"}} />
        <div className={styles.newCardContent}>
          <CreditCard userCardInfo={card} />
          <NewCardForm newCard={card} t={t} btn={btn} setNewCard={setCard} func={func} />
        </div>
      </Dialog>
    </div>
  )
}

export default memo(AddNewCard);
