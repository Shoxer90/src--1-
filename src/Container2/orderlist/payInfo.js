import { memo, useEffect, useRef, useState } from 'react';
import { Button, Dialog, Divider } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';

import styles from "./index.module.scss";
import BankButton from './button/BankButton';
import { completePaymentForOrder } from '../../services/pay/pay';
import Loader from '../loading/Loader';
import PaidButtons from './button/PaidButtons';

const OrderListPayInfo = ({basketContent, t, saleId, recieptLink, status}) => {
  const payLinkRef = useRef()
  const [activeBtn, setActiveBtn] = useState();
  const [paymentUrl, setPaymentUrl] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const createActiveBtn = (id, url) => {
    setPaymentUrl()
    setActiveBtn(id)
  };

  const payForOrder = () => {
    setIsLoading(true)
    completePaymentForOrder(saleId, activeBtn ).then((res) => {
      setIsLoading(false)
      if(res?.formUrl) {
        setPaymentUrl(res?.formUrl)
      }else{
       console.log("something went wrong. Try later")
      }
      console.log(res,"rewsss")
    })
  }

  useEffect(()=> {
    if(paymentUrl) {
      window.location.href = paymentUrl
    }
  }, [paymentUrl]);

    useEffect(()=> {
    if(!basketContent?.paymentTypes.length) {
      setActiveBtn(basketContent?.mainVpos?.paymentType)
    }
  }, []);
  console.log(status, "status")
  console.log(recieptLink, "recieptLink")

  return (
    <div className={styles.orderContainer_payContainer}>
        { basketContent?.partnerTin  && 
        <div className={styles.orderContainer_payContainer_item}>
          {t("basket.partner")}  
          <span style={{margin:"0px 7px"}}> 
            {basketContent?.partnerTin} 
          </span> 
        </div>
        }
      <div className={styles.orderContainer_payContainer_item}>
        <span>
          {t("basket.recieptPrice")}
          {basketContent?.isPrepayment ? <span style={{color:"green", fontWight:700}}>
             ({t("basket.useprepayment").toLowerCase()})
          </span>: ""}
        </span>
        <span style={{margin:"0px 7px"}}> {basketContent?.total}{t("units.amd")} </span> 
      </div>

      <div  className={styles.orderContainer_payContainer_item}>
      {t("history.cash")} 
      <span style={{margin:"0px 7px"}}> {basketContent?.cashAmount}  {t("units.amd")}</span> 
      </div>

      <div  className={styles.orderContainer_payContainer_item}>
        {t("history.card")} 
        <span style={{margin:"0px 7px"}}> {basketContent?.cardAmount}  {t("units.amd")} </span>
      </div>

      {!basketContent?.isPrepayment  && basketContent?.prePayment ? 
        <div className={styles.orderContainer_payContainer_item}>
          {t("basket.prepaymentTitle")}
          <span style={{margin:"0px 7px"}}> {basketContent?.prePayment}  {t("units.amd")} </span>
        </div> : ""
      }

      <Divider style={{ background: '#343a40', width:"60%", fontWight:600, margin:"10px 0px" }} />
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center", gap:"10px",margin:"20px"}}>

        { recieptLink ?  
          <>
            { status === 1 || (status === 2 && basketContent?.isPrepayment) && <PaidButtons recieptLink={recieptLink}/>}
            { status === 3 && <h6>{t("history.reverse")}</h6> }
          </>:
          <div>
            <div style={{fontSize:"98%",color:"EE8D1C"}} >
              <strong> 
                {t("basket.orderPayment")} {basketContent?.cardAmount} {t("units.amd")} 
              </strong>
            </div>
            <div style={{display:"flex",justifyContent:"center",alignItems:"center", gap:"10px",margin:"20px"}}>
              {basketContent?.mainVpos && 
                <BankButton
                  {...basketContent?.mainVpos}
                  createActiveBtn={createActiveBtn} 
                  activeBtn={activeBtn}
                  myTitle="Arca"
                />
              }
              {basketContent?.paymentTypes &&
                basketContent?.paymentTypes?.map((item) => {
                  return <BankButton
                    createActiveBtn={createActiveBtn} 
                    activeBtn={activeBtn}
                    {...item}
                  />
                })
              }
            </div>
          </div>
        }
        <a 
          ref={payLinkRef}
          href={paymentUrl} 
          style={{margin:"20px 0px",textDecoration:"none", color:"white", }}
          rel="noreferrer"
          target='_blank' 
        />

      </div>
      {activeBtn ?
      <div onClick={payForOrder}>
        <Button variant="contained" style={{color:"white",letterSpacing:"5px", background:"#63B48D",width:"200px",textTransform: "capitalize"}}>
          {basketContent?.isPrepayment ? t("basket.useprepayment") :t("basket.linkPayment")} 
        </Button>
      </div> :""}

      <Dialog open={isLoading}>
        <Loader />
      </Dialog>
    </div>
  )
}

export default memo(OrderListPayInfo);
