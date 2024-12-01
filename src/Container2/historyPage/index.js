import React, { memo } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { filterByDate, getSaleProducts } from "../../services/user/userHistoryQuery";
import styles from "./index.module.scss";
import SearchHistory from "./searchtab/SearchHistory";
import { useLocation } from "react-router-dom";
import PaginationSnip from "../pagination";
import { Dialog } from "@mui/material";
import Loader from "../loading/Loader";
import { loadResources } from "i18next";
import HistoryContent from "./content/HistoryContent";
import { columnNames } from "../../services/baseUrl";
import { getPrepayment } from "../../services/products/productsRequests";


const HistoryPage = ({logOutFunc, t, paymentInfo, setPaymentInfo,
  setToBasket,
  setOpenBasket,
  setOpenWindow,
  deleteBasketGoods
}) => {
  const perPage = 10;
  const search = useLocation().search;
  // const status = {status:new URLSearchParams(search).get("status")};
  const [status, setStatus] = useState({status:new URLSearchParams(search).get("status")})
  const page = + (new URLSearchParams(search).get("page")) || 1 ;
  
  const coordinator = {
    startDate: new URLSearchParams(search).get('startDate'),
    endDate: new URLSearchParams(search).get('endDate'),
  };
  
  const [historyContent, setHistoryContent] = useState();
  const [isLoad, setLoad] = useState(true);
  const [hidepagination, setHidePagination] = useState(false);
  const [columns, setColumns] = useState([]);


  const refreshPage = item =>{
    setLoad(true)
  };

  const filterFunc = async(value) => {
    setLoad(true)
    setHidePagination(true)
    await filterByDate(value, status?.status).then((resp) => {
      setLoad(false)
      setHistoryContent(resp)
    })
    historyContent === 401 ? logOutFunc(): setLoad(false)
  };

    const initialFunc = async(data,page=1) => {
      setLoad(true)
      let response = []
      if(data === "Paid"){
        response = await getSaleProducts("GetSaleProductsByPage", {page: page, count: perPage})
      }else if(data === "Unpaid"){
        response = await getSaleProducts("GetNotPaidSaleProductsByPage", {page: page, count: perPage})
      }else if(data === "Canceled"){
       response = await getSaleProducts("GetReveredHistoryByPage", {page: page, count: perPage})
      }else if(data === "Prepayment"){
        response = await getPrepayment({page: page, count: perPage, searchString:"", isPayd: false})
       }else if(data === "EndPrepayment"){
        response = await getPrepayment({page: page, count: perPage, searchString:"", isPayd: true})
       }
      if(response === 401){
        logOutFunc()
      }else{
        setHistoryContent(response)
        setLoad(false)
      }
      setStatus({status: data})
    };

  useEffect(() => {
    if(coordinator?.startDate) {
      filterFunc(coordinator, status?.status)
      setHidePagination(true)
    }else{
      setHidePagination(false)
      initialFunc(status?.status, page)
    }

  }, [page]);

  useEffect(() => {
    if(!localStorage.getItem("historyColumn")){
      localStorage.setItem("historyColumn", JSON.stringify(columnNames))
    }
    setColumns(JSON.parse(localStorage.getItem("historyColumn")))
  },[]);

  return(
    historyContent ? 
    <div className={styles.history}>
      {isLoad && 
        <Dialog open={!!isLoad}>
          <Loader />
        </Dialog>
      } 
      <div className={styles.history_search}>
        <SearchHistory 
          filterFunc={filterFunc} 
          coordinator={coordinator} 
          t={t}
          initialFunc={initialFunc}
          status={status?.status}
          setStatus={setStatus}
          columns={columns}
          setColumns={setColumns}
        />
      </div>
      <div className={styles.historyContent}> 
        <HistoryContent 
          content={historyContent?.data}
          t={t}
          columns={columns}
          setLoad={setLoad}
          pageName={status}
          logOutFunc={logOutFunc}
          initialFunc={initialFunc}
          paymentInfo={paymentInfo} 
          setPaymentInfo={setPaymentInfo}
          setToBasket={setToBasket}
          setOpenBasket={setOpenBasket}
          setOpenWindow={setOpenWindow}
          deleteBasketGoods={deleteBasketGoods}
        />
        {!hidepagination && <PaginationSnip 
        style={{
          position:"fixed", 
          bottom:0, 
          width:"100dvw",  
          display:"flex",
          justifyContent: "center"
        }}
          page={page}
          navig_Name={`history?status=${status?.status}`}
          refreshPage={refreshPage}
          loader={loadResources}
          pageCount={historyContent.count}
          perPage={perPage}
        />}
      </div>
    </div>:
    <Dialog open={!historyContent}>
      <Loader />
    </Dialog>
  )
};

export default memo(HistoryPage);
