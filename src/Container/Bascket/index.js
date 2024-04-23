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
import { taxCounting } from "../../modules/modules.js";
// import { fi } from "date-fns/locale";

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
  searchValue,setSearchValue,
  user,
  setMesFromHead
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
  const [isEmpty,setIsEmpty] = useState(false);
  const [avail,setAvail] = useState([]);
  const [blockTheButton, setBlockTheButton] = useState(true);
  const [taxCount, setTaxCount] = useState(0);

  const [val,setVal] = useState(0);

  const [paymentInfo, setPaymentInfo] = useState({
    discount: 0,
    discountType: 0,
    cashAmount: totalPrice,
    cardAmount: 0,
    prePaymentAmount: 0,
    partialAmount: 0,
    partnerTin: "",
    phone: "",
    sales: [],
  });

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
    setIsEmpty(false)
    createMessage("","")
    let total = 0
    let arr = await localStorage.getItem("basketIdCount")
    const salesArr = await JSON.parse(arr)
    if(salesArr?.length) {
      setSingleClick({})
      basketContent.forEach((item) => {
        total += (item?.discountPrice * item?.count)
        if(item?.count === "" || item?.count == 0){
          return setIsEmpty(true)
        }
      })
      setPaymentInfo({
        ...paymentInfo,
        cashAmount: total,
        prePaymentAmount: 0,
        cardAmount:0,
        sales:salesArr
      })
      setTotalPrice(total)
    }else{
      setSingleClick({pointerEvents:"none"})
      setPaymentInfo({
        ...paymentInfo,
        cashAmount: 0,
        cardAmount: 0,
        partnerTin: "",
        sales:[]
      })
    }
  };

  const multiSaleProducts = async(saletype) => {
    basketContent.map((item) => {
      if(item.count * item?.price < 1){
        setSingleClick({pointerEvents:"none"})
        createMessage("error", t("basket.total_zero"))
      }
      return item
    })
    if((!paymentInfo?.cashAmount && 
      !paymentInfo?.cardAmount && 
      !paymentInfo?.prePaymentAmount )
      || isEmpty
    ){
      return createMessage("error", t("basket.emptyPayInfo"))
    }else if(paymentInfo?.cashAmount> 300000){
      createMessage("error", t("authorize.errors.cashLimit"))
      return
    }else if(paymentInfo?.sales?.length){
      checkAvail(saletype)
    }else{
      // if it is Prepayment operation
      setLoader(true)
      sale(saletype)
    }
  };

  const sale = async(saletype) => {
    let saleResponse = "";
    if(saletype === 1) {
      saleResponse = await saleProductFromBasket(paymentInfo)
    }else if(saletype === 2) {
      saleResponse = await payRequestQR(paymentInfo)
    }else if(saletype === 3) {
      setOpenPhonePay(true)
      return
    }else if(saletype === 4) {
      saleResponse = await basketListUrl(paymentInfo)
    }
    responseTreatment(saleResponse, saletype)
    const tax = await taxCounting(saleResponse?.res?.printResponseInfo?.items)
      setTaxCount(tax)
  }

  const responseTreatment = async(result, saletype) => {
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
    }else if(result === 406){
      checkAvail()
      createMessage("error", t("basket.total_zero"))
      return false
    }else if(result?.status === 203){
      return createMessage("error", t("authorize.errors.bank_agreement"))
    }else if(saletype === 1 && result?.res?.printResponseInfo ) {
      setSaleData(result)
      setLoader(false)
      setOpenHDM(true)
      loadBasket()
    }else if(saletype === 2 && result?.status === 200) {
      setQrString(result?.data?.content?.qr_text)
      setTrsf(result?.data?.content?.px_transfer_id)
      setOpenQr(true)
    }
    else if(saletype === 3 && result?.status === 200) {
      loadBasket()
      closePhoneDialog()
      setMesFromHead({type:"success", message:t("basket.sent")})
    }else if(saletype === 4 && result?.data?.message) {
      setDataQr(result?.data?.message);
      setOpenLinkQr(true)
    }
  };

  const handleOpenPhoneDialog = () => {
    if(user?.merchantXExist) {
      return setOpenPhonePay(true)
    }else{
      return createMessage("error", t("authorize.errors.bank_agreement"))
    }
  }

  const checkAvail = async(saletype) => {
    setAvail([])
    cheackProductCount(paymentInfo?.sales).then((res) => {
      const errProds = []
       res.forEach((prod) => {
         return prod?.status === false ? errProds.push(prod?.id) : prod
      })
        setAvail(errProds)
      if(errProds?.length){
        createMessage("error", t("authorize.errors.soldOut"))
        return false
      }else{
        setLoader(true)
        sale(saletype)
      }
      
    }) 
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
    deleteBasketGoods()
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
  }, [basketContent,flag, openBasket]);

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
              paymentInfo={paymentInfo}
              setSingleClick={setSingleClick}
            />
            <Divider style={{margin:2, backgroundColor:"gray"}}/>
            <SearchBarcode
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              byBarCodeSearching={byBarCodeSearching}
              stringFrom="basket"
              setFrom={setFrom}
            />
            <Divider style={{margin:1, backgroundColor:"gray"}} />
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
                createMessage={createMessage}
                setIsEmpty={setIsEmpty}

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
                trsf={trsf}
                blockTheButton={blockTheButton}
                setBlockTheButton={setBlockTheButton}
             /> :
            <AdvancePayment 
              t={t} 
              paymentInfo={paymentInfo}
              setTotalPrice={setTotalPrice}
              setPaymentInfo={setPaymentInfo}
              flag={flag}
              singleClick={singleClick}
              setSingleClick={setSingleClick}
              basketContent={basketContent}
              blockTheButton={blockTheButton}
              setBlockTheButton={setBlockTheButton}
              val={val}
              setVal={setVal}
            />
            }
            <Dialog open={Boolean(message)}>
                <SnackErr message={message} type={type} close={closeDialog} />
            </Dialog>
            { messageWithRefresh && 
              <Dialog open={Boolean(message)}>
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
                  blockTheButton={blockTheButton}
                  handleOpenPhoneDialog={handleOpenPhoneDialog}
                  val={val}
                  totalPrice={totalPrice}

                />
              </div>
          </Box>
          <Receipt
            taxCount={taxCount}
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
            t={t}
            openQr={openQr} 
            closeQr={closeQr} 
            value={qrString} 
            trsf={trsf} 
            deleteBasketGoods={deleteBasketGoods} 
            setOpenBasket={setOpenBasket}
            paymentInfo={paymentInfo}
            loadBasket={loadBasket}
          />}
          <PhonePay
            t={t}
            openPhonePay={openPhonePay}
            paymentInfo={paymentInfo}
            setPaymentInfo={setPaymentInfo}
            closePhoneDialog={closePhoneDialog} 
            price={(totalPrice - (totalPrice * (paymentInfo?.discount || 0)) / 100).toFixed(2)}
            setLoader={setLoader}
            responseTreatment={responseTreatment}
            deleteBasketGoods={deleteBasketGoods}
            loadBasket={loadBasket}
            logOutFunc={logOutFunc}
          />
        {openLinkQR &&
          <PayQRLink 
            t={t}
            message={message}
            setMessage={setMessage}
            qrData={qrData}
            totalPrice={(totalPrice - (totalPrice * (paymentInfo?.discount)) / 100).toFixed(2)}
            cardAmount={paymentInfo?.cardAmount}
            closeLinkQrAndRefresh={closeLinkQrAndRefresh}
          />
        }
      </AppBar>}
    </Dialog>
  );
}

export default memo(Bascket);
// 454