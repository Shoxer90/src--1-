import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "../index.module.scss";
import { Button, ButtonGroup, Dialog, Divider } from "@mui/material";
import CardContent from "./CardContent";
import { reverseProductNew } from "../../../services/user/userHistoryQuery";
import Loader from "../../loading/Loader";
import SnackErr from "../../dialogs/SnackErr";
import ReversePrepaymentDialog from "../reverse/ReversePrepaymentDialog";
import HdmStatus from "../../../modules/hdmStatus";

const CardForPrepayment = ({
  item,
  deleteBasketGoods,
  setOpenBasket,
  setToBasket,
  setOpenWindow,
  setPaymentInfo,
  paymentInfo,
  getPrepaymentList
}) => {
  const {t} = useTranslation();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [message, setMessage] = useState({message:"", type:""});
  const [messageEmpty, setMessageEmpty] = useState({
    message:"", 
    type:""
  });

  const contentStyle = {
    overflowY: item?.products?.length > 8? "scroll": "",
    maxHeight:"270px"
  };

  const createBasketContent = async(num) => {
    if((JSON.parse(localStorage.getItem("basketExistId"))).length) {
      setMessageEmpty({message:`${t("basket.no_new_count_prod")}`, type:"info"})
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
        prepayment: item?.prePaymentAmount,
        id: item?.id
      })) 
      // createEditPrepContent()
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
        isEdit: !!num,
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
    setOpenConfirm(false)
    setIsLoad(true)
    reverseProductNew(dataInput).then((res) => {
    setIsLoad(false)
      if(res?.status === 200) {
        window.open(res?.data?.reverceLink, '_blank', 'noopener,noreferrer');
        getPrepaymentList()
      }else {
        setMessage({message:t("dialogs.wrong"), type:"error"})
      }
    })
  };

  const closeDialog = () => {
    deleteBasketGoods()
    setMessage({type:"",message:''})
  };

  return (
     <div className={styles.container_cards_item}>
      <h6>
        <HdmStatus mode={item?.hdmMode} />№ {item?.recieptId} - {`${item?.date.slice(8,10)}/${item?.date.slice(5,7)}/${item?.date.slice(0,4)}`}
      </h6>
      <div style={{height:"20px", color:"orange"}}>
        {item?.customer_Name ?
          <h6>{item?.customer_Name} {item?.customer_Phone}</h6>
        :""}
      </div>
      <div style={contentStyle}>
        {item?.products.map((prod,index) => {
          return <CardContent 
            prod={prod} 
            index={index} 
            key={prod?.id} 
          />
        })}
      </div>
      <div style={{position:"absolute",bottom:"0px", width:"100%"}}>
        <div style={{fontWeight:600, fontSize:"70%", margin:"4px 5px"}}> 
          <Divider color="black" />
          <div>
            {t("basket.useprepayment")} {item?.prePaymentAmount} {t("units.amd")}
          </div>
          <div> 
            {t("basket.remainder")} {item?.remainderOfTheTotalPrice} {t("units.amd")}
          </div>
        </div>
        <div style={{display:"flex", justifyContent:"space-between"}}>
          {item?.link && 
            <Button variant="contained" sx={{fontSize:"70%",textTransform: "capitalize", background:"#28A745"}} size="small" >
              <a 
                style={{padding:"0px", textDecoration:"none", color:"white"}} 
                href={item?.link?.trim() ? item?.link : null} 
                rel="noreferrer"  
                target="_blank"
              >
                {t("basket.seeReciept") }
              </a>
          </Button>
          }
          <Button
            sx={{
              textTransform: "capitalize",
              background:"#F4A261", 
              fontSize:"70%"
            }}
            variant="contained" 
            size="small"
            onClick={()=>setOpenConfirm(true)}
          >
            {t("history.reverse")}
          </Button>
          <Button 
            variant="contained" 
            size="small"
            sx={{
              background:"rgb(63, 182, 138)", 
              fontSize:"70%",
              textTransform: "capitalize",
              letterSpacing:"1px"
            }}
            onClick={()=>{
              createBasketContent(1)
              localStorage.setItem("isEditPrepayment", JSON.stringify({
                prePaymentSaleDetailId:  item?.id,
                sales:[]
              }))
            }}
          >
            {t("buttons.edit")}
          </Button>
          <Button 
            variant="contained" 
            onClick={()=>createBasketContent(0)}
            size="small"
            sx={{
              background:"#6C757D",
                fontSize:"70%",
              textTransform: "capitalize"
            }}
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
        <Dialog open={messageEmpty?.message}><SnackErr message={messageEmpty?.message} type={messageEmpty?.type} close={setMessageEmpty}/></Dialog>
      </div>
    </div>
  )
};

export default memo(CardForPrepayment);
