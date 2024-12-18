import { memo, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";
import { Button, Dialog } from "@mui/material";
import CardContent from "./CardContent";
import { reverseProductNew } from "../../services/user/userHistoryQuery";
import Loader from "../loading/Loader";
import SnackErr from "../dialogs/SnackErr";
import ReversePrepaymentDialog from "./ReversePrepaymentDialog";


const CardForPrepayment = ({
  item,
  deleteBasketGoods,
  setOpenBasket,
  setToBasket,
  setOpenWindow,
  setPaymentInfo,
  paymentInfo,
}) => {
  const ref = useRef();
  const {t} = useTranslation();
  const [total, setTotal] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [reverseLink, setReverseLink] = useState("");
  const [message, setMessage] = useState({message:"", type:""});

  const contentStyle = {
    overflowY: item?.products?.length > 8? "scroll": "",
    maxHeight:"240px"
  };
  
  const createBasketContent = async() => {
    if((JSON.parse(localStorage.getItem("basketExistId"))).length) {
      setMessage({message:`${t("basket.no_new_count_prod")}`, type:"info"})
      return
    };
    
    setPaymentInfo({
      ...paymentInfo,
      "prePaymentSaleDetailId": item?.id,
      "isPrepayment": false,
      "partnerTin": item?.partnerTin,
      "customer_Name": item?.customer_Name,
      "customer_Phone": item?.customer_Phone,
    })
    if(!localStorage.getItem("endPrePayment")) {
      localStorage.setItem("endPrePayment", JSON.stringify({
        status:true, 
        prepayment: item?.cashAmount + item?.cardAmount,
        id: item?.id
      })) 
      // here is new solution will be
      if(item?.products?.length){
        localStorage.setItem("freezeBasketCounts", JSON.stringify(item?.products))
        item?.products?.forEach((prod) => setToBasket(prod, prod?.count, true))
      }
      setOpenBasket(true)
      return setOpenWindow({
        prepayment: false,
        payment: true,
        isOpen: true,
        prePaymentAmount: item?.cashAmount + item?.cardAmount
      })
    }
  };

  const removeAllReciept = async() => {
    let prodArr = []
    await item?.products.forEach((prod, index) => {
      prodArr.push( {
        "recieptId": index,
        "quantity": prod?.count
      })
    })
    removePartReciept({
      products: prodArr,
      saleDetailId: item?.id,
      cashAmount: item?.cashAmount,
      cardAmount: item?.cardAmount
    })
  };

  const removePartReciept = (dataInput) => {
    setReverseLink("")
    setOpenConfirm(false)
    setIsLoad(true)
    reverseProductNew(dataInput).then((res) => {
      if(res?.status === 200) {
        setReverseLink(res?.data?.reverceLink)
        setMessage({message:t("dialogs.done"), type:"success"})
      }else {
        setMessage({message:t("dialogs.wrong"), type:"error"})
      }
    })
  };

  const closeDialog = () => {
    deleteBasketGoods()
    setReverseLink("")
    setMessage({type:"",message:''})
  };
 
  useEffect(() => {
    let totalCount = 0;
    item?.products.forEach((prod) => {
      totalCount += prod?.count * prod?.discountedPrice
    })
    setTotal(totalCount)
  },[]);

  useEffect(()=> {
    reverseLink && ref.current.click()
  }, [reverseLink]);

  return (
    total ? <div className={styles.container_cards_item} style={{position:"relative"}}>

      <h6>{t("history.checkNum")}{item?.recieptId}</h6>
      <div style={{height:"20px", color:"orange"}}>
        {item?.customer_Name ?<h6>{item?.customer_Name} {item?.customer_Phone}</h6>:""}
      </div>
      <div style={contentStyle}>
        {item?.products.map((prod,index) => {
          return <CardContent prod={prod} index={index} key={prod?.id} />
        })}
      </div>
      <div style={{position:"absolute",bottom:"0px"}}>
        <div style={{fontWeight:600, fontSize:"60%", margin:"7px 5px"}}> 
          {t("basket.useprepayment")} {item?.cashAmount + item?.cardAmount} 
          {t("units.amd")} / {t("basket.remainder")} {(total - (item?.cashAmount + item?.cardAmount)).toFixed(2)} {t("units.amd")}
        </div>
          <div style={{justifyContent:"space-between", display:"flex"}}>
                <Button variant="contained" sx={{fontSize:"60%"}} size="small" >
              <a 
                style={{padding:"0px", textDecoration:"none", color:"white"}} 
                href={item?.link?.trim() ? item?.link : null} 
                rel="noreferrer"  
                target="_blank"
              >
                {t("basket.seeReciept")}
              </a>
            </Button>
            <Button
              variant="contained" 
              sx={{background:"orangered", fontSize:"56%", letterSpacing:0.3}}
                size="small"
              onClick={()=>setOpenConfirm(true)}
            >
              {t("history.prepaymentReverse")}
            </Button>
            <Button 
              variant="contained" 
              sx={{background:"#3FB68A", fontSize:"60%"}}
              onClick={()=>createBasketContent()}
              size="small"
            >
              {t("basket.completeSale")}
            </Button>
          </div>
          <ReversePrepaymentDialog 
            biteRev={removePartReciept}
            allRev={removeAllReciept}
            open={openConfirm}
            close={()=>setOpenConfirm(false)}
            item={item}
          />
          <Dialog open={isLoad}><Loader /></Dialog>
          <Dialog open={message?.message}><SnackErr message={message?.message} type={message?.type} close={closeDialog}/></Dialog>
          <a href={reverseLink} rel="noreferrer" target="_blank" ref={ref}></a>
      </div>
    </div>:""
  )
};

export default memo(CardForPrepayment);
