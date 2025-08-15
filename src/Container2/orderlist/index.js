import { useState , useEffect , memo } from "react";
import { useLocation } from "react-router-dom";

import { basketListCreator, checkAndGetReceiptLink, printOrderReceipt } from "../../services/pay/pay";
import DenseTable from "./table";
import OrderListPayInfo from "./payInfo";
import LangSelect from "../langSelect";
import Loader from "../loading/Loader";

import { Dialog, Divider} from "@mui/material";

import styles from "./index.module.scss";

const BasketList = ({t, logOutFunc}) => {
  const search = useLocation().search;
  const saleId = new URLSearchParams(search).get('saleId')
  const [basketContent, setBasketContent] = useState([]);
  const [load,setLoad] = useState(false);
  const [isPaid,setIsPaid] = useState(false);
  const [recLink,setRecLink] = useState(false);
  const [validPage, setValidPage] = useState(true)


  const getRecUrl = async() => {
    setLoad(true)
    await printOrderReceipt(saleId).then((res) => {
      setLoad(false)
      if(res){
        setRecLink(res?.data?.link)
      }
    })
  }

  const getBasketList = async() => {
    setLoad(true)

    await basketListCreator(new URLSearchParams(search).get('saleId'))
    .then((res) => {
      if(res?.data) {
        setLoad(false)
        setBasketContent(res?.data)

        if(res?.data?.orderStatus === "2") {
          setIsPaid(true)

          if(res?.data?.receiptLink) {
            setRecLink(res?.data?.receiptLink)
          }else{
            setLoad(false)
            getRecUrl()
          }
        }
      }else{
        setValidPage(false)
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
    
      basketContent && basketContent?.mainVpos  ? 
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
            basketContent={basketContent} 
            orderStatus={basketContent?.orderStatus} 
            status={basketContent?.status}
            recLink={recLink}
            isPaid={isPaid}
            saleId={saleId}
          />
          {load && <Dialog open={load}> <Loader /></Dialog> }
        </div>
      :
      !validPage ? <h5 style={{textAlign:"center",margin:"150px"}}>{t("info.notValidPage")} </h5>:""
  )
};

export default memo(BasketList);
