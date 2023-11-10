import { Button, Card, Divider, FormControlLabel, Switch } from '@mui/material';
import React from 'react'
import { memo } from 'react';

import styles from "./index.module.scss";
import PayDocument from './afterPay/PayDocument';
import PaymentConfirm from './paymentDialog/PaymentConfirm';
import { useState } from 'react';
import { useEffect } from 'react';

const ClientPay = ({t, cardArr, changeActiveCard, setPayData, payData, historyAndCardData, currentCard, setCurrentCard}) => {
  const [openConfirm, setOpenConfirm] = useState();
  // const [commitment, setCommitment] = useState();

  // const [payData,setPayData] = useState({
  //   serviceType: 0,
  //   price: commitment,
  //   isBinding: true
  // });

  // const getPayInformation = async() => {
  //   return setPayData({
  //     ...payData,
  //     price: +historyAndCardData[0]?.price - historyAndCardData[0]?.serviceChargeBalance
  //   })
  // };

  // useEffect (() => {
  //   getPayInformation()
  // }, []);
  
  return (
    <Card  style={{background:"#E7E7E7"}} className={styles.card_pay_info_table}>
      {
        historyAndCardData &&
        <>
        <div>
          <span>{t("cardService.btnTitle")}</span>
          <span>{historyAndCardData[0]?.price} {t("units.amd")}</span> 
        </div>
          <Divider sx={{bgcolor:"black"}} />

        <div>
          <span>{t("cardService.amountDate")}</span>
          <span>--/--/----</span>
        </div>
          <Divider sx={{bgcolor:"black"}} />
        <div>
          <span>{t("history.paid")}</span>
          <span>{historyAndCardData[0]?.serviceChargeBalance} {t("units.amd")}</span>
        </div>
          <Divider sx={{bgcolor:"black"}} />
        <div>
          <span>{t("cardService.currentCommitment")}</span>
          <span>{historyAndCardData[0]?.price - historyAndCardData[0]?.serviceChargeBalance} {t("units.amd")}</span> 
        </div>
        <Divider sx={{bgcolor:"black"}} />
        <PayDocument t={t} title={historyAndCardData[0]?.title}/>
        <Divider sx={{bgcolor:"black"}} />
        <FormControlLabel
          sx={{ '& .MuiFormControlLabel-label': { fontSize: '80%' } }}
          control={
            <Switch 
              checked={payData?.isBinding} 
              onChange={()=>setPayData({
                ...payData,
                isBinding: !payData?.isBinding
              })} 
            />
          }
          label={t("cardService.authomatic")}
        />
        <Divider sx={{bgcolor:"black"}} />
        <Button variant="contained" sx={{m:3}} onClick={()=>setOpenConfirm(true)}>
          {t("basket.linkPayment")}
        </Button>
        <PaymentConfirm
          open={openConfirm}
          close={()=>setOpenConfirm(false)}
          cardArr={cardArr}
          initialPrice={historyAndCardData[0]?.price - historyAndCardData[0]?.serviceChargeBalance}
          changeActiveCard={changeActiveCard}
          setPayData={setPayData}
          payData={payData}
        />
      </>
      }

    </Card>
  )
}

export default memo(ClientPay);
