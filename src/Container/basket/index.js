import React, { forwardRef, useEffect, useState, memo } from "react";
import { AppBar, Button, Dialog, DialogContent, Divider, Slide } from "@mui/material";
import { Box } from "@mui/system";
import styles from "./index.module.scss"
import { basketListUrl, payRequestQR, saleProductFromBasket, sendSmsForPay } from "../../services/pay/pay";
import QRPay from "../../Container2/historyPage/newHdm/QRPay";
import PhonePay from "../../Container2/historyPage/newHdm/PhonePay.js";
import Loader from "../../Container2/loading/Loader";
import SnackErr from "../../Container2/dialogs/SnackErr";
import moment from "moment";
import PaymentContainer from "./payment";

import PayQRLink from "../../Container2/historyPage/newHdm/PayQRLink";
import { cheackProductCount, SavePrePaymentBasket } from "../../services/products/productsRequests";
import Receipt from "../../Container2/historyPage/newHdm/receipt";
import BasketHeader from "./header/BasketHeader";
import BasketContent from "./content/BasketContent";
import PayButtons from "./operation/PayButtons";
import ProductPayment from "./payment/ProductPayment";
import SearchBarcode from "../../SearchBarcode";
import { taxCounting } from "../../modules/modules.js";
import ProductPrePayment from "./payment/ProductPrePayment.js";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";


