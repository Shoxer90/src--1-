import React,{useEffect,useState} from 'react'
import { productChangesHistory,getProductsSaleByDays } from '../../services/products/productsRequests';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Updates from './Updates';
import styles from "./index.module.scss"
import { memo } from 'react';
import { Button } from '@mui/material';
import Sells from './Sells';
import { dateFormat } from '../../modules/modules';
import { useMemo } from 'react';

const ProductChanges = ({logOutFunc, t}) => {
  const navigate = useNavigate();
  const init = new Date().setMonth(new Date().getMonth()-1);
  const [itemLastUpdates,setItemLastUpdates] = useState(false);
  const [selectedItemId, setSelectedItemId]=useState(0);
  const [active,setActive]=useState(false);
  const [sells, setSells] = useState([]);
  const [titles,setTitles] = useState([]);
  const [dateArr, setDateArr] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [longTitlePage,setLongTitlePage] = useState([]);

  const productsSaleByDays = async (dateState,id="All") => {
    const generator = {
      date: [],
      title: []
    }
    await getProductsSaleByDays(dateState,id).then(( res ) => {
      const longTit = res.map(item =>item.productTitle)
      setLongTitlePage(longTit)
      if(id !=="All"){
        const newAr = res.filter(item=>item.productId === id)
        setSells(newAr)
        newAr.map((item) => generator.title.push(item.productTitle))
        res[0].byDates.map((item) => (
         generator.date.push(
           `${new Date(item.time)
             ?.toLocaleString(
             'en-us',{day: 'numeric', month:'short', year:'numeric'})
           }`
         )
       ))
      }else{
        setSells(res)
        res.map((item) => generator.title.push(item.productTitle))
        res[0].byDates.map((item) => (
          generator.date.push(
            `${new Date(item.time)?.toLocaleString(
              'en-us',{day: 'numeric', month:'short', year:'numeric'})
            }`
          )
        ))
      }
    })
    setDateArr(generator.date)
    setTitles(generator.title)
  };


  const productChangesHist = async () => {
    await productChangesHistory().then(( res ) => {
      res === 401 ? logOutFunc() : setUpdates(res)
    })
  }; 

  const changeRoute = (str) => {
    if(str === "updates"){
      setActive(false)
    }else if(str === "sells") {
      setActive(true)
    }
    navigate(`/product-info/${str}?prod=All`)
  };

  useEffect(() => {
    productsSaleByDays({
      end: dateFormat(new Date()),
      start: dateFormat(new Date(init))
    })
    productChangesHist()
    return navigate("/product-info/updates")
  },[]);
  
  return (
    <div className={styles.products}>
      <div className={styles.btnHistory}>
        <Button 
          onClick={(e)=>{changeRoute("updates")}} 
          sx= {{
            "&:hover":{backgroundColor:"#FFA500"},
            color: "#888888",
            padding:"10px", 
            width: "51vw",
            borderRadius: 0,
            border: "none", 
            borderTop: (!active? 3: 0),
            borderBottom:(active? 3:0),
            borderRight: (!active? 3:0),
            borderTopRightRadius: "10px",
            fontSize:"109%"
          }}
        >
         {t("updates.changes")}
        </Button>
        <Button 
          onClick={()=>{changeRoute("sells")}} 
          sx= {{
            "&:hover":{backgroundColor:"#FFA500"},
            color: "#888888",
            padding:"10px", 
            width:"49vw",
            borderRadius: 0,
            border: "none",
            borderTop: (active? 3: 0),
            borderLeft: (active? 3:0),
            borderBottom:(!active? 3:0),
            borderTopLeftRadius: "10px",
            fontSize:"110%"
          }}
        >
         {t("updates.sales")}
        </Button>
      </div>
      <Routes>
        <Route path="/updates" element={
          <Updates 
            t={t}
            updates={updates}
            setSelectedItemId={setSelectedItemId}
            setItemLastUpdates={setItemLastUpdates}
          />
        }/>
        <Route path="/sells" element={
          <Sells 
            t={t}
            longTitlePage={longTitlePage}
            productsSaleByDays={productsSaleByDays}
            sells={sells} 
            // 666666666
            titles={titles} 
            dateArr={dateArr}
          />
        }/>
      </Routes>
    </div>
  )
};

export default memo(ProductChanges);
