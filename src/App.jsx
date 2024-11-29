import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
// import Basket from "./Container/Bascket/index";
import Basket from "./Container/basket";
import HistoryPage from "./Container2/historyPage";
import Header from "./Container/Header/Header";
import ProductChanges from "./Container2/analytics";
import HomePage from "./Container2/home/index"
// import Confirmation from "./Authorization/Confirmation";
import FeedBackPage from "./Container2/feedback";
import CheckStatusArCa from "./Container2/settingsPage/serviceAmount/attachCard"

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

import { Alert, Snackbar } from "@mui/material";
import useDebonce from "./Container2/hooks/useDebonce";
import Cashiers from "./Container2/settingsPage/cashiers/Cashiers";
import SettingsUser from "./Container2/settingsPage/user"
import { getNewNotifications } from "./services/user/getUser";
import Notification from "./Container2/dialogs/Notification";
import LoginAuthContainer from "./Authorization/loginAuth";
import Login from "./Authorization/loginAuth/login";
import Registration from "./Authorization/loginAuth/registration";
import ForgotPassword from "./Authorization/loginAuth/forgotPass";
import ResetPassword from "./Authorization/loginAuth/resetpass/ResetPassword";
import Confirmation from "./Authorization/loginAuth/confirmation";
import PrePaymentList from "./Container2/prepayment/";

