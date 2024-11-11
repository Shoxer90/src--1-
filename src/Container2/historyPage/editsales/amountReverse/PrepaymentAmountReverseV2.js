import { memo, useEffect, useState } from "react";
import styles from "../index.module.scss";
import { useTranslation } from "react-i18next";
import { Button, ButtonGroup, Dialog } from "@mui/material";
import SnackErr from "../../../dialogs/SnackErr";
import ConfirmDialog from "../../../dialogs/ConfirmDialog";
import { reverseProductNew } from "../../../../services/user/userHistoryQuery";
import Loader from "../../../loading/Loader";

const PrepaymentAmountReverseV2 = ({
  cashAmount,
  cardAmount,
  saleType,
  reverseTotal,
  total,
  prePaymentAmount,
  conditionState,
  totalCounter,
  receiptAmountForPrepayment,
  setConditionState,
  isAllSelected,
  setIsAllSelected,
  paymentInfo,
  setPaymentInfo,
  partnerTin,
  customer_Name,
  customer_Phone,
  id,
  products,
  setToBasket,
  setOpenBasket,
  setOpenWindow,
  deleteBasketGoods,
  recieptId,
  operationType,
  setOperationType,
}) => {
  const {t} = useTranslation();
  const [remainderAfterChanges, setRemainderAfterChanges] = useState();
  const [message, setMessage] = useState({m:"", t:""});
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [remainderOfPrepaymentAfterChanges, setRemainderOfPrepaymentAfterChanges] = useState(0);
 

  const createBasketContent = async() => {
    console.log((JSON.parse(localStorage.getItem("basketExistId"))).length,"length")
    if((JSON.parse(localStorage.getItem("basketExistId"))).length) {
      setMessage({m:`${t("basket.no_new_count_prod")}`, t:"info"})
      return
    }
      setPaymentInfo({
        ...paymentInfo,
        "prePaymentSaleDetailId": id,
        "isPrepayment": false,
        "partnerTin": partnerTin,
        "customer_Name": customer_Name,
        "customer_Phone": customer_Phone,
      })
      console.log(localStorage.getItem("endPrePayment"),"localStorage.g")

    if(!localStorage.getItem("endPrePayment")) {
      localStorage.setItem("endPrePayment", JSON.stringify({
        status:true, 
        prepayment: cashAmount + cardAmount,
        id:id
      })) 
      // here is new solution will be
      if(products?.length){
        let freezeCounts = []
        products?.forEach((prod) => (
          setToBasket(prod, prod?.count, true),
          freezeCounts.push({id:prod?.productId,bar:prod?.goodCode,count:prod?.count})
        ))
        localStorage.setItem("freezeBasketCounts", freezeCounts)
        // setOpenBasket(true)
      }
      return setOpenWindow({
        prepayment: false ,
        payment: true,
        isOpen: true,
        prePaymentAmount: cashAmount + cardAmount
      })
    }
  };

  const removeReciept = () => {
    setIsLoad(true)
    reverseProductNew({
      products: [],
      saleDetailId: id,
      cashAmount: cashAmount,
      cardAmount: cardAmount
    }).then((res) => {
      setIsLoad(false)
      if(res?.status === 200) {
        deleteBasketGoods()
        setMessage({message:t("dialogs.done"), type:"success"})
      }
      setOpenConfirm(false)
    })
  };



  useEffect(() => {
    if(reverseTotal ) {
      if(receiptAmountForPrepayment - total - reverseTotal > 0) {
        setRemainderOfPrepaymentAfterChanges(0)
        setConditionState({
          ...conditionState,
          cashAmount: 0,
          cardAmount: 0,
        })
      }else if(receiptAmountForPrepayment - reverseTotal === 0) {
        return setIsAllSelected(true)
      }
      else{
        setMessage({
          m: `${t("history.reverseLimit")}
            ${t("basket.useprepayment")} ${total} ${t("units.amd")} / 
            ${t("history.receiptAmount")}
            ${receiptAmountForPrepayment-reverseTotal}
            ${t("units.amd")}`,
          t:"error"
        })
       
      } 
    }
   
  }, [reverseTotal]);

  useEffect(() => {
    if(conditionState?.cardAmount || conditionState?.cashAmount ) {
      
      setConditionState({
        ...conditionState,
        cashAmount: reverseTotal - (receiptAmountForPrepayment - total) - conditionState?.cardAmount,
      })
    }
  }, [conditionState?.cardAmount]);

  return(
    <>
    <div className={styles.conditions}>
    <div style={{width:"38%"}}>
      <div style={{color:"green",display:"flex", justifyContent:"space-between"}}>
        <span>{t("history.receiptPrice2")}</span>
        <span>{receiptAmountForPrepayment} {t("units.amd")}</span>
      </div>
      <div style={{display:"flex", justifyContent:"space-between"}}>
        <span>{t("basket.useprepayment")}</span>
        <span>{total} {t("units.amd")}</span>
      </div>
      <div style={{color:"grey", display:"flex", justifyContent:"space-between"}}>
        <span>{t("history.whichCash")}</span>
        <span>{cashAmount} {t("units.amd")}</span>
      </div>
      <div style={{color:"grey", display:"flex", justifyContent:"space-between"}}>
        <span>{t("history.whichCashless")}</span>
        <span>{cardAmount} {t("units.amd")}</span>
      </div>
      <div style={{display:"flex", justifyContent:"space-between"}}>
        <span>{t("basket.remainder")}</span> 
        <span> {receiptAmountForPrepayment - total} {t("units.amd")}</span>
      </div>
    </div>
    <div style={{width:"60%"}}>
      <div style={{display:"flex", justifyContent:"space-between"}}>
        <span>{t("history.backProdsbyDram")} </span>
        <span>{reverseTotal} {t("units.amd")}</span>
      </div> 
      <div  style={{color:"green", display:"flex", justifyContent:"space-between"}}>
        <span>{t("basket.remainder")} {`(${t("history.afterReverse")})`}</span> 
        <span>{receiptAmountForPrepayment - reverseTotal} {t("units.amd")}</span> 
      </div>
  
     
  </div>
  <ConfirmDialog 
    t={t}
    func={removeReciept}
    open={openConfirm}
    title={<h6>{t("history.checkNum")} {recieptId}</h6>}
    close={setOpenConfirm}
    content={""}
    question={t("dialogs.returnPrepayment")}
  />
          <Dialog open={isLoad}><Loader /></Dialog>
          <Dialog open={!!message?.m}><SnackErr message={message?.m} type={message?.t} close={setMessage} /></Dialog>
  </div>
      <ButtonGroup style={{margin:"5px",fontSize:"50%",height:"60px"}}>
        <Button variant="contained" 
          sx={{background:"orangered"}}
          onClick={()=>setOpenConfirm(true)}
        >
          {t("basket.reverseAll")}

        </Button>
        <Button variant="contained" 
          sx={{background:"#3FB68A"}}
          onClick={()=>{
            setOperationType({
              returnProds: false,
              returnPrepayment: true
            })
          }}
        >
          {t("basket.reverseProd")}

        </Button>
        <Button 
          variant="contained" 
          sx={{background:"orangered"}}
          onClick={()=>{
            setOperationType({
              returnPrepayment: false,
              returnProds: true
            })
          }}
        >
          {t("basket.reversePrep")}

        </Button>

        <Button 
          variant="contained" 
          sx={{background:"#3FB68A"}}
          disabled={isAllSelected}
          onClick={()=>{
            createBasketContent()
          }}
        >
          {t("basket.completeSale")}
        </Button>
      </ButtonGroup>
      </>
  )
};

export default memo(PrepaymentAmountReverseV2);
