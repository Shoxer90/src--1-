import React, { forwardRef, useEffect, useState, memo } from "react";
import { AppBar, Dialog, DialogContent, Divider, Slide } from "@mui/material";
import { Box } from "@mui/system";
import styles from "./index.module.scss"
import { basketListUrl, payRequestQR, saleProductFromBasket } from "../../services/pay/pay";
import QRPay from "../../Container2/historyPage/hdm/QRPay";
import PhonePay from "../../Container2/historyPage/hdm/PhonePay.js";
import Loader from "../../Container2/loading/Loader";
import SnackErr from "../../Container2/dialogs/SnackErr";
import moment from "moment";

import PayQRLink from "../../Container2/historyPage/hdm/PayQRLink";
import { cheackProductCount, productQuery } from "../../services/products/productsRequests";
import Receipt from "../../Container2/historyPage/hdm/receipt";
import BasketHeader from "./header/BasketHeader";
import BasketContent from "./content/BasketContent";
import AdvancePayment from "./payment/AdvancePayment";
import PayButtons from "./operation/PayButtons";
import ProductPayment from "./payment/ProductPayment";
import SearchBarcode from "../../SearchBarcode";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});
const  Bascket = ({
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
  byBarCodeSearching,
  setFrom,
  searchValue,setSearchValue
}) => {
  const [screen, setScreen] = useState(window.innerWidth);
  const [saleData, setSaleData] = useState();
  const [loader, setLoader] = useState(false);
  const [totalPrice,setTotalPrice] = useState(0);
  const [openHDM, setOpenHDM] = useState(false);
  const [openQr,setOpenQr] = useState(false);
  const [openLinkQR, setOpenLinkQr] = useState(false);
  const [qrString, setQrString] = useState("");
  const [trsf, setTrsf] = useState("");
  const [openPhonePay,setOpenPhonePay] = useState(false);
  const [message,setMessage] = useState();
  const [messageWithRefresh,setMessageWithRefresh] = useState();
  const [type,setType] = useState();
  const [qrData, setDataQr] = useState("");
  const [singleClick,setSingleClick] = useState({});
  const [paymentInfo, setPaymentInfo] = useState({
    discount:0,
    discountType: 0,
    cashAmount: totalPrice,
    cardAmount: 0,
    prePaymentAmount: 0,
    partialAmount: 0,
    partnerTin: "",
    phone: "",
    sales: []
  });

  const[isEmpty,setIsEmpty] = useState(false);
  const [avail,setAvail] = useState([]);

  const cleanBasketInputs = () => {
    setPaymentInfo({
      "discount": 0,
      "discountType": 0,
      "partnerTin": "",
      "phoneNumber": ""
  })
  }

  const closePhoneDialog = () => {
    setOpenPhonePay(false)
    setOpenBasket(false)
  };
  
  const closeQr = () => {
    closeRecieptAndRefresh()
    setMessageWithRefresh()
   return setTrsf()
  };

  const checkDiscountVsProdPrice = (disc) => {
    basketContent.map((item) => {
      if((item.count * item?.price - (item.count * item?.price * disc/100)) < 1){
        setSingleClick({pointerEvents:"none"})
        createMessage("error", t("basket.total_zero"))
      }
      return item
    })
  };

  const createPaymentSales = async() => {
    setSingleClick({})
    setIsEmpty(false)
    createMessage("","")
    let total = 0
    let arr = []
    basketContent.forEach((item) => {
      total += (item?.discountPrice * item?.count)
      if(item?.count === "" || item?.count == 0){
        return setIsEmpty(true)
      }else{ 
        arr.push({count:item?.count,id:item?.id})
      }
    })
    setTotalPrice(total)
  };

// check is product in basket not sold out

  const checkAvail = async() => {
    setAvail([])
    const available = await cheackProductCount(paymentInfo?.sales)
    available.map((item) => {
     return item?.status === false ?
        setAvail([...avail,item?.id]) : null
    })
  };

//  newSale with 2 roots-for prepayment ehdm(2) and for pay ehdm(1)
  const newSaleValidate = () => {
    if(isEmpty){
      setType("error")
      setMessage(t("basket.nullishQuant"))
      return false
    } 
    if(paymentInfo.discount !==0 && !Boolean(paymentInfo.discount)){
      createMessage("error", t("authorize.errors.discount"))
      setPaymentInfo({
        ...paymentInfo,
        "discount": 0
      })
      return false
    }else if(paymentInfo.discount> 99) {
      setMessage(`${t("dialogs.sorry")}, ${t("authorize.errors.discount2")}`)
      return false
    }
    if(((totalPrice - (totalPrice * (paymentInfo?.discount)) / 100).toFixed(2) >= 1) && !avail?.length){
      return true
    }else{
      createMessage("error", t("basket.total_zero"))
      return false
    }
  };

  const responseTreatment = async(result, saletype) => {
    setPaymentInfo({
      ...paymentInfo,
      cardAmount:0,
      cashAmount:0,
      prePaymentAmount:0
    })
    console.log(result,"RES IN INDEX")
    setLoader(false)
    if(result === 401){
      logOutFunc()
      return
    }else if(result === 500 || result === 0){
      setType("error")
      setMessage(`${t("dialogs.sorry")}, ${t("dialogs.wrong")}`)
      return
    }else if(result === 400){
      checkAvail()
      return createMessage("error",t("authorize.errors.soldOut"))
    }else if(result === 406){
      checkAvail()
      createMessage("error", t("basket.total_zero"))
      return false
    }
    
    else if(saletype === 1 && result?.res?.printResponseInfo ) {
      setSaleData(result)
      cleanBasketInputs()
      setLoader(false)
      setOpenHDM(true)
      loadBasket()
    }else if(saletype === 2 && result?.status === 200) {
       setQrString(result?.data?.content?.qr_text)
       setTrsf(result?.data?.content?.px_transfer_id)
      setOpenQr(true)
      setFlag(1)
    }
    else if(saletype === 3 && result?.status === 200) {
      createMessage("success", t("basket.sent"))
      
      setTimeout(() => {
        deleteBasketGoods()
        closePhoneDialog()
        loadBasket()
        createMessage("")
      }, 3000)
    }else if(saletype === 4) {
      setDataQr(result);
      setOpenLinkQr(true)
    }
  };

// all sale types 1-cash/card 2-qr 3-phone 4-url
  const multiSaleProducts = async(saletype) => {
    if(!paymentInfo?.cashAmount && !paymentInfo?.cardAmount && !paymentInfo?.prePaymentAmount){
      createMessage("error", t("authorize.errors.emptyfield"))
      return
    }else if(paymentInfo?.cashAmount> 300000){
      createMessage("error", t("authorize.errors.cashLimit"))
      return
    }
    let isValid=null
    if(paymentInfo?.sales?.length){
      isValid = newSaleValidate()
    }else{
      isValid = true
    }
    if(isValid){
      setLoader(true)
      let saleResponse = ""
      if(saletype === 1) {
        saleResponse = await saleProductFromBasket(paymentInfo)
      }else if(saletype === 2) {
        const arr = await paymentInfo?.sales.map((item) => {
          return {id: item?.id, count: item?.count}
        })
        saleResponse =  await payRequestQR({
          "sales": arr,
          "discount": paymentInfo?.discount,
          "discountType": paymentInfo?.discountType,
          "partnerTin": paymentInfo?.partnerTin,
          "cashAmount": paymentInfo?.cashAmount || 0,
          "cardAmount": paymentInfo?.cardAmount || 0,
          "prePaymentAmount": paymentInfo?.prePaymentAmount,
          "partialAmount": paymentInfo?.partialAmount,
          "phoneNumber": ""
        })
                // saleResponse = await payRequestQR(paymentInfo)
      }else if(saletype === 3) {
        setOpenPhonePay(true)
        return
      }else if(saletype === 4) {
        saleResponse = await basketListUrl(paymentInfo)
      }
      responseTreatment(saleResponse,saletype)
    }else{
      createMessage("error", "Something went wrong..")
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

  const closeDialog = () => {
    setMessage()
    if(type !== "error") {
      deleteBasketGoods() 
      setOpenBasket(false)
    } 
    setType()
  };

  const closeLinkQrAndRefresh = () => {
    setOpenLinkQr(false)
    setOpenBasket(false)
    createPaymentSales()
    setDataGroup("GetAvailableProducts")
  };
  

  window.onresize = function(event) {
    setScreen(window.innerWidth)
  };
  
  const createMessage = (type,message) => {
    setType(type)
    setMessage(message)
  };

  useEffect(()=> {
   createPaymentSales()
   setSearchValue("")
   return setSingleClick({})
  }, [basketContent, openBasket]);

  useEffect(() => {
    setSingleClick({})
  },[flag]);

  return (
    <Dialog
      open={openBasket}
      style={{
        background:"rgb(40,167,69,0.15)", 
      }}
      onClose={loader ? null : ()=>setOpenBasket(false)}
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
          <Box className={styles.bask_container}
            onKeyDown={(e)=>{
              if(e.key === "Enter") {
                e.preventDefault()
                byBarCodeSearching(setSearchValue)
              }}}
            >
            <BasketHeader 
              t={t} 
              setOpenBasket={setOpenBasket} 
              deleteBasketGoods={deleteBasketGoods}
              basketContent={basketContent}
              setPaymentInfo={setPaymentInfo}
            />
            <Divider style={{margin:2, backgroundColor:"gray"}}/>
            <SearchBarcode
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              byBarCodeSearching={byBarCodeSearching}
              stringFrom="basket"
              setFrom={setFrom}
            />
            <Divider style={{margin:1, backgroundColor:"gray"}}/>
            <DialogContent 
              className={styles.bask_container_body_content}  
              style={{margin:0,padding:0}}
              dividers={window.scroll === 'paper'}
            >
              <BasketContent 
                basketContent={basketContent}
                changeCountOfBasketItem={changeCountOfBasketItem}
                deleteBasketItem={deleteBasketItem}
                loadBasket={loadBasket}
                t={t}
                screen={screen}
                setFlag={setFlag}
                flag={flag}
                setSingleClick={setSingleClick}
                singleClick={singleClick}
                avail={avail}
                setAvail={setAvail}
                paymentInfo={paymentInfo}
              />
            </DialogContent>
            <Divider style={{margin:2, backgroundColor:"gray"}}/>
            {basketContent?.length ?
              <ProductPayment  
                t={t} 
                totalPrice={totalPrice}
                basketContent={basketContent}
                createMessage={createMessage}
                checkDiscountVsProdPrice={checkDiscountVsProdPrice}
                setSingleClick={setSingleClick}
                paymentInfo={paymentInfo}
                setPaymentInfo={setPaymentInfo}
             /> :
            <AdvancePayment 
              t={t} 
              paymentInfo={paymentInfo}
              setPaymentInfo={setPaymentInfo}
              flag={flag}
              singleClick={singleClick}
              setSingleClick={setSingleClick}
            />
            }
            <Dialog open={message}>
                <SnackErr message={message} type={type} close={closeDialog} />
            </Dialog>
            { messageWithRefresh && 
              <Dialog open={message}>
                <SnackErr message={message} type="success" close={closeQr} />
              </Dialog>
            }
              <div className={styles.bask_container_body_footer}>
                <Divider flexItem  sx={{bgcolor:"black"}} />
                <PayButtons
                  paymentInfo={paymentInfo}
                  setOpenPhonePay={setOpenPhonePay}
                  singleClick={singleClick}
                  setSingleClick={setSingleClick}
                  multiSaleProducts={multiSaleProducts}
                />
              </div>
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
            paymentInfo={paymentInfo}
            setTrsf={setTrsf}
            loadBasket={loadBasket}
          />}
          <PhonePay
            t={t}
            setLoader={setLoader}
            logOutFunc={logOutFunc}
            loadBasket={loadBasket}
            deleteBasketGoods={deleteBasketGoods}
            openPhonePay={openPhonePay}
            paymentInfo={paymentInfo}
            setPaymentInfo={setPaymentInfo}
            closePhoneDialog={closePhoneDialog} 
            price={(totalPrice - (totalPrice * (paymentInfo?.discount || 0)) / 100).toFixed(2)}
            singleClick={singleClick}
            setSingleClick={setSingleClick}
            responseTreatment={responseTreatment}
          />
        {openLinkQR &&
          <PayQRLink 
            t={t}
            message={message}
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

export default memo(Bascket);
