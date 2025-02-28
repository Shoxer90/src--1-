import React, { memo } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getSaleProducts } from "../../services/user/userHistoryQuery";
import styles from "./index.module.scss";
import SearchHistory from "./searchtab/SearchHistory";
import { useLocation, useSearchParams } from "react-router-dom";
import PaginationSnip from "../pagination";
import { Dialog } from "@mui/material";
import Loader from "../loading/Loader";
import { loadResources } from "i18next";
import HistoryContent from "./content/HistoryContent";
import { columnNames } from "../../services/baseUrl";
import { getPrepayment } from "../../services/products/productsRequests";
import { useTranslation } from "react-i18next";

const HistoryPage = ({logOutFunc}) => {
  const {t} = useTranslation();
  const perPage = 10;
  const search = useLocation().search;

  const [searchParams,setSearchParams] = useSearchParams();
  const [initDate, setInitDate] = useState()
  const [status, setStatus] = useState({status:new URLSearchParams(search).get("status")});
  const [historyContent, setHistoryContent] = useState();
  const [isLoad, setLoad] = useState(true);
  const [columns, setColumns] = useState([]);
  const [flag, setFlag] = useState(false)
  
  const page = + (new URLSearchParams(search).get("page")) || 1 ;
  const coordinator = {
    startDate: new Date(),
    endDate: new URLSearchParams(search).get('endDate'),
  };

  const getHistoryByStartAndEndDates = async(data="Paid", page=1, date) => {
    setLoad(true)
    setSearchParams({
      status:data,
      page:page,
      startDate: date?.startDate.slice(0,10) || searchParams.get("startDate"),
      endDate: date?.endDate?.slice(0,10) || searchParams.get("endDate"),
    })
    let response = [];
    if(data === "Paid") {
      response = await getSaleProducts("GetSaleProductsByPage", {page: page, count: perPage,byDate: date})
    }else if(data === "Unpaid") {
      response = await getSaleProducts("GetNotPaidSaleProductsByPage", {page: page, count: perPage,byDate: date})
    }else if(data === "Canceled") {
      response = await getSaleProducts("GetReveredHistoryByPage", {page: page, count: perPage, byDate: date})
    }else if(data === "Prepayment") {
      response = await getPrepayment({page: page, count: perPage, searchString:"", isPayd: true})
    }else if(data === "EndPrepayment") {
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

  const initialDateCreator = async() => {
    let currentDate = new Date();
    let previousDate = new Date(currentDate)
    previousDate.setMonth(currentDate.getMonth()-1)
    if(searchParams.get("endDate") !== null && searchParams.get("startDate") !== null) {
      currentDate = new Date(searchParams.get("endDate"));
      previousDate = new Date(searchParams.get("startDate"))
    }
    setInitDate({
      startDate: previousDate.toISOString(),
      endDate: currentDate.toISOString()
    })

    await getHistoryByStartAndEndDates(status?.status, page, {
      startDate: previousDate.toISOString(),
      endDate: currentDate.toISOString()
    })
  };

  useEffect(() => {
    initialDateCreator()
  }, [page, flag]);

  useEffect(() => {
    if(!localStorage.getItem("historyColumn")){
      localStorage.setItem("historyColumn", JSON.stringify(columnNames))
    }
    setColumns(JSON.parse(localStorage.getItem("historyColumn")))
  },[]);

  return(
    historyContent  && initDate?.startDate ? 
    <div className={styles.history}>
      {isLoad && 
        <Dialog open={!!isLoad}>
          <Loader />
        </Dialog>
      } 
      <div className={styles.history_search}>
        <SearchHistory 
          coordinator={coordinator} 
          t={t}
          initDate={initDate}
          setInitDate={setInitDate}
          status={status?.status}
          setStatus={setStatus}
          columns={columns}
          setColumns={setColumns}
          getHistoryByStartAndEndDates={getHistoryByStartAndEndDates}
          initialDateCreator={initialDateCreator}
          page={page}
        />
      </div>
    <div className={styles.historyContent}> 
        <HistoryContent 
          content={historyContent?.data}
          columns={columns}
          setLoad={setLoad}
          pageName={status}
          setFlag={setFlag}
          flag={flag}
          logOutFunc={logOutFunc}
        />
        { historyContent?.count/perPage > 1 &&
        <PaginationSnip 
          style={{
            position:"fixed", 
            bottom:0, 
            width:"100dvw",  
            display:"flex",
            justifyContent:"center"
          }}
          page={page}
          navig_Name={`history?status=${status?.status}`}
          loader={loadResources}
          pageCount={historyContent?.count}
          perPage={perPage}
        />}
      </div>
    </div>
    :
    <Dialog open={!historyContent}>
      <Loader />
    </Dialog>
  )
};

export default memo(HistoryPage);
