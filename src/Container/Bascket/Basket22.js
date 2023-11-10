import React, { forwardRef, useEffect, useState, memo } from "react";
import BascketItem from "./BascketItem";
import { AppBar, Dialog, DialogContent, Divider, IconButton, Slide } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { Box } from "@mui/system";
import styles from "./index.module.scss"
import { basketListUrl, payRequest, payRequestQR } from "../../services/pay/pay";
import QRPay from "../../Container2/historyPage/hdm/QRPay";
import PhonePay from "../../Container2/historyPage/hdm/PhonePay.js";
import Loader from "../../Container2/loading/Loader";
import SnackErr from "../../Container2/dialogs/SnackErr";
import moment from "moment";

import PayQRLink from "../../Container2/historyPage/hdm/PayQRLink";
import { cheackProductCount, productQuery } from "../../services/products/productsRequests";
import BasketPay from "./BasketPay";
import BasketFooter from "./BasketFooter";
import Receipt from "../../Container2/historyPage/hdm/receipt";
import { CASH_LIMIT } from "../../services/baseUrl";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});
const  Bascket22 = ({
  t,
  userName,
  logOutFunc,
  changeCountOfBasketItem,
  loadBasket,
  openBasket,
  setOpenBasket,
  basketContent,
  deleteBasketGoods,
  setDataGroup,
  deleteBasketItem,
  setFlag,
  flag,
  setContent,
  setBasketContent
}) => {
  const [screen, setScreen] = useState();
  const [saleData, setSaleData] = useState();
  const [loader, setLoader] = useState(false);
  const [totalPrice,setTotalPrice] = useState(0);
  const [openHDM, setOpenHDM] = useState(false);
  const [openQr,setOpenQr] = useState(false);
  const [openLinkQR, setOpenLinkQr] = useState(false);
  const [qrString, setQrString] = useState("");
  const [trsf, setTrsf] = useState("");
  const [openPhonePay,seOpenPhonePay] = useState(false);
  const [message,setMessage] = useState();
  const [messageWithRefresh,setMessageWithRefresh] = useState();
  const [type,setType] = useState();
  const [qrData, setDataQr] = useState("");
  const [singleClick,setSingleClick] = useState({});
  const [paymentInfo, setPaymentInfo] = useState({
    "discount": 0,
    "discountType": 0,
    "partnerTin": "",
    "phoneNumber": ""
  });
  const[isEmpty,setIsEmpty] = useState(false);

  const closePhoneDialog = () => {
    seOpenPhonePay(false)
    setOpenBasket(false)
  };
  
  const closeQr = () => {
    closeRecieptAndRefresh()
    setMessageWithRefresh()
   return setTrsf()
  };

const checkDiscountVsProdPrice = () => {
  basketContent.map((item) => {
    if((item.count * item?.price - (item.count * item?.price * paymentInfo?.discount/100)) < 1){
      createMessage("error", t("basket.total_zero"))
    }
    return item
  })
};

  const handleChangeInput = (e) => {
    if(e.target.name === "discount") {
      checkDiscountVsProdPrice()
      basketContent.map((item) => {
        if((item.count * item?.price - (item.count * item?.price * e.target.value/100)) < 1){
          createMessage("error", t("basket.total_zero"))
        }
        return item
      })
      if(e.target.value > 99) {
       return setPaymentInfo({
          ...paymentInfo,
          [e.target.name]:99
        })
      }
      setPaymentInfo({
        ...paymentInfo,
        [e.target.name]: +Math.round(e.target.value)
      })
    }else{
      setPaymentInfo({
        ...paymentInfo,
        [e.target.name]:e.target.value
      })
    }
  };

  const createPaymentSales = async() => {
    setSingleClick({})
    setIsEmpty(false)
    createMessage("","")
    let total = 0
      const arr = await basketContent.map((item) => {
        total += (item.discountPrice * item.count)
        if(item?.count === "" || item?.count === 0){
          setIsEmpty(true)
        }
        return {
          id: item.id,
          count: +item.count
        }
      })
      setTotalPrice(total)
      if(total > CASH_LIMIT){
        setType("error")
        setMessage( t("authorize.errors.cashlimit"))
      }
      setPaymentInfo({
        ...paymentInfo,
        "sales": arr
      })
  };

  const [avail,setAvail] = useState([]);

  const checkAvail = async() => {
    setAvail([])
    const available = await cheackProductCount(paymentInfo?.sales)
    available.map((item) => {
     return item?.status === false ?
        setAvail([...avail,item?.id]) : null
    })
  };

  const qashCardPayment = async(type) => {
    createPaymentSales() 
    if(isEmpty){
      return createMessage("error", t("authorize.errors.emptyfield"))
    }
    if(paymentInfo.discount !==0 && !Boolean(paymentInfo.discount)){
      createMessage("error", t("authorize.errors.discount"))
      setPaymentInfo({
        ...paymentInfo,
        "discount": 0
      })
      return
    }else if(paymentInfo.discount> 99) {
      setMessage(`${t("dialogs.sorry")}, ${t("authorize.errors.discount2")}`)
      return
    }
    if((totalPrice - (totalPrice * (paymentInfo?.discount)) / 100).toFixed(2) >= 1) {
      if(!avail?.length){
        setLoader(true)
        await payRequest(paymentInfo, type).then((result)=> {
          setLoader(false)
          if(result === 401){
            logOutFunc()
            return
          }else if(result === 500){
            setType("error")
            setMessage(`${t("dialogs.sorry")}, ${t("dialogs.wrong")}`)
            return
          }else if (result?.res){
            setSaleData(result)
            setPaymentInfo({
              "discount": 0,
              "discountType": 0,
              "partnerTin": "",
              "phoneNumber": ""
  })
            setLoader(false)
            setOpenHDM(true)
            loadBasket()
          }else if(result === 400){
            checkAvail()
            createMessage("error",t("authorize.errors.soldOut"))
          }
        })
      }
      setLoader(false)
    }else{
      createMessage("error", t("basket.total_zero"))
    }
  };

  const closeRecieptAndRefresh = async() => {
    setOpenBasket(false)
    await productQuery("GetAvailableProducts",1).then((res) => {
      setContent(res?.data)
    })
    setOpenHDM(false)
    deleteBasketGoods()
    setFlag(flag+1)
  };

  const closeDialog = async() => {
    await setMessage()

    if(type !== "error") {
      deleteBasketGoods() 
      setOpenBasket(false)
    } 
    setType()
  };

  const  closeLinkQrAndRefresh = () => {
    setOpenLinkQr(false)
    setOpenBasket(false)
    deleteBasketGoods()
    setPaymentInfo({
      "discount": 0,
      "discountType":0,
      "partnerTin": "",
      "phoneNumber": ""
  })
    createPaymentSales()
    setDataGroup("GetAvailableProducts")
  };
  
  const payByQr = async() => { 
    setLoader(true)
    if(paymentInfo.discount !==0 && !Boolean(paymentInfo.discount)){
      createMessage("error", t("authorize.errors.discount"))
      setPaymentInfo({
        ...paymentInfo,
        "discount": 0
      })
      return
    }else if(paymentInfo?.discount > 99) {
      setMessage(`${t("dialogs.sorry")}, ${t("authorize.errors.discount2")}`)
      // return
    }
    else if((totalPrice - (totalPrice * (paymentInfo?.discount)) / 100).toFixed(2) >= 1) {
      payRequestQR(paymentInfo).then((res) => {
        setLoader(false)
        if(res === 401){
          logOutFunc()
        }else if(res.status === 203){
          createMessage("error", t("authorize.errors.bank_agreement"))
        }else{
          setQrString(res?.data?.content?.qr_text)
          return setTrsf(res?.data?.content?.px_transfer_id)
        }
      }) 
      setOpenQr(true)
      setFlag(1)
      }else{
        setLoader(false)
        createMessage("error", t("basket.total_zero"))
      }
  };

  const phonePay = () => {
    if(paymentInfo.discount !==0 && !Boolean(paymentInfo.discount)){
      createMessage("error", t("authorize.errors.discount"))
      // amountNan()
      setPaymentInfo({
        ...paymentInfo,
        "discount": 0
      })
      return
    }else if(paymentInfo.discount > 99) {
      setMessage(`${t("dialogs.sorry")}, ${t("authorize.errors.discount2")}`)
      return
    }else if((totalPrice - (totalPrice * (paymentInfo?.discount || 0)) / 100).toFixed(2)>=1){
      seOpenPhonePay(true)
    }else{
      createMessage("error", t("basket.total_zero"))
    }
  };

  const payByUrl = async() => {
    if(isNaN(paymentInfo.discount)){
     return createMessage("error", t("authorize.errors.discount"))
    }else if((totalPrice - (totalPrice * (paymentInfo?.discount || 0)) / 100).toFixed(2)>=1){
     await basketListUrl(paymentInfo).then((res) => {
      if(res === 401){
          logOutFunc();
        }else if(res?.status === 203){
          createMessage("error", t("authorize.errors.bank_agreement"));
        }else{
          setDataQr(res);
          setOpenLinkQr(true)
        }
      })
    }else{
      createMessage("error", t("basket.total_zero"))
    }
  };

  window.onresize = function(event) {
    setScreen(window.innerWidth)
  };
  
  const createMessage = (type,message) => {
    setType(type)
    setMessage(message)
    return  setTimeout(() => {
      setMessage()
    },12000)
  };

  useEffect(()=> {
    setMessage()
    createPaymentSales()
    return setSingleClick({})
  }, [basketContent,openBasket]);

  useEffect(() => {
    setSingleClick({})
  },[paymentInfo]);

  useEffect(() => {
    setScreen(window.innerWidth)
  },[]);

  return (
    <Dialog
      open={openBasket}
      style={{
        background:"rgb(40,167,69,0.15)", 
      }}
      onClose={loader ? null : ()=>{
        setOpenBasket(false)
        setMessage()
      }}
      TransitionComponent={Transition}
    >
      { loader ? <Loader />: 
        <AppBar 
          sx={{ 
            width: (screen > 800) ? "500px":(screen > 500) ? "400px": (screen > 400)? "300px":"250px", 
            height:"100%",
            overFlowY:"scroll",
            backgroundColor:"#F5F5F5", 
            color:"gray", 
          }}
        >
          <Box className={styles.bask_container}>
            <div className={styles.bask_container_header}>
              <h3>{t("basket.title")}</h3>
              <IconButton
                onClick={()=>setOpenBasket(false)}
                style={{color:"gray", left:2}}
              > 
                <CloseIcon />
              </IconButton>
            </div>
            { basketContent?.length ? 
              <div className={styles.bask_container_body}>
                <DialogContent 
                  className={styles.bask_container_body_content}  
                  style={{margin:0,padding:0}}
                  dividers={window.scroll === 'paper'}
                >
                  <Divider style={{margin:1,backgroundColor:"gray"}}/>
                  {basketContent && basketContent.map((el, i) => (
                    <BascketItem 
                      changeCountOfBasketItem={changeCountOfBasketItem}
                      deleteBasketItem={deleteBasketItem}
                      loadBasket={loadBasket}
                      key={i}
                      el={el}
                      t={t}
                      index={i}
                      screen={screen}
                      setFlag={setFlag}
                      flag={flag}
                      setSingleClick={setSingleClick}
                      singleClick={singleClick}
                      avail={avail}
                      setAvail={setAvail}
                    />))
                  }
                </DialogContent>
                {message && 
                  <Dialog open={message}>
                    <strong>

                      <SnackErr message={message} type={type} close={closeDialog} />
                    </strong>
                  </Dialog>
                }
                {
                  messageWithRefresh && 
                  <Dialog open={message}>
                  <SnackErr message={message} type="success" close={closeQr} />
                </Dialog>
                }
               
                <div className={styles.bask_container_body_footer}>
                  <Divider flexItem  sx={{bgcolor:"black"}} />
                  <BasketFooter 
                    totalPrice={totalPrice}
                    createMessage={createMessage}
                    t={t}
                    deleteBasketGoods={deleteBasketGoods}
                    paymentInfo={paymentInfo} 
                    handleChangeInput={handleChangeInput}
                  />
                  <BasketPay 
                    qashCardPayment={qashCardPayment}
                    payByQr={payByQr}
                    phonePay={phonePay}
                    payByUrl={payByUrl}
                    singleClick={singleClick}
                    setSingleClick={setSingleClick}
                  />
                </div>
              </div> : 
              <div className={styles.emptybasket}>
                <h5>{t("basket.empty")}</h5>
              </div>
            }           
          </Box>
          <Receipt
            t={t}
            logOutFunc={logOutFunc}
            totalPrice={totalPrice}
            date={moment(saleData?.res?.printResponse?.time).format()}
            saleData={saleData} 
            openHDM={openHDM} 
            setOpenHDM={closeRecieptAndRefresh}
            userName={userName}
          />
          {trsf && <QRPay 
            message={message}
            setMessage={setMessage}
            closeRecieptAndRefresh={closeRecieptAndRefresh}
            t={t}
            openQr={openQr} 
            closeQr={closeQr} 
            value={qrString} 
            trsf={trsf} 
            deleteBasketGoods={deleteBasketGoods} 
            setOpenBasket={setOpenBasket}
            totalPrice={(totalPrice - (totalPrice * paymentInfo?.discount) / 100).toFixed(2)}
            setTrsf={setTrsf}
            loadBasket={loadBasket}
          />}
          <PhonePay
            t={t}
            logOutFunc={logOutFunc}
            loadBasket={loadBasket}
            deleteBasketGoods={deleteBasketGoods}
            openPhonePay={openPhonePay}
            paymentInfo={paymentInfo}
            setPaymentInfo={setPaymentInfo}
            closePhoneDialog={closePhoneDialog} 
            handleChangeInput={handleChangeInput} 
            price={(totalPrice - (totalPrice * (paymentInfo?.discount || 0)) / 100).toFixed(2)}
            singleClick={singleClick}
            setSingleClick={setSingleClick}
          />
        {openLinkQR &&
          <PayQRLink 
            t={t}message={message}
            setMessage={setMessage}
            qrData={qrData}
            totalPrice={(totalPrice - (totalPrice * (paymentInfo?.discount)) / 100).toFixed(2)}
            closeLinkQrAndRefresh={closeLinkQrAndRefresh}
          />
        }
      </AppBar>}
    </Dialog>
  );
}

export default memo(Bascket22);
