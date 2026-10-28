import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { getPrepayment } from "../../services/products/productsRequests";
import CardForPrepayment from "./components/CardForPrepayment";
import Loader from "../loading/Loader";
import PaginationSnip from "../pagination";

import { Dialog } from "@mui/material";

import styles from "./index.module.scss";

const PrePaymentList = ({
  setOpenBasket, 
  setToBasket,
  setOpenWindow,
  deleteBasketGoods, 
  setPaymentInfo,
  paymentInfo,
  flag,
  logOutFunc,
  setFrom,
  from
}) => {
  const search = useLocation().search;
  const currentPage = + (new URLSearchParams(search).get("page")) || 1 ;
  const [list, setList] = useState([]);
  const [count, setCount] = useState(20);
  const [load, setLoad] = useState(false);
  const {t} = useTranslation();

  const getPrepaymentList = () => {
    getPrepayment({page: currentPage, count: 24, searchString: "", isPayd:false}).then((res) =>{
      if(res?.data) {
        setList(res?.data)
        setCount(res?.count)
        setLoad(false)
      }else if(res === 401){
        logOutFunc()
      }
    })
  };

  useEffect(() => {
    setLoad(true)
    setList([])
    getPrepaymentList()
  },[currentPage, flag]);

  return (
    <div className={styles.container}>
      { list.length ? <>
        <h3>{t("history.pretransactions")}</h3>
        <div className={styles.container_cards}>
          {list.map((item) => 
            <CardForPrepayment 
              key={item?.id}
              item={item} 
              deleteBasketGoods={deleteBasketGoods} 
              setOpenBasket={setOpenBasket}
              setToBasket={setToBasket} 
              setOpenWindow={setOpenWindow} 
              setPaymentInfo={setPaymentInfo}
              paymentInfo={paymentInfo}
              getPrepaymentList={getPrepaymentList}
              setFrom={setFrom}
              from={from}
            />
          )}
        </div>
      </>:
      <h4 style={{color:"lightgrey", marginTop:"50px"}}>{t("history.noPrepaymentReciepts")}</h4> }
      <PaginationSnip
        page={currentPage}
        navig_Name="prepayment"
        pageCount={count}
        perPage={24}
      />
      <Dialog open={load}><Loader /></Dialog>
    </div>
  )
};

export default memo(PrePaymentList);
