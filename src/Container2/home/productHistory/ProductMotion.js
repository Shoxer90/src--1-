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
import { Card } from "@mui/material";
import ProductHistoryItem from "./ProductHistoryItem";

const Transition =forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProductMotion =  ({open, close, id, product}) => {
  const [dataType, setDataType] = useState("changes"); 
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
      data = await getProductHistory(id, 0, {...queryData,byDate: date});
    }else {
      data = await getProductSaleHistory(id, 0, {...queryData,byDate: date});
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
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar sx={{width:"100%", height:"100%" }}>
          
          <Typography sx={{ ml: 2, flex: 1 }} variant="h4" component="div">
            Inventory management {id}
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
        <HistoryFilter  />         
        <Card style={{margin:"20px"}}>
          {content?.length &&  dataType === "changes" && content?.map((item, index) => {
            return <ProductHistoryItem key={item.id} item={item} product={product} index={index} />
          })}

          {content?.length &&  dataType === "sales" && content?.map((item, index) => {
            return <ProductHistoryItem key={item.id} item={item} product={product} index={index} />
          })}
        </Card>
        {/* <ListItemButton>
          <ListItemText primary="Phone ringtone" secondary="Titania" />
        </ListItemButton>
        <Divider />
        <ListItemButton>
          <ListItemText
            primary="Default notification ringtone"
            secondary="Tethys"
          />
        </ListItemButton> */}
      </List>
    </Dialog>
  )
};

export default memo(ProductMotion);