import React, { useState , useEffect , memo } from "react";
import { useLocation } from "react-router-dom";

import { basketListCreator } from "../../services/pay/pay";
import DenseTable from "./table";
import OrderListPayInfo from "./payInfo";
import OrderListPayInfo2 from "./pay/payInfo2";
import LangSelect from "../langSelect";
import Loader from "../loading/Loader";

import { Divider} from "@mui/material";

import styles from "./index.module.scss";
import PaymentRedirector from "./appJS";

const BasketList = ({t, logOutFunc}) => {
  const search = useLocation().search;
  const saleId = new URLSearchParams(search).get('saleId')
  const [basketContent, setBasketContent] = useState([]);
  const [load,setLoad] = useState(false);
  const [recieptLink,setRecieptLink] = useState("");
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
 

  const getBasketList = async() => {
    await basketListCreator(new URLSearchParams(search).get('saleId'))
    .then((res) => {
      setLoad(true)
      if(res?.data?.status === 1 && res?.data?.receiptLink) {
        setRecieptLink(res?.data?.receiptLink)
        setBasketContent(res?.data)
        // return window.location.href = res?.data?.receiptLink
      }else{
        setBasketContent(res?.data)
      }
   })
  };

  
  window.onerror = function (message, source, lineno, colno, error) {
    console.error("Global error caught:", {
      message,
      source,
      lineno,
      colno,
      error,
    });
  }
    

  useEffect(() => {
    logOutFunc()
    getBasketList() 
  }, []);

useEffect(() => {
  const handlePageShow = (event) => {
    if (event.persisted || performance.getEntriesByType("navigation")[0]?.type === "back_forward") {
      // Safari iOS: принудительно обновить при возврате "назад"
      window.location.reload();
    }
  };

  window.addEventListener("pageshow", handlePageShow);
  return () => window.removeEventListener("pageshow", handlePageShow);
}, []);

  return(
    !load ? <Loader /> :
      basketContent?.mainVpos ? 
          <div className={styles.orderContainer}> 
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
            <OrderListPayInfo t={t} basketContent={basketContent} saleId={saleId} recieptLink={basketContent?.receiptLink} status={basketContent?.status}/>
        </div>
        :<h5 style={{textAlign:"center",margin:"150px"}}> Էջը հասանելի չէ </h5>
  )
};

export default memo(BasketList);
