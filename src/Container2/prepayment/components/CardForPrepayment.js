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
import PdfReceiptDialog from "../../historyPage/newHdm/PdfReceiptDialog";

const CardForPrepayment = ({
  item,
  deleteBasketGoods,
  setOpenBasket,
  setToBasket,
  setOpenWindow,
  setPaymentInfo,
  paymentInfo,
  getPrepaymentList,
  from, setFrom
}) => {
  const {t} = useTranslation();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [message, setMessage] = useState({message:"", type:""});
  const [messageEmpty, setMessageEmpty] = useState({
    message:"", 
    type:""
  });
  const [openPdfDial, setOpenPdfDial] = useState({
    status: false,
    link:""
  })
  

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
      "emarks": []
    })
    if(!localStorage.getItem("endPrePayment")) {
      localStorage.setItem("endPrePayment", JSON.stringify({
        status:true, 
        prepayment: item?.prePaymentAmount,
        id: item?.id
      })) 
      // here is new solution will be
      if(item?.products?.length){
        let emarkCount = 0
        localStorage.setItem("freezeBasketCounts", JSON.stringify(item?.products))
        // item?.products?.forEach((prod) => setToBasket(prod, prod?.count, true))
        item?.products?.forEach((prod) =>{
          if(prod?.isEmark) {
            emarkCount+=1*prod?.count
          }
           setToBasket(prod, prod?.count, true)
        })
        localStorage.setItem('needEmark', emarkCount)
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
        // window.open(res?.data?.reverceLink, '_blank', 'noopener,noreferrer');
        // window.location.href = res?.data?.reverceLink

        setOpenPdfDial({
          status:true,
          link: res?.data?.reverceLink,
          message: res?.data?.res?.message
        })


        // getPrepaymentList()
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
        <ButtonGroup >
          {item?.link && 
            <Button variant="contained" sx={{width:"30%",fontSize:"80%",textTransform: "capitalize", background:"#28A745"}}  >
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
              width:"34%",
              fontSize:"80%"
            }}
            variant="contained" 
            onClick={()=>setOpenConfirm(true)}
          >
            {t("history.reverse")}
          </Button>
          <Button 
            variant="contained" 
            onClick={()=>{
              setFrom("")
              createBasketContent(0)
            }}
            sx={{
              background:"#6C757D",
              width:"34%",
                fontSize:"80%",
              textTransform: "capitalize"
            }}
          >
            {t("basket.completeSale")}
          </Button>
        </ButtonGroup>
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
      <PdfReceiptDialog
        open={openPdfDial?.link}
        close={()=>{
          setOpenPdfDial({status:false,link:""})
          getPrepaymentList()
        }}
        func={()=>{
          window.open( openPdfDial?.link, '_blank', 'noopener,noreferrer')
          setOpenPdfDial({status:false,link:""})
        }}
        text={openPdfDial?.message}

      />
    </div>
  )
};

export default memo(CardForPrepayment);