const App = () => {

  const [limitedUsing, setLimitedUsing] = useState();
  const [basketGoodsqty, setBasketGoodsqty] = useState();
  const [basketContent, setBasketContent]=useState([]);
  const [openBasket, setOpenBasket] = useState(false);
  const [isLogin, setIsLogIn] = useState(Boolean(localStorage.getItem("token")));
  const [content, setContent] = useState([]);
  const [dataGroup, setDataGroup] = useState("GetAvailableProducts");
  const [basketExist, setBasketExist] = useState([]);
  const [flag, setFlag] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [measure, setMeasure] = useState([]);
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [message,setMessage] = useState({message:"",type:""});
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
  const [openWindow,setOpenWindow] = useState({
    prepayment: false ,
    payment: false,
    isOpen: false,
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
    prePaymentSaleDetailId:JSON.parse(localStorage.getItem("endPrePayment"))?.id,
    isPrepayment: openWindow?.prepayment,
    customer_Name: "",
    customer_Phone: ""
  });

 
  const whereIsMyUs = async() => {
    console.log("29.11.24 new")
    await dispatch(fetchUser()).then(async(res) => {
      const date = new Date(res?.payload?.nextPaymentDate);
      setLastDate(
        `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`
      )
      await datePainter(res?.payload?.nextPaymentDate)
      localStorage.setItem("status", JSON.stringify(res?.payload?.isEhdmStatus)) 
      localStorage.setItem("reverse", JSON.stringify(res?.payload?.reverceStatus))
      localStorage.setItem("taxRegime", JSON.stringify(res?.payload?.taxRegime))
      checkUserStatus()
      if(res?.error?.message === "Rejected"){
        logOutFunc()
      }else if(res?.payload?.isInDate === false && !res?.payload?.days && res?.payload?.showPaymentPage){
        navigate("/setting/services")
        setBlockedUser(true)
      }
      else if(res?.payload?.isInDate === true && res?.payload?.days &&  res?.payload?.showPaymentPage){
        setMessage({
          type:"error",
          message:`${t("cardService.notInDateTrueDays")} ${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}  ${t("cardService.notInDateTrueDays2")}`
        })
      }
      else if(res?.payload?.isInDate === true){
        setBlockedUser(false)
        !res?.payload?.confirmation && res?.payload?.showPaymentPage && !count && checkForNewNotification()
        setCount(true)
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
      await queryFunction(dataGroup, 1).then((res) => {
        setContent(res?.data)
        setMessage("")
      })
      setCurrentPage(2)
      return
    }else{
      setMessage("")
      await byBarCode(group, barcode).then((res) => {
        if(from === "basket"){
          if(res?.length) {
            res.forEach((item) =>{
              if(item?.barCode === barcode){
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
            setMessage({message: t("mainnavigation.searchconcl"), type: "error"})
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
          existArr.push(item?.productId || item?.id)
          arrForSale.push({id:item?.productId || item?.id, count: +item?.count})
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
          return handleArr.push({...prod, count: value})
        }else{
         return handleArr.push(prod)
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
        discountPrice: wishProduct?.discountType === 2? 
        wishProduct?.price - wishProduct.discount :
        wishProduct?.price - (wishProduct.price * wishProduct.discount/100) ,
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
            discountPrice: wishProduct?.discountType === 2? 
            wishProduct?.price - wishProduct?.discount :
            wishProduct?.price - (wishProduct?.price * wishProduct?.discount/100),
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
        discountPrice: wishProduct?.discountType === 2? 
        wishProduct?.price - wishProduct.discount :
        wishProduct?.price - (wishProduct.price * wishProduct.discount/100) ,
        count:+(quantity  ? quantity: 1)
      })
    }
    localStorage.setItem("bascket1", JSON.stringify(basket))
    setSearchValue("")
    return loadBasket()
  };

  
  const logOutFunc = () =>{
    const language = localStorage.getItem("lang");
    setContent([]);
    setCount(false)
    localStorage.clear();
    localStorage.setItem("lang", language)
    setIsLogIn(false)
  };  

  
  const getMeasure = async() => {
    const str = localStorage.getItem("lang")
    switch(str){
      case "en":
        await measureTranslate(2).then((res) => {
          setMeasure(res?.data)
        })
      break;
      case "am":
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
    
  const changeStatus = async(str) => {
    setCurrentPage(1)
    setDataGroup(str)
    const response = await queryFunction(str, 1)
    setContent([ ...response?.data]);
    setCurrentPage(2)
  };

  const checkForNewNotification = () => {
    getNewNotifications().then((res) => {
      setNotification(res)
    })
  };
  
  useEffect(() => { 
    getMeasure()
  },[t]);

  useEffect(() => {
    getMeasure()
    setDataGroup("GetAvailableProducts")
    setCurrentPage(1)
    loadBasket()
  },[isLogin]);

  useEffect(() => {
    setCount(false)
    whereIsMyUs() 
    setDataGroup("GetAvailableProducts")
  },[]);

 useEffect(() => {
  setPaymentInfo({
    ...paymentInfo,
    isPrepayment: openWindow?.prepayment
  })
  },[openWindow]);

  useEffect(() =>{
    searchValue && debounce && byBarCodeSearching(dataGroup,debounce)
  },[debounce]);

  useEffect(() => {
    barcodeScanValue &&  debounceBasket && byBarCodeSearching("GetAvailableProducts",debounceBasket)
  },[debounceBasket]);

  return (
  <LimitContext.Provider value={{limitedUsing, setLimitedUsing}}>
    <div className="App"  autoComplete="off">
      {!isLogin ?
        <Routes>
          <Route path="*" element={<LoginAuthContainer children={<Login setIsLogIn={setIsLogIn} whereIsMyUs={whereIsMyUs} />} />} />
          <Route path="/login" element={<LoginAuthContainer children={<Login setIsLogIn={setIsLogIn} whereIsMyUs={whereIsMyUs} />} />} />
          <Route path="/registration" element={<LoginAuthContainer children={<Registration logOutFunc={logOutFunc} />} />} />
          <Route path="/forgot-password" element={<LoginAuthContainer children={<ForgotPassword />} />} />
          <Route path="/reset-password/*" element={<LoginAuthContainer children={<ResetPassword />} />} />
          <Route path="/confirmation/*" element={<LoginAuthContainer children={<Confirmation />} />} />
          <Route path="/privacy_policy" element={<PrivacyPolicy />} />
          <Route path="/basket/*" element={<BasketList t={t} />} />
        </Routes> :
        <>
          <Header
            t={t}
            setOpenBasket={setOpenBasket}
            basketGoodsqty={basketGoodsqty}
            logOutFunc={logOutFunc} 
            setIsLogIn={setIsLogIn}
            user={user}
            logo={user?.logo}
            active={user?.isEhdmStatus}
            activeBtn={activeBtn}
            setActiveBtn={setActiveBtn}
          />
          {/* <button style={{marginTop:"175px"}} onClick={hardReloadWithBypassCache}>Полная перезагрузка с обходом кеша</button> */}
          {!isBlockedUser ? <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  t={t}
                  isLogin={isLogin}
                  measure={measure}
                  dataGroup={dataGroup}
                  setDataGroup={setDataGroup}
                  setContent={setContent}
                  content={content}
                  setToBasket={setToBasket}
                  setOpenBasket={setOpenBasket}
                  openBasket={openBasket}
                  deleteBasketItem={deleteBasketItem}
                  basketExist={basketExist}
                  queryFunction={queryFunction}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  user={user}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  byBarCodeSearching={byBarCodeSearching}
                  setFrom={setFrom}
                  changeStatus={changeStatus}
                  flag={flag}
                  fetching={fetching}
                  setFetching={setFetching}
                  openWindow={openWindow}
                />
              }  
            />
            <Route path="/excel" element={<PasteExcelToReact logOutFunc={logOutFunc} setCurrentPage={setCurrentPage} />} />
            <Route path="/feedback" element={<FeedBackPage logOutFunc={logOutFunc} t={t} />} />
            <Route path="/setting/cashiers" element={<Cashiers t={t} cashierLimit={user?.cashiersMaxCount} logOutFunc={logOutFunc} /> } />
            <Route path="/setting/user" element={<SettingsUser user={user} t={t} whereIsMyUs={whereIsMyUs} logOutFunc={logOutFunc}/>} />
            <Route path="/history"
              element={<HistoryPage 
                logOutFunc={logOutFunc} 
                t={t}  
                measure={measure} 
                paymentInfo={paymentInfo} 
                setPaymentInfo={setPaymentInfo}
                setToBasket={setToBasket}
                setOpenBasket={setOpenBasket}
                setOpenWindow={setOpenWindow}
                deleteBasketGoods={deleteBasketGoods}
              />}
            />
            <Route path="/product-info/*" element={<ProductChanges t={t} logOutFunc={logOutFunc} measure={measure} />} />
            <Route path="/basket/*" element={<BasketList t={t} />} />
            <Route path="/prepayment" element={<PrePaymentList 
              setOpenBasket={setOpenBasket} 
              setToBasket={setToBasket}
              setOpenWindow={setOpenWindow}
              deleteBasketGoods={deleteBasketGoods}
              setPaymentInfo={setPaymentInfo}
              paymentInfo={paymentInfo}
              loadBasket={loadBasket}
              basketExist={basketExist}
              flag={flag}
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
            t={t}
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
            setBasketContent={setBasketContent}
            searchValue={barcodeScanValue}
            setSearchValue={setBarcodeScanValue}
            byBarCodeSearching={byBarCodeSearching}
            setFrom={setFrom}
            user={user}
            setMesFromHead={setMessage}
            fetching={fetching}
            setFetching={setFetching}
            setCurrentPage={setCurrentPage}
            openWindow={openWindow}
            setOpenWindow={setOpenWindow}
            paymentInfo={paymentInfo}
            setPaymentInfo={setPaymentInfo}
          />}
          {notification.length ? <Notification 
            t={t}
            func={()=>setNotification([])}
            data={notification}
            setData={setNotification}
            open={notification.length}
          /> : ""}
          <Snackbar  
            sx={{ height: "100%" }}
            anchorOrigin={{   
              vertical: "top",
              horizontal: "center"
            }} 
            open={!!message?.message} 
            autoHideDuration={6000} 
            onClose={()=>setMessage({type:"", message:""})}
          >
            <Alert onClose={()=>setMessage({type:"",message:""})} severity={message?.type || "success"} sx={{ width: '100%' }}>
              <strong style={{fontSize:"150%"}}>{message?.message}</strong>
            </Alert>
          </Snackbar>
        </>
      }
    </div>
  </LimitContext.Provider>
  );
}

export default App;
