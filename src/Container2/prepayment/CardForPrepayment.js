import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";
import { Button, ButtonGroup, Dialog } from "@mui/material";
import CardContent from "./CardContent";
import ConfirmDialog from "../dialogs/ConfirmDialog";
import { reverseProductNew } from "../../services/user/userHistoryQuery";
import Loader from "../loading/Loader";
import SnackErr from "../dialogs/SnackErr";


const CardForPrepayment = ({
  item,
  setOpenWindow,
  setToBasket,
  setPaymentInfo,
  paymentInfo,
  deleteBasketGoods,
  reload, setReload,
}) => {
  const {t} = useTranslation();
  const [total, setTotal] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [message, setMessage] = useState({message:"", type:""});

  const contentStyle = {
    overflowY: item?.products?.length > 8? "scroll": "",
    maxHeight:"240px"
  };

  const createBasketContent = async() => {
    if(localStorage.getItem("bascket1")) {
      setMessage({message:`${t("basket.no_new_count_prod")}`, type:"info"})
      return
    }
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
        item?.products?.map((prod) => (
          setToBasket(prod, prod?.count, true)
          
        ))
      }
      return setOpenWindow({
        prepayment: false ,
        payment: true,
        isOpen: true,
        prePaymentAmount: item?.cashAmount + item?.cardAmount
      })
    }
  };

  const removeReciept = () => {
    setIsLoad(true)
    reverseProductNew({
      products: [],
      saleDetailId: item?.id,
      cashAmount: item?.cashAmount,
      cardAmount: item?.cardAmount
    }).then((res) => {
      setIsLoad(false)
      if(res?.status === 200) {
        deleteBasketGoods()
        setMessage({message:t("dialogs.done"), type:"success"})
      }
      setOpenConfirm(false)
    })
  };

  const closeDialog = () => {
    setMessage({type:"",message:''})
    return localStorage.getItem("bascket1") ? "": setReload(!reload)
  }
 
  useEffect(() => {
    let totalCount = 0;
    item?.products.forEach((prod) => {
      totalCount += prod?.count * prod?.discountedPrice
    })
    setTotal(totalCount)
  },[]);
   
  useEffect(() => {
  closeDialog()
  },[]);

  return (
    total ? <div className={styles.container_cards_item} style={{position:"relative"}}>

      <h6>{t("history.checkNum")} {item?.recieptId}</h6>
      <div style={{height:"20px", color:"orange"}}>{item?.customer_Name ?<h6>{item?.customer_Name} {item?.customer_Phone}</h6>:""}</div>
      <div style={contentStyle}>
        {item?.products.map((prod,index) => {
          return <CardContent prod={prod} index={index} key={prod?.id} />
        })}
      </div>
      <div style={{position:"absolute",bottom:"0px"}}>
      <div style={{fontWeight:600, fontSize:"70%", margin:"7px 5px"}}> 
        {t("basket.useprepayment")} {item?.cashAmount + item?.cardAmount} 
        {t("units.amd")} / {t("basket.remainder")} {total - (item?.cashAmount + item?.cardAmount)} {t("units.amd")}
      </div>
        <ButtonGroup>
          {item?.link?.trim() ? <a href={item?.link} rel="noreferrer" target="_blank">
          <Button
            variant="contained"
            // href={item?.link} 
            sx={{background:"orange",margin:"2px", fontSize:"60%",fontWeight:600,letterSpacing:"1px"}}
            size="small"
          >
            {t("basket.seeReciept")}
          </Button>
        </a>: ""}
        <Button
          variant="contained"
          onClick={()=>setOpenConfirm(true)}
          sx={{background:"orangered",margin:"2px", fontSize:"60%",fontWeight:600,letterSpacing:"1px"}}
          // size="small"
        >
          {t("buttons.cancel")}
        </Button>
        <Button
          variant="contained"
          onClick={createBasketContent}
          sx={{background:"#3FB68A",margin:"2px", fontSize:"60%", fontWeight:600,letterSpacing:"1px"}}
          size="small"
        >
          {t("basket.completeSale")}
        </Button>
        </ButtonGroup>
        <ConfirmDialog 
          t={t}
          func={removeReciept}
          open={openConfirm}
          title={<h6>{t("history.checkNum")} {item?.recieptId}</h6>}
          close={setOpenConfirm}
          content={""}
          // nobutton={}
          question={t("dialogs.returnPrepayment")}
          />
          <Dialog open={isLoad}><Loader /></Dialog>
          <Dialog open={message?.message}><SnackErr message={message?.message} type={message?.type} close={closeDialog}/></Dialog>
      </div>
    </div>:""
  )
};

export default memo(CardForPrepayment);
