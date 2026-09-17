import { memo , useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import Loader from "../loading/Loader";
import HomeNavigation from "./HomeNavigation";
import PaginationSnip from "../pagination";
import AddNewProduct from "./product/AddNewProduct";
import { getAdg, removeProduct, removeProductList } from "../../services/products/productsRequests";
import { flattenCategories, getCategories, normalizeCategoryTree } from "../../services/categories/categoriesRequests";
import { Dialog } from "@mui/material";
import SnackErr from "../dialogs/SnackErr";

import styles from "./index.module.scss";
import HomeContent from "./content/HomeContent";
import { useLocation, useNavigate } from "react-router-dom";
import { loadResources } from "i18next";
import { PlaySound, useSuccessSound } from "../../modules/PlaySound";
import ConfirmDialog from "../dialogs/ConfirmDialog";

const initState = {
  purchasePrice: "",
  price: "",
  type: "",
  brand: "",
  name: "",
  discount: "",
  remainder: "",
  barCode: "",
  innerCode: "",
  photo:"",
  measure:"",
  pan: 0,
  dep: 0,
  categoryIds: []
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
  productCategoryId,
  setProductCategoryId,
  setBasketContent
}) => {
  const {t, i18n} = useTranslation();
  const navigate = useNavigate();
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
  const [categories, setCategories] = useState([]);
  const [selectedMainId, setSelectedMainId] = useState(null);
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [openBulkDeleteConfirm, setOpenBulkDeleteConfirm] = useState(false); 

  const changeStatus = async(str) => {
    setFlag(flag+1)
    const newSearchParams = new URLSearchParams(search);
    await setCurrentPage(page || 1)
    setDataGroup(str)
    newSearchParams.set("status", str);
    
    setProduct(initState)
  };
  const playSuccess = useSuccessSound();

  const deleteAndRefresh = async(id) => {
    await removeProduct(id).then((res) => {
      if(res?.status === 200) {
        playSuccess()
        deleteBasketItem(id)
        const newArr = content.filter(item => item?.id !== id)
        setContent(newArr)
        setSnackMessage(t("dialogs.done"))
        setType("success")
      }
    })
  };

  const toggleBulkSelectMode = () => {
    if (bulkSelectMode) {
      setBulkSelectMode(false);
      setSelectedProductIds([]);
      return;
    }
    setBulkSelectMode(true);
  };

  const toggleProductSelect = (id) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const deleteSelectedProducts = async () => {
    const ids = selectedProductIds.filter(Boolean);
    setOpenBulkDeleteConfirm(false);
    if (!ids.length) return;
    setFetching(true);
    const res = await removeProductList(ids);
    setFetching(false);
    if (res?.status === 200) {
      playSuccess();
      ids.forEach((id) => {
        const product = (content || []).find((item) => item?.id === id);
        deleteBasketItem(id, product?.isEmark, product?.barCode);
      });
      setContent((prev) => (prev || []).filter((item) => !ids.includes(item?.id)));
      setSnackMessage(t("dialogs.done"));
      setType("success");
      setBulkSelectMode(false);
      setSelectedProductIds([]);
      setFlag((current) => current + 1);
      return;
    }
    setSnackMessage(t("dialogs.wrong"));
    setType("error");
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
    let cancelled = false;
    (async () => {
      const tree = await getCategories();
      if (cancelled) return;
      setCategories(normalizeCategoryTree(tree));
    })();
    return () => { cancelled = true; };
  }, [i18n.language]);

  useEffect(() => {
    setProductCategoryId?.(selectedSubId ?? selectedMainId ?? null);
  }, [selectedMainId, selectedSubId, setProductCategoryId]);

  useEffect(() => {
    setSelectedProductIds([]);
  }, [page, status, productCategoryId]);

  useEffect(() => {
    setFetching(true)
    queryFunction(status, page, productCategoryId).then((res) => { 
      if(res){
        // playSuccess();
        setFetching(false)
        setTotalCount(res?.headers["count"])
        setContent(res?.data)
      }
    })
  }, [page, flag, status, productCategoryId]);

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
        categories={categories}
        selectedMainId={selectedMainId}
        selectedSubId={selectedSubId}
        onSelectMain={(id) => {
          setSelectedMainId(id);
          setSelectedSubId(null);
          setCurrentPage(1);
          navigate(`/prods?status=${status}&page=1`);
        }}
        onSelectSub={(id) => {
          setSelectedSubId(id);
          setCurrentPage(1);
          navigate(`/prods?status=${status}&page=1`);
        }}
        onCategoriesChange={(nextTree) => {
          setCategories(nextTree || []);
          const ids = new Set(flattenCategories(nextTree || []).map((item) => item.id));
          if (selectedMainId && selectedMainId !== 0 && !ids.has(selectedMainId)) {
            setSelectedMainId(null);
            setSelectedSubId(null);
          } else if (selectedSubId && selectedSubId !== 0 && !ids.has(selectedSubId)) {
            setSelectedSubId(null);
          }
        }}
        bulkSelectMode={bulkSelectMode}
        selectedCount={selectedProductIds.length}
        onToggleBulkSelect={toggleBulkSelectMode}
        onRequestBulkDelete={() => setOpenBulkDeleteConfirm(true)}
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

        setBasketContent={setBasketContent}
        setFrom={setFrom}
        selectMode={bulkSelectMode}
        selectedProductIds={selectedProductIds}
        onToggleSelect={toggleProductSelect}
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

        setFrom={setFrom}
        from={from}
      />}
      <ConfirmDialog
        open={openBulkDeleteConfirm}
        close={setOpenBulkDeleteConfirm}
        func={deleteSelectedProducts}
        title={t("buttons.remove")}
        question={t("productinputs.confirmDeleteProducts")}
      />
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
