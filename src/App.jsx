import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Basket from "./Container/Bascket/index";

import HistoryPage from "./Container2/historyPage";
import Header from "./Container/Header/Header";
import ProductChanges from "./Container2/analytics";
import HomePage from "./Container2/home/index"
import Confirmation from "./Authorization/Confirmation";
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
import FormTitle from "./Authorization/FormTitle";
import ClientInterface from "./Authorization/ClientInterface";
import Login from "./Authorization/login";
import Registration from "./Authorization/registration";
import ForgotPassword from "./Authorization/forgot"
import ResetPassword from "./Authorization/forgot/ResetPassword";
import PrivacyPolicy from "./Privacy/index";

import { fetchUser } from "./store/userSlice";
import {useDispatch, useSelector} from "react-redux";
import PasteExcelToReact from "./Container2/home/excelLoader";

import { Alert, Snackbar } from "@mui/material";
import useDebonce from "./Container2/hooks/useDebonce";
import Cashiers from "./Container2/settingsPage/cashiers/Cashiers";
import SettingsUser from "./Container2/settingsPage/user"
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
  const [lang, setLang] = useState();
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


  const whereIsMyUs = async() => {
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

  const byBarCodeSearching = async(barcode) => {
    if(barcode === "" || barcode === " "){
      await queryFunction(dataGroup, 1).then((res) => {
        setContent(res?.data)
        setMessage("")
      })
      setCurrentPage(2)
    }else{
      setMessage("")
      await byBarCode(barcode).then((res) => {
        if(from === "basket" && res?.length){
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
        }else if(from === "main") {
          return res?.length ? setContent(res) : setMessage({message: t("mainnavigation.searchconcl"), type: "error"})
        }
      })
    }
  };

  const loadBasket = async() => {
    let existArr = []
    let arrForSale = []
    await getBasketContent().then((res) => {
      return res ? (
      setBasketContent(res),
      setBasketGoodsqty(res?.length),
      res.forEach((item) => {
      existArr.push(item?.id)
      arrForSale.push({id:item?.id, count:+item?.count})
    }),
      localStorage.setItem("basketExistId", JSON.stringify(existArr)),
      localStorage.setItem("basketIdCount", JSON.stringify(arrForSale)),
      setBasketExist(localStorage.getItem("basketExistId"))
      ) : (
      localStorage.setItem("basketExistId", JSON.stringify(existArr)),
      localStorage.setItem("basketIdCount", JSON.stringify(arrForSale)),
      setBasketExist(localStorage.getItem("basketExistId")),
      setBasketGoodsqty(0),
      setBasketContent([])
      ) 
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
    await localStorage.setItem("bascket1", JSON.stringify(handleArr))
    await setFlag(flag+1)
    await loadBasket()
  };
  
  const deleteBasketGoods = async() => {
    setFlag(flag+1)
    await localStorage.removeItem('bascket1')
    loadBasket()
  };
  
  const setToBasket = (wishProduct, quantity) => {
    const basket = basketContent
      if(quantity && quantity > wishProduct?.remainder){
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
        count:+(quantity  ? quantity: 1)
      })
    }
    localStorage.setItem("bascket1", JSON.stringify(basket))
    // setFlag(flag+1)
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
            wishProduct?.price - (wishProduct?.price * wishProduct?.discount/100) ,
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
    // setContent([]);
    localStorage.clear();
    localStorage.setItem("lang", language)
    setIsLogIn(false)
  };  

  
  const getMeasure = async() => {
    const str = localStorage.getItem("lang")
    setLang(str || "am")
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
    setContent([])
    setCurrentPage(1)
    setDataGroup(str)
    // await setIsFilter(false)
    // setFetching(true)
    const response = await queryFunction(str, 1)
    setContent([ ...response?.data]);
    setCurrentPage(2)
   
  };

  
  useEffect(() => { 
    getMeasure()
  },[t])

  useEffect(() => {
    getMeasure()
    setDataGroup("GetAvailableProducts")
    setCurrentPage(1)
    setContent([])
    loadBasket()
  },[isLogin, flag])


  useEffect(() => {
    setContent([])
    whereIsMyUs() 
    setDataGroup("GetAvailableProducts")
  },[]);

  useEffect(() =>{
    debounce && byBarCodeSearching(debounce)
  },[debounce]);

  useEffect(() => {
    debounceBasket && byBarCodeSearching(debounceBasket)
  },[debounceBasket]);

  return (
  <LimitContext.Provider value={{limitedUsing, setLimitedUsing}}>
    <div className="App"  autoComplete="off">
      {!isLogin ?
        <Routes>
          <Route path="*" element={ 
             <ClientInterface 
             title={<FormTitle operation={t("authorize.login")} />}
             element={<Login t={t} setIsLogIn={setIsLogIn} whereIsMyUs={whereIsMyUs} />}
             t={t}
             lang={lang}
             setLang={setLang}
           />}
          />
          <Route path="/login" element={
            <ClientInterface 
              title={<FormTitle operation={t("authorize.login")} />}
              element={<Login t={t} setIsLogIn={setIsLogIn} whereIsMyUs={whereIsMyUs} />}
              t={t}
              lang={lang}
              setLang={setLang}
            />}
          />
          <Route path="/registration" element={
            <ClientInterface 
              title={<FormTitle operation={t("authorize.registration")} />}
              element={<Registration t={t} logOutFunc={logOutFunc} />}
              t={t}
              lang={lang}
              setLang={setLang}
            />}
          />
          <Route path="/privacy_policy" element={<PrivacyPolicy />} />
          <Route path="/forgot-password" element={
            <ClientInterface 
              title={<FormTitle operation={t("authorize.reset")} />}
              element={<ForgotPassword t={t} />}
              t={t}
            />}
          />
          <Route path="/reset-password/*" element={ 
            <ClientInterface 
              title={<FormTitle operation={t("authorize.reset2")} />}
              element={<ResetPassword t={t} />}
              t={t}
           />}
          />
          <Route path="/basket/*" element={<BasketList t={t} />} />
          <Route path="/confirmation/*" element={<Confirmation t={t} />} />

        </Routes> :
        <>
          <Header
            t={t}
            setOpenBasket={setOpenBasket}
            basketGoodsqty={basketGoodsqty}
            logOutFunc={logOutFunc} 
            // setCurrentPage={setCurrentPage}
            setIsLogIn={setIsLogIn}
            user={user}
            logo={user?.logo}
            active={user?.isEhdmStatus}
            // setContent={setContent}
            activeBtn={activeBtn}
            setActiveBtn={setActiveBtn}

          />
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
                />
              }  
            />
            <Route path="/excel" element={<PasteExcelToReact logOutFunc={logOutFunc} setCurrentPage={setCurrentPage} />} />
            <Route path="/feedback" element={<FeedBackPage logOutFunc={logOutFunc} t={t} />} />
            <Route path="/setting/cashiers" element={<Cashiers t={t} screen={window.innerWidth} /> } />
            <Route path="/setting/user" element={<SettingsUser user={user} t={t} x whereIsMyUs={whereIsMyUs} />} />
            <Route path="/history" element={<HistoryPage logOutFunc={logOutFunc} t={t}  measure={measure} />} />
            <Route path="/product-info/*" element={<ProductChanges t={t} logOutFunc={logOutFunc} measure={measure} />} />
            <Route path="/basket/*" element={<BasketList t={t} />} />
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
         {!isBlockedUser && <Basket 
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

          />}
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
