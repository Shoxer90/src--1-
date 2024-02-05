import React, { memo, useState } from "react";

import ConfirmDialog from "../../../dialogs/ConfirmDialog";
import { setActiveCard } from "../../../../services/internal/InternalPayments";

import { useTranslation } from "react-i18next";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';


import styles from "./index.module.scss";
import { t } from "i18next";

const SmallCardForCarousel = ({card, refresh, setRefresh, index,setOpenConfirmation, setCurrentId}) => {
  // const {t} = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const [activeCard, setActivation] = useState(0);

  const changeActiveCard = () => {
    setActiveCard(card?.cardId)
    setTimeout(() => {
      setRefresh(!refresh)
    },500)
  };

  const activeStyle = {
    boxShadow: "10px 5px 5px grey",
    scale:"1.1",
    transition: "width 2s",
  };

  const activateAndOpenDialog = (index) => {
    setActivation(0)
      if(activeCard === index){
        setActivation(0)
    }else{
      setActivation(index)
      setOpenDialog(true)
    }
  };

const handleOnClick = (e) => {
  if(e.target.id === "parent" ) {
    activateAndOpenDialog(index+1)
  }else if(e.target.id) {
    setCurrentId(card?.cardId)
    setOpenConfirmation(true)
  }
}

  return(
    <div id="parent">
      <div 
        id="parent"
        className={styles.smallCard} 
        onClick={(e)=>handleOnClick(e)}
        style={activeCard=== index+1 ? activeStyle: null}
      >
        <div style={{display:"flex", justifyContent:"space-around"}} id="parent">
          <div id="parent">{card?.bankName}</div>
          <span 
            className={styles.creditCard_bank_icon} 
            id="child"
            onClick={(e)=>handleOnClick(e)}
          >
            <DeleteOutlineIcon fontSize='small' id="child" />
          </span>
        </div>
        <div id="parent">{card?.pan}</div>
      </div>
      
      <ConfirmDialog
        question={`${t("cardService.chooseCard")} ${card?.bankName}`}
        func={changeActiveCard}
        open={openDialog}
        close={()=>{
          setActivation(0)
          setOpenDialog(false)}
        }
        t={t}
        nobutton={false}
      />
    </div>
  )
};

export default memo(SmallCardForCarousel);
