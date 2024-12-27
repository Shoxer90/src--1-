import { Avatar, Dialog } from "@mui/material";
import  React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { memo } from "react";
import { getCashiers, operationCashiers, setCashierEhdmStatus, setCashierReverseStatus } from "../../../services/user/userInfoQuery";
import styles from "./index.module.scss";
import NewCashier from "../../dialogs/NewCashier";
import UpdateCashiers from "../../dialogs/updateCashiers";
import ConfirmDialog from "../../dialogs/ConfirmDialog";
import CashiersItem from "./CashiersItem";
import SnackErr from "../../dialogs/SnackErr";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useTranslation } from "react-i18next";

const Cashiers = ({logOutFunc, cashierLimit}) => {
  const {t} = useTranslation();

  const [cashiers, setCashiers] = useState([]);
  const [openCashierDial, setOpenCashierDail] = useState(false);
  const [newCashierSuccess, setCashierSuccess] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openLimitOver, setOpenLimitOver] = useState(false);
  const [register, setRegister] = useState(false);
  const [updateDial, setUpdateDial] = useState(false);
  const [updateContent, setUpdateContent] = useState({});
  const [data, setData] = useState();
	
  const openAddNewCashier = () => {
      if(cashierLimit > cashiers?.length) {
      setOpenCashierDail(true)     
    }else{
      limitOver()
    }
  };

  const limitOver = () => {
    setOpenLimitOver(true)
  };

  const closeAddDialog = () => {
    setOpenCashierDail(false)
    setOpenLimitOver(false)
  }

  const isCashierReverse = async(id,bool) => {
    await setCashierReverseStatus(id, bool);
    const handleArr = [];
    cashiers.map((cashier) => {
      if(id === cashier?.id){
        return handleArr.push({
          ...cashier,
        reverceStatus: bool
        })
      }else{
        return handleArr.push(cashier)
      }
   })
    setRegister(!register)
  };

  const isCashierEhdm = async(id,bool) => {
    await setCashierEhdmStatus(id, bool);
    const handleArr = [];
    cashiers.map((cashier) => {
      if(id === cashier?.id){
        return handleArr.push({
          ...cashier,
          ehdmStatus: bool
        })
      }else{
        return handleArr.push(cashier)
      }
   })
    setRegister(!register)
  }


  const cashierStatus = (id, e) => {
    operationCashiers(id, e)
    let handleArr = [];
    if(e === "2"){
      handleArr = cashiers.filter((item) => item.id !== id)
      setCashiers(handleArr)
      setOpenConfirm(false)
    }else{
      cashiers.forEach((item) => {
        if(item.id === id ) {
          handleArr.push({
            ...item,
            blocked: !item.blocked
          })
        }else{
          handleArr.push(item)
        }
      })
    }
    setCashiers(handleArr)
  };

  const confirmDelete = (obj) => {
    setOpenConfirm(true)
    setData({
      id: obj?.id,
      name:`${obj?.firstName}  ${obj?.lastName}`
    })
  };

  const updateCashiers = (obj) => {
    setUpdateContent(obj)
    setUpdateDial(true)
  };

  useEffect(() => {
    getCashiers().then((res) => {
      setCashiers(res.data)
    })
  }, [register]);

  return (
    <div style={{ marginTop: "90px"}}>
      <div className={styles.cashier_title}> 
       <h1> {t("settings.cashiers")}</h1>
        <Avatar
          onClick={()=>{
            openAddNewCashier()
          }}
          sx={{ 
            "&:hover": { bgcolor: '#1976d2' , color:"white"}, 
            ml: 1,
            cursor:"pointer"
          }}
         >
         <GroupAddIcon />
        </Avatar> 
      </div>
      <div className={styles.cashier}>
        {cashiers && cashiers.map((employee, index) => ( 
          <CashiersItem 
            key={index}
            t={t} 
            employee={employee}
            confirmDelete={confirmDelete}
            cashierStatus={cashierStatus}
            updateCashiers={updateCashiers}
            isCashierReverse={isCashierReverse}
            isCashierEhdm={isCashierEhdm}
          />
        )
      )}
    </div>
    {openCashierDial && 
      <NewCashier 
        t={t}
        register={register}
        setRegister={setRegister}
        setOpenCashierDail={setOpenCashierDail}
        openCashierDial={openCashierDial}
        logOutFunc={logOutFunc}
        limitOver={limitOver}
      />
    }
    {newCashierSuccess &&
      <Dialog open={!!newCashierSuccess}>
        <SnackErr message={t("")} type="success" close={setCashierSuccess(false)}/>
      </Dialog>
    }
    <UpdateCashiers
      updateDial={updateDial}
      setUpdateDial={setUpdateDial}
      updateContent={updateContent}
      setUpdateContent={setUpdateContent}
      setRegister={setRegister}
      register={register}
      logOutFunc={logOutFunc}
    />
    <ConfirmDialog
      t={t}
      open={openConfirm}
      title={t("settings.remove")}
      question={t("settings.remove2")}
      close={setOpenConfirm}
      func={()=>cashierStatus(data?.id, "2")}
      content={data?.name}
    />
    <ConfirmDialog
      t={t} 
      func={closeAddDialog} 
      open={openLimitOver}
      close={closeAddDialog}
      question={<strong>{t("settings.cashiereLimit")}</strong>}
      nobutton={true}
    />
  </div>
  )
};

export default memo(Cashiers);
