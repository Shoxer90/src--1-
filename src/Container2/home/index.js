import React from "react";
import { memo } from "react";
import { useState } from "react";
import { useEffect } from "react";
import Loader from "../loading/Loader";
import HomeContent from "./HomeContent";
import styles from "./index.module.scss";
import HomeNavigation from "./HomeNavigation";
import AddNewProduct from "./product/AddNewProduct";
import { getAdg, removeProduct } from "../../services/products/productsRequests";
import { Dialog } from "@mui/material";
import SnackErr from "../dialogs/SnackErr";

const HomePage = ({
  t,
  isLogin,
  measure,
  dataGroup,
  setDataGroup,
  setContent,
  content,
  setToBasket,
  deleteBasketItem,
  basketExist,
  queryFunction,
  currentPage,
  setCurrentPage,
  setFrom,
  focusInput,
  searchValue, setSearchValue, byBarCodeSearching
}) => {
  
  const [isFilter,setIsFilter] = useState(false);
  const [openNewProd,setOpenNewProduct] = useState(false);
  const [fetching,setFetching] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [message,setMessage] = useState("");
  const [snackMessage,setSnackMessage] = useState("");
	const [typeCode,setTypeCode] = useState();
  const [selectContent,setSelectContent] = useState();
  const [type, setType] = useState();
  const [newProduct,setProduct] = useState({
    purchasePrice: "",
    price: "",
    type: "",
    brand: "",
    name: "",
    discount: "",
    remainder: "",
    barCode: "",
    photo:"",
    measure:"",
    pan: 0
  }); 

  const deleteAndRefresh = async(id) => {
    await removeProduct(id)
    deleteBasketItem(id)
  };

  const changeStatus = async(str) => {
    await setCurrentPage(1)
    setDataGroup(str)
    await setIsFilter(false)
    setFetching(true)
    setContent([])
    setProduct({
      measure: "",
      purchasePrice: "",
      price: "",
      type: "",
      brand: "",
      name: "",
      discount: "",
      remainder: "",
      photo:""
    })
  };
  
  const scrollHandler = (e) => { 
    if(content?.length <= +totalCount){
      if(e.target.documentElement.scrollHeight - (
        e.target.documentElement.scrollTop + window.innerHeight) < 300) {
        setFetching(true)
      }
    }else{
      document.removeEventListener("scroll",scrollHandler)
    }
  };

  const getSelectData = () => {
   
    if( !typeCode?.length) {
    setSelectContent([])
    return
    }else{
      getAdg(typeCode).then((res) => {
        if(res?.length > 1){
          setSelectContent(res)
          if(res[0]?.code === typeCode) {
            setProduct({
              ...newProduct,
              type:res[0].code
            })
          }
        }  
        else if(res?.length === 1){
          setSelectContent(res)
          setProduct({
            ...newProduct,
            type:res[0].code
          })
        }else{
          setSelectContent([{id:"", title:t("authorize.errors.adgcode"), code:""}])
        }
      })
    } 
  };

  useEffect(() => {
    fetching && !isFilter &&
    queryFunction(dataGroup,currentPage).then((res) => { 
    setFetching(false)
      if(res?.data?.length === 0){
        return setIsFilter(true)
      }else if(!content?.length ) {
        setContent([...res?.data])
      }
      else{
        setContent([...content, ...res?.data])
      }
      setCurrentPage(currentPage + 1) 
      setTotalCount(res?.headers["count"])
    })
      .finally(() => {
      setFetching(false)
    });

}, [fetching, dataGroup, isLogin]);

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler)
    return function () {
      document.removeEventListener("scroll",scrollHandler)
    } 
  }, []);

  useEffect(() => {
    setFetching(true)
    setContent([])
  },[])

  return(
    <div className={styles.productPage}>
      <HomeNavigation 
        t={t}
        setOpenNewProduct={setOpenNewProduct}
        openNewProd={openNewProd}
        changeStatus={changeStatus}
        byBarCodeSearching={byBarCodeSearching} 
        setCurrentPage={setCurrentPage}
        setMessage={setMessage}
        message={message}
        dataGroup={dataGroup}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setFrom={setFrom}
        focusInput={focusInput}
      />
      {message ? 
        <div style={{margin:"20% auto",color:"grey"}}>
          <h1>{message}</h1>
        </div> :
        <HomeContent
          t={t}
          measure={measure}
          setToBasket={setToBasket}
          content={content}
          deleteAndRefresh={deleteAndRefresh}
          changeStatus={changeStatus} 
          deleteBasketItem={deleteBasketItem}
          basketExist={basketExist}
          dataGroup={dataGroup}
          selectContent={selectContent}
          getSelectData={getSelectData}         
          typeCode={typeCode}
          setTypeCode={setTypeCode}
        />
      }
      {openNewProd && <AddNewProduct 
        t={t} 
        newProduct={newProduct}
        setProduct={setProduct}
        setOpenNewProduct={setOpenNewProduct}
        openNewProd={openNewProd}
        changeStatus={changeStatus}
        measure={measure}
        getSelectData={getSelectData}
        typeCode={typeCode}
        setTypeCode={setTypeCode}
        selectContent={selectContent}
        setSelectContent={setSelectContent}
        globalMessage={snackMessage}
        setGlobalMessage={setSnackMessage}
        setGlobalType={setType}
      />}
      <Dialog open={Boolean(type)}>
        <SnackErr open={snackMessage} type={type} close={setType} message={snackMessage}/>
      </Dialog>
     

       <Dialog open={fetching}> 
        <Loader close={setFetching} />
     </Dialog>
    </div>
  )
};

export default memo(HomePage);
