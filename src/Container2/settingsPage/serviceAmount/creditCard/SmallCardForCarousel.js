import React, { memo, useState } from "react";

import ConfirmDialog from "../../../dialogs/ConfirmDialog";
import { setActiveCard } from "../../../../services/internal/InternalPayments";

import { useTranslation } from "react-i18next";

import styles from "./index.module.scss";
import { t } from "i18next";

const SmallCardForCarousel = ({card, refresh, setRefresh, index}) => {
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

  return(
    <>
      <div 
        className={styles.smallCard} 
        onClick={()=>activateAndOpenDialog(index+1)}
        style={activeCard=== index+1 ? activeStyle: null}
      >
        <div>{card?.bankName}</div>
        <div>{card?.pan}</div>
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
    </>
  )
};

export default memo(SmallCardForCarousel);
