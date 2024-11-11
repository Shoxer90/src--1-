import { memo, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { getPrepayment } from "../../services/products/productsRequests";
import CardForPrepayment from "./CardForPrepayment";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import Loader from "../loading/Loader";
import { Dialog, Pagination, PaginationItem } from "@mui/material";
import PaginationSnip from "../pagination"

const PrePaymentList = ({
  setOpenBasket, 
  setToBasket,
  setOpenWindow,
  deleteBasketGoods, 
  setPaymentInfo,
  paymentInfo,
  flag
}) => {
  const search = useLocation().search;
  const currentPage = + (new URLSearchParams(search).get("page")) || 1 ;
  const [page, setPage] = useState();
  const [count, setCount] = useState();
  const [list, setList] = useState([]);
  const [reload, setReload] = useState(false);
  const [screenWidth, setScreenWidth] = useState();
  const {t} = useTranslation();


  window.addEventListener('resize', function(event) {
    setScreenWidth(window.innerWidth)
  }, true);
  

  const getPrepaymentList = () => {
    getPrepayment({page: currentPage, count: 24, searchString: ""}).then((res) =>{
      setList(res?.data)
      setCount(res?.count)
    })
  };

  useEffect(() => {
    setList([])
    setPage(currentPage)
    getPrepaymentList()
  },[currentPage, flag]);


  return (
    <div className={styles.container}>
        {
          list.length ?
          <>
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
                  setReload={setReload}
                  reload={reload}
                />
              )}
            </div>
            <div style={{display:"flex", justifyContent:"center"}}>
              <Pagination
                page={page}   
                count={Math.ceil(count / 24)}
                color="secondary"
                size={screenWidth < 450 ? "small" : "large"}
                renderItem={(item) => (
                  <PaginationItem
                    component={Link}
                    to={`/prepayment?page=${item?.page}`}
                    {...item}
                  />
                )}
              />
            </div>
          </>: <h4 style={{color:"lightgrey", marginTop:"50px"}}>{t("history.noPrepaymentReciepts")}</h4>
          // </>: <Dialog open={!list.length}><Loader /></Dialog>
        }
    </div>
  )
};

export default memo(PrePaymentList);
