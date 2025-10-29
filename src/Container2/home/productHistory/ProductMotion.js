import { forwardRef, memo, useEffect, useState } from "react";
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { getProductHistory, getProductSaleHistory } from "../../../services/products/productsRequests";
import HistoryFilter from "./HistoryFilter";
import { Box, Card, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import ProductHistoryItem from "./ProductHistory";
import { useTranslation } from "react-i18next";
import { Image } from "@mui/icons-material";
import ProductSaleHistory from "./ProductSaleHistory";
import ProductHistory from "./ProductHistory";

const Transition =forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const changeColumns = [];

const dateFormat = (str) => {
  const date = new Date(str);
  const formatted = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return formatted
    // return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(date)
  // }else if (lang === "ru") {
  //   return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })
  // }else {
  //   return  date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" , hour: "2-digit", minute: "2-digit", second: "2-digit" })
  // }
};

const ProductMotion =  ({open, close, id, product}) => {
  const {t}= useTranslation();
  const saleColumns = [
  "№",
  t("history.date"),
  t("history.checkNum"),
  t("updates.count"),
  t("basket.totalndiscount2"),
  t("basket.recieptPrice"),
  t("history.initialRemainder"),
  t("history.finalRemainder"),
  t("settings.paymentMethods")
];
  const [dataType, setDataType] = useState("sales"); 
  const [pageCount, setPageCount] = useState(0);
  const [content, setContent] = useState([]);  //"changes" / "sales"
  const [queryData, setQueryData] = useState({
    page: 1,
    count: 15,
    searchString: "",
    byDate: {
      startDate: "",
      endDate: ""
    }
  });


  const getProductMotion = async(date) => {
    let data = []
    if(dataType === "changes") {
      data = await getProductHistory(id, 1, {...queryData,byDate: date});
    }else {
      data = await getProductSaleHistory(id, 1, {...queryData,byDate: date});
    }
    setPageCount(data?.pageCount)
    setContent(data?.result)
  };

  const initialDateCreator = async() => {
    let currentDate = new Date();
    let previousDate = new Date(currentDate);
    previousDate.setMonth(currentDate.getMonth()-1);
     setQueryData({
      ...queryData,
      byDate: {
        startDate: previousDate.toISOString(),
        endDate: currentDate.toISOString() || new Date().toISOString()
      }
    })
    return getProductMotion({
      startDate: previousDate.toISOString(),
      endDate: currentDate.toISOString() 
    })
  };
    
 

    console.log(content, "CONTENT")

 useEffect(() => {
  if (open) {
    initialDateCreator();
  }
}, [open]);

  return (
    <Dialog
      open={!!open}
      fullScreen
      onClose={close}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative', color:"white", backgroundColor:"#F69221" }}>
        <Toolbar sx={{width:"100%", height:"100%" }}>
          
          <Typography sx={{ ml: 2, flex: 1 }} variant="h5" component="div">
            {t("history.inventory")}
          </Typography>
          
         <IconButton
            edge="start"
            color="inherit"
            onClick={close}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <List>
        <Box style={{display:"flex", alignItems:"center",marginBottom:"0px"}}>
          <img src="https://storex.payx.am/Images/616830_829.jpeg" style={{width:"80px", height:"50px", objectFit:"contain", marginLeft:"20px"}} />
          <Typography sx={{ ml: 5, flex: 1 }} variant="h4" component="div">
              {product?.name} "{product?.brand}"
          </Typography>
          <HistoryFilter  />         
        </Box>
        <Card style={{margin:"20px"}}>
          {content?.length &&  dataType === "changes" && content?.map((item, index) => {
            return <ProductHistoryItem key={item.id} item={item} product={product} index={index} dateFormat={dateFormat} />
          })}
        </Card>

    {/* <TableContainer component={Paper}> */}
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {
              saleColumns.map((col) => (
                <TableCell key={col} align="right">{col}</TableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {/* <ProductHistory content={content} dateFormat={dateFormat} /> */}
          <ProductSaleHistory content={content} dateFormat={dateFormat} />
        </TableBody>
      </Table>
      </List>
    </Dialog>
  )
};

export default memo(ProductMotion);