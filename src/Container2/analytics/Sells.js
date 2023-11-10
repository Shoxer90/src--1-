import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { memo } from "react";

import { Button, Dialog, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import styles from "./index.module.scss"
import DateBar from "./DateBar";
import Loader from "../loading/Loader";
import { dateFormat } from "../../modules/modules";
import { useLocation, useNavigate } from "react-router-dom";
import Chart from "react-google-charts";
   
function Sells({
  t,
  sells, 
  titles, 
  dateArr, 
  productsSaleByDays,
  longTitlePage,
}) {
  const search = useLocation().search;
  const [chart, setChart] = useState();
  const [params ,setParams] = useState(new URLSearchParams(search).get('prod') || "All");
  const [filterData,setFilterData] = useState()
  const navigate = useNavigate();
  const [id,setId] = useState("");
  const init = new Date();
  const [value, setValue] = useState({
    start: new Date().setMonth(init.getMonth()-1),
    end: new Date()
  });

 
  const options = {
    title: t("updates.graphic"),
    hAxis: {title: t("updates.days")},
    vAxis: {
      title: t("updates.count"),
      minValue: 0,
    },
    legend: { position: "right" },
  };
  
  const filterByDate = async(value) => {
    setChart()
    await productsSaleByDays({
      start:dateFormat(new Date(value.start)),
      end: dateFormat(new Date(value.end))
    },params)
  };
  
  const dataForChart = (arr,titleArr) => {
    const chartData = [[t("updates.days"), ...titleArr]];
    for(let i=0; i < dateArr?.length-1; i++){
      const eachDayData = []
      eachDayData.push(dateArr[i])
      arr.map(item => eachDayData.push(item?.byDates[i]?.count))
      chartData.push(eachDayData)
    }
    setChart(chartData)
  };

  const filterSells = async(id) => {
    setChart()
    setId(id)
    if(id === "All") dataForChart(sells, titles)
    else{
      const array = await sells.filter(item => item.productId === id)
      setFilterData(array[0])
      dataForChart(array, [array[0]?.productTitle])
      navigate(`?prod=${array[0]?.productTitle}`)
    }
  };

  const handleFilter = () => {
    filterByDate(value)
  };

  useEffect(() => {
    filterData ?
    filterSells(filterData?.productId) : 
    dataForChart(sells, titles)
  }, [sells, params]);

  return (
      <div className={styles.products_sells}>
      <div className={styles.products_sells_bar}>

        <DateBar 
          value={value}
          setValue={setValue}
          t={t}
          productsSaleByDays={productsSaleByDays} 
          setParams={setParams} 
          filterByDate={filterByDate} 
        />
        <div className={styles.products_sells_btn}>
          <Button
            variant="contained"
            onClick={handleFilter}
            style={{
              backgroundColor: "orange",
              fontSize: "small",
              marginLeft:5,
              padding:0,
            }}
          >
            {t("history.filterbydate")}
          </Button>
        </div>
        </div>
      <div className={styles.products_sells_chart}>
        { chart?.length > 1 ? 
          <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            data={chart}
            options={options}
          />:
          <Dialog
            open={!chart}
          >
            <Loader />
          </Dialog>
        }
      <div className={styles.products_sells_select}>
        <FormControl sx={{ width:"200px"}}>
          <InputLabel id="demo-simple-select-helper-label">{t("productinputs.name")}</InputLabel>
          <Select
            value={id}
            label={t("productinputs.name")}
            onChange={(e)=>filterSells(e.target.value)}
          >
            <MenuItem value="All">{t("updates.all")}</MenuItem>
            {longTitlePage.map((name, i) => (
              <MenuItem key={i} value={sells[i]?.productId}>{name}</MenuItem>
            ))}
          </Select>
      </FormControl>
    </div>
      </div>
      {!chart  && 
        <Dialog
          open={!chart}
        >
          <Loader />
        </Dialog>
      }  
    </div>
  );
}

export default memo(Sells);
  