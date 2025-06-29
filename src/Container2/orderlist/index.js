import { useState , useEffect , memo } from "react";
<<<<<<< HEAD
import { useState , useEffect , memo } from "react";
=======
>>>>>>> 6b7c59e216853be088432cff0183f2663a6fa3a7
import { useLocation } from "react-router-dom";

import { basketListCreator, checkAndGetReceiptLink } from "../../services/pay/pay";
import DenseTable from "./table";
import OrderListPayInfo from "./payInfo";
import LangSelect from "../langSelect";
import Loader from "../loading/Loader";

import { Divider} from "@mui/material";

import styles from "./index.module.scss";

const BasketList = ({t, logOutFunc}) => {
  const search = useLocation().search;
  const saleId = new URLSearchParams(search).get('saleId')
  const [basketContent, setBasketContent] = useState([]);
  const [load,setLoad] = useState(false);

  const getBasketList = async() => {
    await basketListCreator(new URLSearchParams(search).get('saleId'))
    .then((res) => {
      setLoad(true)
      if(res?.data?.status === 1 && res?.data?.receiptLink) {
        // setRecieptLink(res?.data?.receiptLink)
<<<<<<< HEAD
        // setRecieptLink(res?.data?.receiptLink)
=======
>>>>>>> 6b7c59e216853be088432cff0183f2663a6fa3a7
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
    
<<<<<<< HEAD
    
=======
>>>>>>> 6b7c59e216853be088432cff0183f2663a6fa3a7
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
<<<<<<< HEAD
=======

  // useEffect(()=> {
  //   if(!recieptLink && basketContent?.orderStatus === "2") {
  //     checkAndGetReceiptLink(saleId)
  //   }
  // }, []);
>>>>>>> 6b7c59e216853be088432cff0183f2663a6fa3a7

  // useEffect(()=> {
  //   if(!recieptLink && basketContent?.orderStatus === "2") {
  //     checkAndGetReceiptLink(saleId)
  //   }
  // }, []);

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
          <OrderListPayInfo 
            t={t} 
            basketContent={basketContent} 
            saleId={saleId} 
            recieptLink={basketContent?.receiptLink} 
            orderStatus={basketContent?.orderStatus} 
            status={basketContent?.status}
          />
      </div>
      :<h5 style={{textAlign:"center",margin:"150px"}}> Էջը հասանելի չէ </h5>
  )
};

export default memo(BasketList);
