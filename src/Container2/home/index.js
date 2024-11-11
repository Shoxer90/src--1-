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
  searchValue, 
  setSearchValue, 
  byBarCodeSearching,
  isLogin,
  flag,
  setFetching,
  fetching
}) => {
  
  const [openNewProd, setOpenNewProduct] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [snackMessage, setSnackMessage] = useState("");
	const [typeCode, setTypeCode] = useState();
  const [selectContent, setSelectContent] = useState();
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
    pan: 0,
    dep: 0
  }); 

  const changeStatus = async(str) => {
    await setCurrentPage(1)
    setDataGroup(str)
    setFetching(true)
    setProduct({
      measure: "",
      purchasePrice: "",
      price: "",
      type: "",
      brand: "",
      name: "",
      discount: 0,
      remainder: "",
      photo:"",
      dep:0
    })
  };
  
  const deleteAndRefresh = async(id) => {
    await removeProduct(id).then((res) => {
      if(res?.status === 200) {
        // setFetching(true)
        deleteBasketItem(id)
        const newArr = content.filter(item => item?.id !== id)
        setContent(newArr)
        setSnackMessage(t("dialogs.done"))
        setType("success")
      }
    })
  };

  const getSelectData = () => {
    getAdg(typeCode).then((res) => {
      if(res?.length > 1){
        setSelectContent(res)
        res?.forEach((item) => (
          item?.code === typeCode ?
          setProduct({
            ...newProduct,
            type: item?.code
          }) : null
        ))
      }else if(res?.length === 1){
        setSelectContent(res)
        setProduct({
          ...newProduct,
          type:res[0].code
        })
      }else{
        setProduct({
          ...newProduct,
          type:""
        })
        setSelectContent([])
      }
    })
  };

  const scrollHandler = (e) => { 
    setFetching(false)
    if(content?.length <= +totalCount){
      if(e.target.documentElement.scrollHeight - (
        e.target.documentElement.scrollTop + window.innerHeight) < 100) {
        setFetching(true)
      }
    }else{
      document.removeEventListener("scroll",scrollHandler)
    }
  };

  useEffect(() => {
    setFetching(true)
  },[]);

  useEffect(() => {
    if(searchValue)return
    fetching && queryFunction(dataGroup, currentPage).then((res) => { 
      setTotalCount(res?.headers["count"])
      setFetching(false)
      if(res?.data?.length === 0){
       return 
      }else{
        setContent([...content, ...res?.data])
      }
      setCurrentPage(currentPage + 1) 
    })

    if(totalCount && totalCount > content?.length){
      document.addEventListener("scroll", scrollHandler)
      return function () {
        document.removeEventListener("scroll", scrollHandler)
      } 
    }
    
  }, [fetching, dataGroup, isLogin, openNewProd, content,flag]);

  return(
    <div className={styles.productPage}>
      <HomeNavigation 
        byBarCodeSearching={byBarCodeSearching} 
        t={t}
        setOpenNewProduct={setOpenNewProduct}
        setCurrentPage={setCurrentPage}
        setSearchValue={setSearchValue}
        changeStatus={changeStatus}
        searchValue={searchValue}
        openNewProd={openNewProd}
        dataGroup={dataGroup}
        setDataGroup={setDataGroup}
        setFrom={setFrom}
        setContent={setContent}
      />
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
        setDataGroup={setDataGroup} 
        setFetching={setFetching} 
        setContent={setContent}
      />
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
        setFetching={setFetching}
        setContent={setContent}
        content={content}
      />}
      {/* <ConfirmDialog
        t={t}
        func={}
        open={notification}
        title={notification[0]}
        close={}
        content={}
        nobutton={}
        buttonTitle={}
        question={}
      /> */}
     
      <Dialog open={Boolean(type)}>
        <SnackErr open={snackMessage} type={type} close={setType} message={snackMessage}/>
      </Dialog>
      <Dialog open={!!fetching}> 
        <Loader close={setFetching} />
      </Dialog>
    </div>
  )
};

export default memo(HomePage);
