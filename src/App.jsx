import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Basket from "./Container/basket";
import HistoryPage from "./Container2/historyPage";
import Header from "./Container/Header/Header";
import HomePage from "./Container2/home/index"
import FeedBackPage from "./Container2/feedback";
import CheckStatusArCa from "./Container2/settingsPage/serviceAmount/attachCard"
import AdminPanel from "./admin/panel";
import UsersContainer from "./admin/panel/stores";
import CustomerPage from "./admin/panel/customers"
import CustomerPayments from "./admin/panel/payments";
import CustomerInfo from "./admin/panel/info";
import AdminPage from "./admin/index";
import CustomerSaleHistory from "./admin/panel/customers/CustomerSaleHistory";
import CustomerCashiers from "./admin/panel/cashiers";
import AdminInvoices from "./admin/panel/invoices";

import { byBarCode, productQuery } from "./services/products/productsRequests";
import { getBasketContent } from "./modules/modules";
import { LimitContext } from "./context/Context";

import { useTranslation } from "react-i18next";
import { measureTranslate } from "./services/language/lang";

import "./App.css";
import BasketList from "./Container2/orderlist"
import ClientCardContainer from "./Container2/settingsPage/serviceAmount";

import PrivacyPolicy from "./Privacy/index";

import { fetchUser } from "./store/userSlice";
import {useDispatch, useSelector} from "react-redux";
import PasteExcelToReact from "./Container2/home/excelLoader";

import { Alert, Button, Dialog, Snackbar } from "@mui/material";
import useDebonce from "./Container2/hooks/useDebonce";
import Cashiers from "./Container2/settingsPage/cashiers/Cashiers";
import SettingsUser from "./Container2/settingsPage/user"
import { getNewNotifications } from "./services/user/getUser";
import Notification from "./Container2/dialogs/Notification";
import LoginAuthContainer from "./Authorization/loginAuth";
import Login from "./Authorization/loginAuth/login";
import NewSimpleRegistration from "./Authorization/newReg";
import ForgotPassword from "./Authorization/loginAuth/forgotPass";
import ResetPassword from "./Authorization/loginAuth/resetpass/ResetPassword";
import ConfirmationV2 from "./Authorization/loginAuth/confirmation/Confirmation";
import PrePaymentList from "./Container2/prepayment/";
import { QrSoccet } from "./QrSoccet";
import ConfirmDialog from "./Container2/dialogs/ConfirmDialog";
import PrivacyPayx from "./payxPrivacyRemove/PrivacyPayx";
import NewContract from "./Container2/dialogs/notifications/NewContract";

import { addNotification } from "./store/notification/notificationSlice";
import AddNewClientInfo from "./Container2/dialogs/AddNewClientInfo";
import IframeReader from "./Container/iframe/iframeReader"; 
import { removeDeviceToken } from "./services/notifications/notificatonRequests";
import { onMessage } from "firebase/messaging";

const checkForUpdates = async () => {
  try {
    const response = await fetch("/version.json", { cache: "no-store" });
    const data = await response.json();
    const newVersion = data.version;
    const currentVersion = localStorage.getItem("appVersion");

    if (currentVersion && currentVersion !== newVersion) {
      console.log("🔄 Найдена новая версия! Обновляем страницу...");
      localStorage.setItem("appVersion", newVersion);
      window.location.reload(true);
    } else {
      localStorage.setItem("appVersion", newVersion);
    }
  } catch (error) {
    console.error("Ошибка при проверке обновлений:", error);
  }
};


