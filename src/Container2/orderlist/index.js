import React, { useState , useEffect , memo } from "react";
import { useLocation } from "react-router-dom";

import { basketListCreator } from "../../services/pay/pay";
import DenseTable from "./table";
import OrderListPayInfo from "./payInfo";
import LangSelect from "../langSelect";
import Loader from "../loading/Loader";

import {Divider} from "@mui/material";

import styles from "./index.module.scss";

const BasketList = ({t}) => {
  const search = useLocation().search;
  const [basketContent, setBasketContent] = useState([]);
  const [load,setLoad] = useState(false);

  const getBasketList = async() => {
    await basketListCreator(new URLSearchParams(search).get('saleId'))
    .then((res) => {
      setLoad(true)
      if(res?.data?.status === 1 && res?.data?.receiptLink) {
        return window.location.href = res?.data?.receiptLink
      }else{
        setBasketContent(res?.data)
      }
   })
  };

  useEffect(() => {
    getBasketList() 
  }, []);

  return(
    !load ? <Loader /> :
    basketContent?.payXPaymentLink ? <div className={styles.orderContainer} > 
      <span style={{display:"flex", justifyContent:"flex-end"}}>
        <LangSelect size={"22px"} />
      </span>
      <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <img src={basketContent?.storeLogo || "/defaultAvatar.png"}  alt="" className={styles.orderContainer_img}/>
        <h5>{basketContent?.storeName}</h5>
      </div>
      {basketContent?.isPrepayment && <h5>{t("basket.useprepayment")}</h5>}
      <div style={{display:"flex", justifyContent:"center", margin:"5px auto",fontSize:"110%"}}>
        <span>
          {t("productinputs.orderList")}
        </span>
        <span style={{margin: "0 5px", fontWeight:600}}>&#8470;  {basketContent?.saleId}</span>
        
      </div>
      <DenseTable basketContent={basketContent} />
      <Divider sx={{bcolor:"black"}} />
      <OrderListPayInfo  t={t} basketContent={basketContent}/>
    </div>:<h5 style={{textAlign:"center",margin:"150px"}}> Էջը հասանելի չէ </h5>
  )
};

export default memo(BasketList);
// 128