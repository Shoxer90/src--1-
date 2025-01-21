import React, { memo, useState } from "react";
import { Button, Card, FormControlLabel, Switch } from "@mui/material";
import styles from "./index.module.scss";

const CashiersItem = ({
  t, 
  employee,
  confirmDelete, 
  cashierStatus, 
  updateCashiers, 
  isCashierReverse, 
  isCashierEhdm,
  isCashierHdm
}) => {
  const [seePsw, setSeePsw] = useState(false);

  return(
    <Card 
      style={{background:"rgb(247, 246, 246)"}}
      className={styles.cashier_item} key={employee.id}
    >
      <div className={styles.cashier_item_info}>
        <span><strong>{t("settings.name")}</strong></span>
        <span><strong> {employee.firstName}</strong></span>
      </div>
      <div className={styles.cashier_item_info}>
        <span><strong>{t("settings.surname")}</strong></span>
        <span><strong>{employee.lastName}</strong></span>
      </div>
      <div className={styles.cashier_item_info}>
        <span><strong>{t("authorize.email")}</strong></span>
        <span style={{fontSize:"80%"}}> {employee.email}</span>
      </div>
      <div className={styles.cashier_item_info}>
        <span><strong>{t("settings.login")}</strong></span>
        <span>{employee.userName} </span>
      </div>
      <div className={styles.cashier_item_info} style={{cursor:"pointer"}}>
        <span><strong>{t("settings.password")}</strong></span>
        <span onClick={()=>setSeePsw(!seePsw)}>
          {seePsw ? employee.password : "*********************".slice(0,employee.password?.length)}
        </span>
      </div>
        <span><strong>{t("settings.status")} </strong></span>
        <div style={{textAlign:"start",display:"flex",flexFlow:"column"}}>
        <FormControlLabel 
          control={
            <Switch  
              checked={!employee.blocked}
              onChange={(e)=>cashierStatus(employee.id, e.target.value)}
              value={employee.blocked === false? "0" : "1"}
            />
          }
          label={employee.blocked ? t("settings.blocked") : t("settings.active")} 
        />
        {/* FOR HDM */}
        <div>
         <FormControlLabel 
          control={
            <Switch  
              checked={employee?.physicalHdmStatus}
              onChange={(e)=>isCashierHdm(employee.id,e.target.checked)}
              value={employee.ehdmStatus}
            />
          }
          label={t("settings.hdmAuth")} 
        />
        <span style={{fontSize:'65%',color:"green"}}>({t("settings.notAvailableInWeb")})</span>
        </div>
        {/*  */}
        <FormControlLabel 
          control={
            <Switch  
              checked={employee?.ehdmStatus}
              onChange={(e)=>isCashierEhdm(employee.id,e.target.checked)}
              value={employee.ehdmStatus}
            />
          }
          label={t("settings.ehdmAuth")} 
        />
         <FormControlLabel 
          control={
            <Switch 
              checked={employee.reverceStatus}
              onChange={(e) => isCashierReverse(employee?.id, e.target.checked) }
              value={employee.reverceStatus}
            />
          }
          label={t("settings.reverseAuth")} 
        />
        </div>
      <div className={styles.cashier_item_info}>
        <Button 
          value="2"
          onClick={()=>confirmDelete(employee)}
          sx={{textTransform: "capitalize"}}
        >
          {t("buttons.remove")}
        </Button>
        <Button 
          onClick={(e)=>updateCashiers(employee)}
          sx={{textTransform: "capitalize"}}

        >
          {t("buttons.update")}
        </Button>
      </div>
    </Card>
  )
};

export default memo(CashiersItem);
