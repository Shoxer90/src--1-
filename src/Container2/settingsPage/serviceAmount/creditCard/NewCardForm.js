import { Button, TextField } from '@mui/material';
import React,{ memo } from 'react';

import styles from "../index.module.scss";

const NewCardForm = ({setNewCard, btn, newCard,func,t}) => {

  const handleChange = (e) => {
    setNewCard({
      ...newCard,
      [e.target.name]:e.target.value
    })
   
  };

  return (
    <>
    <div className={styles.newCardForm} >
      <TextField 
        name="bank"
        defaultValue="jklk"
        label={t("cardService.inputs.cardName")}
        value={newCard?.bank}
        onChange ={(e)=>handleChange(e)}
      />
        <TextField 
        name="name"
        label={t("settings.name")}
        value={newCard?.name}
        onChange ={(e)=>handleChange(e)}
      />
        <TextField 
        name="surname"
        label={t("settings.surname")}
        value={newCard?.surname}
        onChange ={(e)=>handleChange(e)}
      />
        <TextField 
        name="cardNumOrigin"
        type="number"
        value={newCard?.cardNumOrigin}
        label={t("cardService.inputs.cardNumber")}
        onChange ={(e)=>{
          if(e.target.value?.length > 16){
            return
          }handleChange(e)
        }}
      />
      <TextField 
        label={t("cardService.inputs.expMonth")}
        name="expMonth"
        type="number"
        value={newCard?.expMonth}
        onChange ={(e)=>{
          if(e.target.value?.length > 2){
            return
          }
          handleChange(e)
        }}
      />
        <TextField 
        name="expYear"
        label={t("cardService.inputs.expYear")}
        type="number"
        value={newCard?.expYear}
        onChange ={(e)=>{
          if(e.target.value?.length > 2){
            return
          }
          handleChange(e)
        }}
      />
      <TextField 
        name="cvv"
        label="CVV"
        value={newCard?.cvv}
        type="password"
        inputProps={{ maxLength: 3 }}
        onChange ={(e)=>{
          if(e.target.value?.length > 3){
            return
          }
          handleChange(e)}
        }
      />
    </div>
    <Button type="sumbmit" variant="contained" onClick={()=>func(newCard)} sx={{m:3}}>
      {btn}
    </Button>
  </>
  )
}

export default memo(NewCardForm);