const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const Bascket = ({
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
  flag,
  setFlag,
  setContent,
  byBarCodeSearching,
  setFrom,
  searchValue,
  setSearchValue,
  user,
  setMesFromHead,
  setFetching,
  setCurrentPage,
  openWindow,
  setOpenWindow,
  paymentInfo, setPaymentInfo,
  limitedUsing
}) => {
  const navigate = useNavigate()
  const {t} = useTranslation();
  const [screen, setScreen] = useState(window.innerWidth);
  const [saleData, setSaleData] = useState();
  const [loader, setLoader] = useState(false);
  const [totalPrice,setTotalPrice] = useState();
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
  const [blockTheButton, setBlockTheButton] = useState(false);
  const [taxCount, setTaxCount] = useState(0);
  const [seeBtn,setSeeBtn] = useState();
  const [freezeCount, setFreezeCount] = useState([]);

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
      if((item?.count * item?.price - (item?.count * item?.price * disc/100)) < 1){
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
    let arr = await JSON.parse(localStorage.getItem("basketIdCount"))
    if(!freezeCount?.length && localStorage.getItem("endPrePayment")) {
      setFreezeCount(arr)
    }
    const salesArr =  arr
    if(salesArr?.length) {
      setSingleClick({})
      basketContent?.forEach((item) => {
        total += (item?.discountedPrice ? item?.discountedPrice* item?.count: item?.price * item?.count )
        // total += (item?.discountPrice * item?.count)
        if(item?.count === "" || item?.count == 0){
          return setIsEmpty(true)
        }
      })
      setPaymentInfo({
        ...paymentInfo,
        // cashAmount: total-openWindow?.prePaymentAmount,
        prePaymentAmount: openWindow?.prePaymentAmount,
        cashAmount:0,
        cardAmount: 0,
        sales: salesArr,
      })
      // 16.01.2025
      setTotalPrice(total)
    }else{
      setSingleClick({pointerEvents:"none"})
      setPaymentInfo({
        ...paymentInfo,
        cashAmount: 0,
        cardAmount: 0,
        partnerTin: "",
        sales:[],
        customer_Name: "",
        customer_Phone: ""
      })
    }
  };
  
  const multiSaleProducts = async(saletype) => {
    setSeeBtn(JSON.parse(localStorage.getItem("fromQRpay")))
    setSingleClick({
      opacity: "0.3",
      border:"red",
      pointerEvents:"none"
    })
    basketContent.map((item) => {
      if(item?.count * item?.price < 1){
        createMessage("error", t("basket.total_zero"))
      }
      return item
    })
    if((!paymentInfo?.cashAmount && 
      !paymentInfo?.cardAmount && 
      !paymentInfo?.prePaymentAmount)
      || isEmpty
    ){
      return createMessage("error", t("basket.emptyPayInfo"))
    }else if(paymentInfo?.cashAmount > 300000){
      createMessage("error", t("authorize.errors.cashLimit"))
      return
      // timeless setts
    }else if(paymentInfo?.sales?.length && !JSON.parse(localStorage.getItem("endPrePayment"))){
      checkAvail(saletype)
    }else{
      // if it is Prepayment operation without prods.SOON WILL BE NOT AVAILABLE
      setLoader(true)
      sale(saletype)
    }
  };
// here I must check is it payment or prepayment sale
  const sale = async(saletype) => {
    let saleResponse = "";
    if(navigator.onLine) {

      if(saletype === 1) {
        saleResponse =  await saleProductFromBasket(paymentInfo)
      
      }else if(saletype === 2) {
        saleResponse = await payRequestQR(paymentInfo)
      }else if(saletype === 3) {
        saleResponse = await sendSmsForPay({
          ...paymentInfo,
          phone: `+374${paymentInfo.phone}`
        })
          if(saleResponse?.status === 203) {
            createMessage("error", t("authorize.errors.bank_agreement"))
            return
          }else{
            closeRecieptAndRefresh()
          }
        setOpenPhonePay(true)
      }else if(saletype === 4) {
        saleResponse = await basketListUrl(paymentInfo)
      }
      if(saleResponse) {
        setLoader(false)
        if(saleResponse === "ERR_NETWORK") {
          return createMessage("error", t("dialogs.badInet"))

        }
        responseTreatment(saleResponse, saletype)
        const tax = await taxCounting(saleResponse?.res?.printResponseInfo?.items)
        setTaxCount(tax)
      }
      else{
        createMessage("error", t("dialogs.badInet"))

      }
    }
    else{
      createMessage("error", t("dialogs.badInet"))
    }
  }

  const responseTreatment = async(result, saletype) => {
    if(result === 401){
      logOutFunc()
      return 
    }else if(result === 500 || result === 415 || result === 0){
      setType("error")
      setMessage(`${t("dialogs.sorry")}, ${t("dialogs.wrong")}`)
      return
    }else if(result === 400){
      createMessage("error", `${t("dialogs.sorry")}, ${t("dialogs.wrong")}`)
      setAvail([])
      return
    }else if(result === 406){
      setAvail([])
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
    // deleteBasketGoods()
    setFetching(true)
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
       res?.forEach((prod) => {
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
// checkAvail => sale => responseTreatment => 
  const closeRecieptAndRefresh = async() => {
    setOpenBasket(false)
    setContent([])
    setCurrentPage(1)
    setFetching(true)
    setFlag(!flag)
    setOpenHDM(false)
    deleteBasketGoods()
  };

  const closeDialog = () => {
    setSingleClick({})
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
    searchValue?.length && setSearchValue("")
  }, [basketContent, flag, openBasket]);

  const getFreezedCounts = async() => {
    if(localStorage.getItem("freezeBasketCounts")) {
      const data = await (JSON.parse(localStorage.getItem("freezeBasketCounts")))
      setFreezeCount(data)
    }
  };

  useEffect(() => {
    getFreezedCounts()
  }, [])

  useEffect(() => {

    if(totalPrice - paymentInfo?.prePaymentAmount < 0 && paymentInfo?.prePaymentAmount ){
      createMessage("error", t("history.reverseLimit"))
    }

  }, [totalPrice]);

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
                byBarCodeSearching("GetAvailableProducts ",setSearchValue)
              }}}
            >
            <BasketHeader 
              t={t} 
              setOpenBasket={setOpenBasket} 
              deleteBasketGoods={deleteBasketGoods}
              basketContent={basketContent}
              setSingleClick={setSingleClick}
              freezeCount={freezeCount}
            />
            <Divider sx={{mt:2}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <SearchBarcode
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                byBarCodeSearching={byBarCodeSearching}
                stringFrom="basket"
                setFrom={setFrom}
              />
              { paymentInfo?.prePaymentSaleDetailId &&
                <Button 
                  variant="contained"
                  startIcon={<ControlPointIcon fontSize="small" />}   
                  href="/"
                  disableElevation
                  disableRipple
                >
                  <span style={{fontSize:"60%",fontWeight:700}}> {t("mainnavigation.newproduct")}</span>
                </Button>
              }
            </div>
            <DialogContent 
              className={styles.bask_container_body_content}  
              style={{margin:0,padding:0}}
              dividers={window.scroll === 'paper'}
            >
              <BasketContent 
                basketContent={basketContent}
                changeCountOfBasketItem={changeCountOfBasketItem}
                deleteBasketItem={deleteBasketItem}
                screen={screen}
                avail={avail}
                setAvail={setAvail}
                flag={flag}
                createMessage={createMessage}
                freezeCount={freezeCount}
                // loadBasket={loadBasket}
                // setFlag={setFlag}
                // setSingleClick={setSingleClick}
                // singleClick={singleClick}
                // paymentInfo={paymentInfo}
                // setIsEmpty={setIsEmpty}
                // totalPrice={totalPrice}
                // message={message}
                // setBlockTheButton={setBlockTheButton}
              />
            </DialogContent>
            <Divider style={{margin:2,height:"2px", backgroundColor:"black"}}/>
            {/* you choose prepayment or sell */}
              { basketContent?.length  && !localStorage.getItem("endPrePayment") ? 
                <>
                  <PaymentContainer 
                    openWindow={openWindow} 
                    setOpenWindow={setOpenWindow}
                    paymentInfo={paymentInfo}
                    setPaymentInfo={setPaymentInfo}
                  />
                  <Divider style={{margin:2, backgroundColor:"gray"}}/>
                </>:""
              }

            {/* you choose prepayment or sell */}
{/* if sell */}
            {((openWindow?.isOpen && openWindow?.payment  ) || localStorage.getItem("endPrePayment")) &&
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
                prepayment = {openWindow?.prePaymentAmount}
             />}

{/* if prepayment */}
             {openWindow?.isOpen && openWindow?.prepayment &&
              <ProductPrePayment  
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
                message={message}
                setMessage={setMessage}
                setType={setType}
             />}
        
            { basketContent?.length ? 
              <div className={styles.bask_container_body_footer}>
              <Divider flexItem  sx={{bgcolor:"black"}} />
                <PayButtons
                  paymentInfo={paymentInfo}
                  handleOpenPhoneDialog={handleOpenPhoneDialog}
                  multiSaleProducts={multiSaleProducts}
                  blockTheButton={blockTheButton}
                  totalPrice={totalPrice}
                  singleClick={singleClick}
                  setSingleClick={setSingleClick}
                  setOpenBasket={setOpenBasket}
                  saleMode={user?.ehdmMode}
                  limitedUsing={limitedUsing}
                />
              </div>
            :""}
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
            multiSaleProducts={multiSaleProducts}
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
            seeBtn={seeBtn}
          />
        }

        {message && 
          <Dialog open={Boolean(message)}>
            <SnackErr message={message} type={type} close={closeDialog} />
          </Dialog>
        }
        {messageWithRefresh && 
          <Dialog open={Boolean(message)}>
            <SnackErr message={message} type="success" close={closeQr} />
          </Dialog>
        }
      </AppBar>}
    </Dialog>
  );
}

export default memo(Bascket);
// 454