const App = () => {
 const search = useLocation().search;
  const status = new URLSearchParams(search).get("status") || "GetAvailableProducts";
  const [limitedUsing, setLimitedUsing] = useState();
  const [basketGoodsqty, setBasketGoodsqty] = useState();
  const [basketContent, setBasketContent]=useState([]);
  const [openBasket, setOpenBasket] = useState(false);
  const [isLogin, setIsLogIn] = useState(Boolean(localStorage.getItem("token")));
  const [content, setContent] = useState([]);
  const [dataGroup, setDataGroup] = useState(status);
  const [basketExist, setBasketExist] = useState([]);
  const [flag, setFlag] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [measure, setMeasure] = useState([]);
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [message,setMessage] = useState({message:"", type:""});
  const [searchValue,setSearchValue] = useState("");
  const [barcodeScanValue,setBarcodeScanValue] = useState("");
  const [from, setFrom] = useState("");
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user);

  const [isBlockedUser,setBlockedUser] = useState(false);
  const debounce = useDebonce(searchValue, 1000);
  const debounceBasket = useDebonce(barcodeScanValue, 20);
  const [activeBtn, setActiveBtn] = useState("/");
  const [lastDate,setLastDate] = useState("");
  const [fetching, setFetching] = useState(true);
  const [notification, setNotification] = useState([]);
  const [count, setCount] = useState(0);
  const [searchedNotAvailableProd, setSearchedNotAvailableProd] = useState();
  const [openAddDialog,setOpenAddDialog] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [ notifTrigger, setNotifTrigger] = useState(false)
  const [openWindow, setOpenWindow] = useState({
    prepayment: false,
    payment: false,
    isOpen: false,
    isEdit: false,
    prePaymentAmount: JSON.parse(localStorage.getItem("endPrePayment"))?.prepayment || 0,
    isPrepayment: localStorage.getItem("endPrePayment") ? true : false
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    discount: 0,
    discountType: 0,
    cashAmount: 0,
    cardAmount: 0,
    prePaymentAmount: openWindow?.prePaymentAmount || 0,
    partialAmount: 0,
    partnerTin: "",
    sales: [],
    prePaymentSaleDetailId: JSON.parse(localStorage.getItem("endPrePayment"))?.id,
    isPrepayment: openWindow?.prepayment,
    customer_Name: "",
    customer_Phone: ""
  });

  const whereIsMyUs = async() => {
    console.log("29.05.2025 update")
    // setNotifTrigger(!notifTrigger)
    await dispatch(fetchUser()).then(async(res) => {
      console.log(user,"user")
      const date = new Date(res?.payload?.nextPaymentDate);
      setLastDate(
        `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`
      )
      await datePainter(res?.payload?.nextPaymentDate)
      localStorage.setItem("status", JSON.stringify(res?.payload?.isEhdmStatus)) 
      localStorage.setItem("reverse", JSON.stringify(res?.payload?.reverceStatus))
      localStorage.setItem("taxRegime", JSON.stringify(res?.payload?.taxRegime))
      checkUserStatus()
      if(res?.payload?.isInDate === false && !res?.payload?.days && res?.payload?.showPaymentPage){
        navigate("/setting/services")
        setBlockedUser(true)
      }
      if(res?.payload?.isInDate === true){
        setBlockedUser(false)
        setCount(true)
      }
      if(res?.payload?.isChangedPassword === false) {
        setOpenAddDialog(true)
      }
    })
  };


  const datePainter = (dateString) => {
    const date = new Date(dateString);
    setLastDate(
      `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`
    )
  };

  const checkUserStatus = () => {
    const userRole = localStorage.getItem("role")
    if(userRole === "Director"){
      return setLimitedUsing(false)
    }else{
      return setLimitedUsing(true)
    }
  };

  const byBarCodeSearching = async(group,barcode) => {
  
    if(barcode === "" || barcode === " "){
      await queryFunction(status, 1).then((res) => {
        setContent(res?.data)
      })
      setCurrentPage(2)
      return
    }else{
      setMessage("")
      await byBarCode(group, barcode).then((res) => {
        // await byBarCode(group, barcode).then((res) => {
        if(from === "basket"){
          if(res?.length) {
            res.forEach((item) =>{
              if(item?.barCode === barcode){
              // if(item?.barCode === barcode || item?.emark === barcode){
                if(item?.remainder){
                  setSearchValue("")
                  setToBasketFromSearchInput(item, 1)
                }else{
                  return setMessage({message: t("mainnavigation.searchconcl"),type: "error"})
                }
              }
            })
          }else(
           setMessage({message: t("mainnavigation.searchconcl"),type: "error"})
          )
        }else if(from === "main") {
          return res?.length ? setContent(res) : (
            setContent([]) ,
            byBarCode("GetNotAvailableProducts", barcode).then((res) => {
              setSearchedNotAvailableProd(res)
              res?.length ? 
              setMessage({confirmMessage: t("mainnavigation.searchconclOutOfStock"), type: "success"}):
              setMessage({message: t("mainnavigation.searchconcl"), type: "error"})
            })
          )
        }
      })
    }
  };

  const loadBasket = () => {
    let existArr = []
    let arrForSale = []
    getBasketContent().then((res) => {
      if(res) {
        setBasketContent(res)
        setBasketGoodsqty(res?.length)
        res.forEach((item) => {
          existArr?.push(item?.productId || item?.id)
          arrForSale?.push({id:item?.productId || item?.id, count: +item?.count})
        })
      }else {
        setBasketGoodsqty(0)
        setBasketContent([])
        setPaymentInfo({
          discountType: 0,
          cashAmount: 0,
          cardAmount: 0,
          prePaymentAmount: openWindow?.prePaymentAmount || 0,
          partialAmount: 0,
          partnerTin: "",
          sales: [],
          prePaymentSaleDetailId:JSON.parse(localStorage.getItem("endPrePayment"))?.id,
          isPrepayment: openWindow?.prepayment,
          customer_Name: "",
          customer_Phone: ""
        })
      }
      localStorage.setItem("basketExistId", JSON.stringify(existArr))
      localStorage.setItem("basketIdCount", JSON.stringify(arrForSale))
      return setBasketExist(JSON.parse(localStorage.getItem("basketExistId")))
    })
  };

  const changeCountOfBasketItem = async(id,value) => {
   
    let handleArr = [] 
    await  getBasketContent().then((res) => {
      res.map((prod) => {
        if(prod.id === id) {
          
          return handleArr?.push({...prod, count: value})
        }else{
         return handleArr?.push(prod)
        }
      })  
    })
    localStorage.setItem("bascket1", JSON.stringify(handleArr))
    loadBasket()
  };

  const deleteBasketItem = async(id) => {
    let handleArr = await basketContent.filter(prod => prod.id !== id)
   
// handling freze prods when you want to close prepayment transaction
      let freeze = await JSON.parse(localStorage.getItem("freezeBasketCounts"))
      if(freeze?.length){
        freeze = await freeze.filter(prod => prod.id !== id)
        localStorage.setItem("freezeBasketCounts", JSON.stringify(freeze))
      }
// 
    if(!handleArr?.length) {
      localStorage.removeItem("endPrePayment")
      localStorage.removeItem("isEditPrepayment")
      setOpenWindow({
        prepayment: false ,
        payment: false,
        isOpen: false,
        prePaymentAmount:0
      })
    }
    await localStorage.setItem("bascket1", JSON.stringify(handleArr))
    await setFlag(flag+1)
    await loadBasket()
  };
  
  const deleteBasketGoods = async() => {
    !localStorage.getItem("endPrePayment") && setFlag(flag+1);
    localStorage.removeItem("endPrePayment")
    localStorage.removeItem("isEditPrepayment")
    localStorage.removeItem("freezeBasketCounts")
    setPaymentInfo({
      discountType: 0,
      cashAmount: 0,
      cardAmount: 0,
      prePaymentAmount: openWindow?.prePaymentAmount || 0,
      partialAmount: 0,
      partnerTin: "",
      sales: [],
      prePaymentSaleDetailId:JSON.parse(localStorage.getItem("endPrePayment"))?.id || "",
      isPrepayment: openWindow?.prepayment,
      customer_Name: "",
      customer_Phone: ""
    })
    setOpenWindow({
      prepayment: false,
      payment: false,
      isOpen: false,
      prePaymentAmount: 0
    })
    await localStorage.removeItem('bascket1')
    !localStorage.getItem("endPrePayment") && loadBasket()
  };
  
  const setToBasket = (wishProduct, quantity, isFromPrepaymentPage) => {
    const basket = basketContent
    if(quantity && quantity > wishProduct?.remainder && !isFromPrepaymentPage){
      setMessage({message:`${t("dialogs.havenot")} ${quantity} ${t(`units.${wishProduct?.measure}`)}`, type:"error" })
      return
    }else if(basketExist.includes(wishProduct?.id)){
        setMessage({message: t("productcard.secondclick"), type:"success"})
        return
    }else{
     
      basket.unshift({
        ...wishProduct,
        discountedPrice: wishProduct?.discountedPrice,
        discountedPrice: wishProduct?.discountedPrice,
        count:+(quantity ? quantity: 1)
      })
    }
    localStorage.setItem("bascket1", JSON.stringify(basket))
    return loadBasket()
  };

  const setToBasketFromSearchInput = (wishProduct, quantity) => {
    const basket = basketContent
      if(quantity && quantity > wishProduct?.remainder){
      setMessage({message:`${t("dialogs.havenot")} ${quantity} ${t(`units.${wishProduct?.measure}`)}`, type:"error" })
      return
    }else if(basketExist.includes(wishProduct?.id)){
      const newBasket = basket.map((prod) => {
        if(prod?.id === wishProduct?.id){
          return {
            ...prod,
            count:prod?.count + 1,
            discountedPrice:wishProduct?.discountedPrice,
          }
        }else{
          return prod
        }
      })
      localStorage.setItem("bascket1", JSON.stringify(newBasket))
      setSearchValue("")
      return loadBasket()
    }else{
      basket.unshift({
        ...wishProduct,
        discountedPrice:wishProduct?.discountedPrice,
        count:+(quantity  ? quantity: 1)
      })
    }
    localStorage.setItem("bascket1", JSON.stringify(basket))
    setSearchValue("")
    return loadBasket()
  };

  // onMessage(messaging, (payload) => {
  //   console.log(payload,"in appjs")
  //   setNotifTrigger(!notifTrigger)
  // })


  const logOutFunc = async() =>{
    const language = localStorage.getItem("lang");
    setIsLogIn(false)
    removeDeviceToken(localStorage.getItem("dt"))
    setContent([]);
    setCount(false)
    localStorage.clear();
    localStorage.setItem("lang", language)
  }; 

  const getMeasure = async() => {
    const str = await localStorage.getItem("lang")
    switch(str){
      case "eng":
        await measureTranslate(2).then((res) => {
          setMeasure(res?.data)
        })
      break;
      case "hy":
        await measureTranslate(1).then((res) => {
          setMeasure(res?.data)
        })
        break;
        case "ru":
          measureTranslate(3).then((res) => {
          setMeasure(res?.data)
         })
      break;
      default:
        await measureTranslate(1).then((res) => {
          setMeasure(res?.data)
        })
      }
  };

  const queryFunction = async(name, page=1) => {
    const data = await productQuery(name, page)
    return data === 401 ? logOutFunc() : data
  };

  const checkForNewNotification = () => {
    getNewNotifications().then((res) => {
      setNotification(res)
    })
  };
  
  useEffect(() => { 
    checkForUpdates()
    isLogin && getMeasure()
    user?.confirmation === false && user?.showPaymentPage && !count && checkForNewNotification()
   
  },[t,isLogin, user]);

  useEffect(() => {
    if(user?.isInDate === true &&
      user?.days && 
      user?.showPaymentPage &&
      !(JSON.parse(localStorage.getItem("notificOk")))
    ){
      const date = new Date(user?.nextPaymentDate);
      setMessage({
        type:"error",
        message:`${t("cardService.notInDateTrueDays")} 
        ${date.getDate().toString().padStart(2, '0')}.
        ${(date.getMonth() + 1).toString().padStart(2, '0')}.
        ${date.getFullYear()}  ${t("cardService.notInDateTrueDays2")}`
      })
      localStorage.setItem("notificOk", true)
    }
    loadBasket()
  },[user]);

  useEffect(() => {
    console.log("in effect for get user")
    whereIsMyUs() 
    if(user &&  user.isChangedPassword === false) { return setOpenAddDialog(true) }
    setCount(false)
  }, [notifTrigger]);

  useEffect(() => {
    setPaymentInfo({
      ...paymentInfo,
      isPrepayment: openWindow?.prepayment
    })
  },[openWindow]);

  useEffect(() =>{
    searchValue && debounce && byBarCodeSearching(dataGroup, debounce)
  },[debounce]);

  useEffect(() => {
    barcodeScanValue &&  debounceBasket && byBarCodeSearching("GetAvailableProducts",debounceBasket)
  },[debounceBasket]);

  return (
  <LimitContext.Provider value={{limitedUsing, setLimitedUsing}}>
    <div className="App" autoComplete="off">
      {! isLogin  && !localStorage.getItem("token")?
        <Routes>
          <Route path="*" element={<LoginAuthContainer children={<Login setIsLogIn={setIsLogIn} whereIsMyUs={whereIsMyUs} />} />} />
          <Route path="/login" element={<LoginAuthContainer children={<Login setIsLogIn={setIsLogIn} whereIsMyUs={whereIsMyUs} />} />}  />
          <Route path="/registration" element={<LoginAuthContainer children={<NewSimpleRegistration logOutFunc={logOutFunc} />} />} />
          <Route path="/forgot-password" element={<LoginAuthContainer children={<ForgotPassword />} />} />
          <Route path="/reset-password/*" element={<LoginAuthContainer children={<ResetPassword />} />} />
          <Route path="/confirmation/*" element={<ConfirmationV2 />} />
          <Route path="/privacy_policy" element={<PrivacyPolicy />} />
          <Route path="/privacy_policy_payx" element={<PrivacyPayx />} />
          <Route path="/basket/*" element={<BasketList t={t} logOutFunc={logOutFunc} />} />
          <Route path="/kuku" element={<IframeReader />} />
          {/* ADMIN PAGE */}
          {/* <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/admin/info/customer" element={<AdminPanel children={<CustomerInfo />} />} />
          <Route path="/admin/stores" element={<AdminPanel children={<UsersContainer />} />} />
          <Route path="/admin/transactions/customer" element={<AdminPanel children={<CustomerPage children={<CustomerSaleHistory />} />} />} />
          <Route path="/admin/invoices/customer" element={<AdminPanel children={<CustomerPage children={<AdminInvoices />} />} />} />
          <Route path="/admin/payments/customer" element={<AdminPanel children={<CustomerPage children={<CustomerPayments />} />} />} />
          <Route path="/admin/cashiers/customer" element={<AdminPanel children={<CustomerPage children={<CustomerCashiers />} />} />} /> */}
        </Routes> :
        <>
          <Header
            setOpenBasket={setOpenBasket}
            basketGoodsqty={basketGoodsqty}
            logOutFunc={logOutFunc} 
            user={user}
            logo={user?.logo}
            activeBtn={activeBtn}
            setActiveBtn={setActiveBtn}
            setNotifTrigger={setNotifTrigger}
            notifTrigger={notifTrigger}

          />
          {!isBlockedUser  && user ? <Routes>
            <Route
              path="/" 
              element={
                <HomePage
                  isLogin={isLogin}
                  measure={measure}
                  dataGroup={dataGroup}
                  setDataGroup={setDataGroup}
                  setContent={setContent}
                  content={content}
                  setToBasket={setToBasket}
                  deleteBasketItem={deleteBasketItem}
                  basketExist={basketExist}
                  queryFunction={queryFunction}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  setFrom={setFrom}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  byBarCodeSearching={byBarCodeSearching}
                  flag={flag}
                  setFlag={setFlag}
                  setFetching={setFetching}
                  fetching={fetching}
                />
              }  
            />

            <Route
              path="/prods" 
              element={
                <HomePage
                  isLogin={isLogin}
                  measure={measure}
                  dataGroup={dataGroup}
                  setDataGroup={setDataGroup}
                  setContent={setContent}
                  content={content}
                  setToBasket={setToBasket}
                  deleteBasketItem={deleteBasketItem}
                  basketExist={basketExist}
                  queryFunction={queryFunction}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  setFrom={setFrom}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  byBarCodeSearching={byBarCodeSearching}
                  flag={flag}
                  setFlag={setFlag}

                  setFetching={setFetching}
                  fetching={fetching}
                />
              }  
            />
            <Route path="/excel" element={<PasteExcelToReact logOutFunc={logOutFunc} setCurrentPage={setCurrentPage} />} />
            <Route path="/feedback" element={<FeedBackPage />} />
            <Route path="/setting/cashiers" element={<Cashiers cashierLimit={user?.cashiersMaxCount} logOutFunc={logOutFunc} /> } />
            <Route path="/setting/user" element={<SettingsUser user={user} whereIsMyUs={whereIsMyUs} logOutFunc={logOutFunc} limitedUsing={limitedUsing}/>} />
            <Route path="/history" element={<HistoryPage logOutFunc={logOutFunc} />} />
            <Route path="/qrsoccet" element={<QrSoccet />} />
            {/* <Route path="/product-info/*" element={<ProductChanges t={t} logOutFunc={logOutFunc} measure={measure} />} /> */}
            <Route path="/basket/*" element={<BasketList t={t} logOutFunc={logOutFunc} />} />
            <Route path="/prepayment" element={<PrePaymentList 
              setOpenBasket={setOpenBasket} 
              setToBasket={setToBasket}
              setOpenWindow={setOpenWindow}
              deleteBasketGoods={deleteBasketGoods}
              setPaymentInfo={setPaymentInfo}
              paymentInfo={paymentInfo}
              flag={flag}
              logOutFunc={logOutFunc}
            />} />
            <Route path="/privacy_policy" element={<PrivacyPolicy />} />
            {user?.showPaymentPage &&<Route path="/setting/services/*" element={<CheckStatusArCa logOutFunc={logOutFunc}/>} />}
            {user?.showPaymentPage &&<Route path="/setting/services" element={<ClientCardContainer logOutFunc={logOutFunc} serviceType={user?.activeServiceType} lastDate={lastDate}/>} />}
          </Routes> :
          <Routes>
            <Route path="/privacy_policy" element={<PrivacyPolicy />} />
            {user?.showPaymentPage && <Route path="/setting/services/*" element={<CheckStatusArCa logOutFunc={logOutFunc}/>} />}
            {user?.showPaymentPage && <Route path="/setting/services" element={<ClientCardContainer logOutFunc={logOutFunc} isBlockedUser={isBlockedUser} serviceType={user?.activeServiceType}/>} />}
            <Route path="*" element={<ClientCardContainer logOutFunc={logOutFunc} isBlockedUser={isBlockedUser} serviceType={user?.activeServiceType} />} />
          </Routes>
        }
         {!isBlockedUser && openBasket && <Basket 
            userName={user?.firstname + " " + user?.lastname}
            logOutFunc={logOutFunc}
            changeCountOfBasketItem={changeCountOfBasketItem}
            loadBasket={loadBasket}
            openBasket={openBasket} 
            setOpenBasket={setOpenBasket}
            basketContent={basketContent}
            deleteBasketGoods={deleteBasketGoods}
            setDataGroup={setDataGroup}
            deleteBasketItem={deleteBasketItem}
            flag={flag}
            setFlag={setFlag}
            setContent={setContent}
            byBarCodeSearching={byBarCodeSearching}
            setFrom={setFrom}
            searchValue={barcodeScanValue}
            setSearchValue={setBarcodeScanValue}
            user={user}
            setMesFromHead={setMessage}
            setFetching={setFetching}
            setCurrentPage={setCurrentPage}
            openWindow={openWindow}
            setOpenWindow={setOpenWindow}
            paymentInfo={paymentInfo}
            setPaymentInfo={setPaymentInfo}
            limitedUsing={limitedUsing}
          />}
          {notification.length ? 
            <Notification 
              func={()=>setNotification([])}
              data={notification}
              setData={setNotification}
              open={notification.length}
            /> : ""
          }

          {(!user?.hasAgreement && user?.newTerms) ?
            <NewContract 
              func={whereIsMyUs}
              data={user?.newTerms}
              open={!user?.hasAgreement}
              contractLink="https://storex.payx.am/Contract-EHDM-30or-Arm-12.02.25.pdf"
              logOutFunc={logOutFunc}
              role={user?.role}
            /> : ""
          }
            <AddNewClientInfo
              setMessage={setMessage} 
              openAddDialog={openAddDialog} 
              setOpenAddDialog={setOpenAddDialog}
              noWay={true}
              logOutFunc={logOutFunc}
            />
          <Snackbar  
            sx={{ height: "100%" }}
            open={!!message?.message} 
            autoHideDuration={6000} 
            onClose={()=>setMessage({type:"", message:""})}
            anchorOrigin={{   
              vertical: "top",
              horizontal: "center"
            }} 
          >
            <Alert onClose={()=>setMessage({type:"",message:""})} severity={message?.type || "success"} sx={{ width: '100%' }}>
              <strong style={{fontSize:"150%"}}>{message?.message}</strong>
            </Alert>
          </Snackbar>
          <ConfirmDialog
            func={()=>{
              setDataGroup("GetNotAvailableProducts")
              setContent(searchedNotAvailableProd)
              setMessage({type:"",message:""})
            }}
            open={message?.confirmMessage}
            close={()=>setMessage({type:"",message:""})}
            content={message?.confirmMessage}
          />
          {updateAvailable && (
            <Dialog open={updateAvailable}>
              <Button onClick={() => window.location.reload(true)}>
                🔄 Обновить сайт
              </Button>
            </Dialog>
          )}
        </>
      }
    </div>
  </LimitContext.Provider>
  );
}

export default App;
