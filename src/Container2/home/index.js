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
  changeStatus,
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
  isLogin
}) => {
  
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

  const getSelectData = () => {
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
        setSelectContent([{id:"", title:[], code:""}])
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
    fetching && 
    queryFunction(dataGroup,currentPage).then((res) => { 
    setFetching(false)
      if(res?.data?.length === 0){
        return 
      }else if(!content?.length) {
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
      document.removeEventListener("scroll", scrollHandler)
    } 
  }, []);
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
        setFrom={setFrom}
        setMessage={setMessage}
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
          setDataGroup={setDataGroup} 
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
      <Dialog open={!!fetching}> 
        <Loader close={setFetching} />
      </Dialog>
    </div>
  )
};

export default memo(HomePage);
