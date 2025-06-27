import { memo , useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import Loader from "../loading/Loader";
import HomeNavigation from "./HomeNavigation";
import PaginationSnip from "../pagination";
import AddNewProduct from "./product/AddNewProduct";
import { getAdg, removeProduct } from "../../services/products/productsRequests";
import { Dialog } from "@mui/material";
import SnackErr from "../dialogs/SnackErr";

import styles from "./index.module.scss";
import HomeContent from "./content/HomeContent";
import { useLocation } from "react-router-dom";
import { loadResources } from "i18next";

const initState = {
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
};

const HomePage = ({
  measure,
  dataGroup,
  setDataGroup,
  setContent,
  content,
  setToBasket,
  deleteBasketItem,
  basketExist,
  queryFunction,
  setCurrentPage,
  setFrom,
  from,
  searchValue, 
  setSearchValue, 
  byBarCodeSearching,
  flag,
  setFlag,
  setFetching,
  fetching,
  setOpenBasket,
  
}) => {
  const {t} = useTranslation();
  const [openNewProd, setOpenNewProduct] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const perPage = 20;
  const search = useLocation().search;
  const status = new URLSearchParams(search).get("status") || "GetAvailableProducts";
  const page = +new URLSearchParams(search).get("page") || 1;
  const [snackMessage, setSnackMessage] = useState("");
	const [typeCode, setTypeCode] = useState();
  const [selectContent, setSelectContent] = useState();
  const [type, setType] = useState();

  const [newProduct,setProduct] = useState(initState); 

  const changeStatus = async(str) => {
    setFlag(flag+1)
    const newSearchParams = new URLSearchParams(search);
    await setCurrentPage(page || 1)
    setDataGroup(str)
    newSearchParams.set("status", str);
    
    setProduct(initState)
  };
  
  const deleteAndRefresh = async(id) => {
    await removeProduct(id).then((res) => {
      if(res?.status === 200) {
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

  useEffect(() => {
    setFetching(true)
    queryFunction(status, page).then((res) => { 
      console.log(res,"res")
      if(res){
        setFetching(false)
        setTotalCount(res?.headers["count"])
        setContent(res?.data)
      }
    })
  }, [page, flag, status]);

  return(
    <div className={styles.productPage}>
      <HomeNavigation 
        byBarCodeSearching={byBarCodeSearching} 
        setOpenNewProduct={setOpenNewProduct}
        setCurrentPage={setCurrentPage}
        setSearchValue={setSearchValue}
        changeStatus={changeStatus}
        searchValue={searchValue}
        dataGroup={dataGroup}
        status={status}
        setFrom={setFrom}

        from={from}
        setContent={setContent}
      />
      <HomeContent
        measure={measure}
        setToBasket={setToBasket}
        content={content}
        deleteAndRefresh={deleteAndRefresh}
        deleteBasketItem={deleteBasketItem}
        basketExist={basketExist}
        getSelectData={getSelectData}         
        typeCode={typeCode}
        setTypeCode={setTypeCode}
        setFetching={setFetching} 
        setContent={setContent}
        setCurrentPage={setCurrentPage}
        setOpenBasket={setOpenBasket}
      />
      { totalCount/perPage > 1 &&
        <PaginationSnip 
          style={{
            position:"fixed", 
            bottom:0, 
            width:"100dvw",  
            display:"flex",
            justifyContent:"center"
          }}
          page={page}
          navig_Name={`prods?status=${status}`}
          loader={loadResources}
          pageCount={totalCount}
          perPage={perPage}
        />
      }
      {openNewProd && <AddNewProduct 
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
        setFetching={setFetching}
        setContent={setContent}
        setGlobalMessage={setSnackMessage}
        setGlobalType={setType}
        setFlag={setFlag}
        flag={flag}
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
