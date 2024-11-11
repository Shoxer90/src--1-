import { Button, TableCell, TableRow } from "@mui/material";
import { memo, useState } from "react";
import HdmStatus from "../../../modules/hdmStatus";
import { useEffect } from "react";
import { hdm_generate } from "../../../services/user/hdm_query";
import HistoryDetails from "../details/HistoryDetails";
import ReverseContainer from "../reverse";
import Receipt from "../newHdm/receipt/index";
// import Receipt from "../hdm/receipt/index";
import { taxCounting } from "../../../modules/modules";
// import ReverseBtn from "../hdm/receipt/ReverseBtn";
import ReverseDialog from "../editsales/index";
const HistoryItems = ({
  item, 
  t, 
  filterBody,
  setLoad,
  pageName,
  logOutFunc,
  initialFunc,
  date,
  messageAfterReverse,
  setReverdLink,
  paymentInfo,
  setPaymentInfo,
  setToBasket,
  setOpenBasket,
  setOpenWindow,
  deleteBasketGoods
}) => {

  const [openDetails, setOpenDetails] = useState(false);
  const [originTotal, setOriginTotal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openHDM, setOpenHDM] = useState(false);
  const [message, setMessage] = useState("");
  const [saleData, setSaleData] = useState({});
  const [taxCount,setTaxCount] = useState();
  const [amountForPrePayment, setAmountForPrePayment] = useState({});

  const reverseButton = true;

  const dialogManage = () => {
    setOpenDialog(!openDialog)
  };

  const openCloseHDM = async(id) => {
    setLoad(true)
    if(pageName?.status !== "Paid" && pageName?.status !== "Prepayment" ) {
      setOpenDetails(true)
      if(pageName?.status === "Canceled"){
        setReverdLink(item?.link)
      }
    }else if(!openHDM ){
      await hdm_generate(id).then((resp) => {
        setLoad(false)
        if(resp?.res?.printResponse){
          const tax = taxCounting(resp?.res?.printResponseInfo?.items)
          setTaxCount(tax)
          setSaleData(resp)
          setLoad(false)
          setOpenHDM(true)
        }else if(resp === 500){
        setLoad(false)
          setMessage(t("authorize.errors.noHdm"))
        }else if(resp === 401){
          setLoad(false)
          logOutFunc()
        }else{
          setLoad(false)
          setMessage(t("authorize.errors.noHdm"))
        }
      })
    }
    setLoad(false)
  };

  const fullPriceWithOutAdditionalDiscount = () => {
    const fullPrice = (item?.additionalDiscount/100 * item?.total) / (1- item?.additionalDiscount/100) + item?.total
    setOriginTotal(fullPrice)
  };

  useEffect(() => {
  item && fullPriceWithOutAdditionalDiscount()
}, [item?.status]);


  return (
    <>
    <TableRow
      key={item?.id}
      // onClick={()=> openCloseHDM(item?.id)}
      sx={{'&:hover':{backgroundColor: 'rgb(243, 243, 239)'}, }}
    >
      {filterBody.includes("id") && 
        <TableCell style={{padding:"0px 16px"}}>
          <strong>
            {item?.id}
            <HdmStatus t={t} status={Boolean(item?.ehdmStatus)} mode={Boolean(item?.hdmMode)} />

          </strong>
        </TableCell>
      }
      {filterBody.includes("date") && 
        <TableCell style={{padding:"0px 16px"}}>
          <div style={{display:"flex",flexFlow:"column wrap"}}>
            <div>
              {date?.getUTCDate()>9 ? date?.getUTCDate() : `0${ date?.getUTCDate()}`}/
              {date.getMonth()>8 ? date.getMonth()+1: `0${date.getMonth()+1}`}/
              {date.getFullYear()} {" "}
            </div>
            <div> 
              {date.getHours()>9? date.getHours(): `0${date.getHours()}`}:
              {date.getMinutes()>9? date.getMinutes(): `0${date.getMinutes()}`}:
              {date?.getSeconds()>9? date?.getSeconds(): `0${date?.getSeconds()}`}  
            </div>
          </div>
        </TableCell>
      }
      {filterBody.includes("recieptId") && 
        <TableCell style={{padding:"0px 5px", textAlign:"center"}}>
          <span style={{fontWeight:700}}>
            {item?.recieptId}
          </span>
          <div>
            <Button sx={{m:1,fontSize:"70%", background:'orange', width:"73.8px"}} size="small" onClick={()=> openCloseHDM(item?.id)} variant="contained">{t("buttons.view")}</Button>
            {pageName?.status  === "Paid" ? <Button size="small"  sx={{ fontSize:"65%", background:'#3FB68A'}} onClick={dialogManage} variant="contained" >{t("history.reverse")}</Button> :""}
          </div>
        </TableCell>
      }
      {pageName?.status !=="Prepayment" ? filterBody.includes("total") && <TableCell style={{padding:"0px"}}>{item?.total} <span style={{fontSize:"70%"}}>{t("units.amd")}</span></TableCell>:<TableCell> - </TableCell>}
     
      {filterBody.includes("cashAmount") && <TableCell>{item?.cashAmount} <span style={{fontSize:"70%"}}>{t("units.amd")}</span></TableCell>}
      {filterBody.includes("cardAmount") && <TableCell>{item?.cardAmount} <span style={{fontSize:"70%"}}>{t("units.amd")}</span></TableCell>}
      {filterBody.includes("prepaymentAmount") && <TableCell>{item?.saleType === 5 ? item?.total: item?.prePaymentAmount} <span style={{fontSize:"70%"}}>{t("units.amd")}</span></TableCell>}
      {filterBody.includes("additionalDiscount") && <TableCell style={{padding:"0px 16px"}}>{item?.additionalDiscount} </TableCell>}
      {filterBody.includes("saleType") && 
        <TableCell style={{padding:"0px 16px",fontSize:"85%"}}>
          {/* {item?.hdmMode === 2 &&  "fizikakan"} */}
          {item?.saleType === 1 && t("history.cash")}
          {item?.saleType === 2 && t("history.card")}
          {item?.saleType === 3 && t("history.qr")}
          {item?.saleType === 4 && t("history.link")}
          {item?.saleType === 5 && t("history.prepaymentRedemption")}
          {item?.saleType === 7 && t("history.combo")}
          {item?.saleType === 8 && t("history.cardCashSell")}
        </TableCell>
      }
      {filterBody.includes("partnerTin") && <TableCell style={{padding:"0px 16px"}}>{item?.partnerTin || t("history.notspecified")}</TableCell>}
      {filterBody.includes("cashier") && <TableCell style={{padding:"0px 16px"}}>{item?.cashier.fullName}</TableCell>}
      {/* 12.09 */}
      {/* <TableCell>
        <Button sx={{mr:1, background:'orange'}} onClick={()=> openCloseHDM(item?.id)} variant="contained">{t("buttons.view")}</Button>
        {pageName?.status  === "Paid" || pageName?.status  === "Prepayment" ? <Button sx={{mr:1, background:'#3FB68A'}} onClick={dialogManage} variant="contained" >{t("history.reverse")}</Button> :""}
      </TableCell> */}
    </TableRow>
    { openDetails && pageName?.status ==="Unpaid" &&
      <HistoryDetails
        openDetails={openDetails}
        id={item?.id} 
        products={item?.products}
        setOpenDetails={setOpenDetails}
        cashier={item?.cashier.id}
        originTotal={originTotal}
        date={item?.date}
        message={message}
        setMessage={setMessage}
        hdmMode={item?.hdmMode}
        item={item}
        recieptId={item?.recieptId}
        amountForPrePayment={amountForPrePayment} 
        setAmountForPrePayment={setAmountForPrePayment}
      />
    }
 
   { openHDM && (pageName?.status === "Paid"  || pageName?.status ==="Prepayment") &&
     <Receipt
      setOpenHDM={setOpenHDM}
      taxCount={taxCount}
      saleData={saleData}
      openHDM={openHDM}
      date={item?.date}
      totalPrice={originTotal}
      t={t}
      id={item?.id}
      reverseButton={reverseButton}
      dialogManage={dialogManage}
      userName={item?.cashier?.fullName}
    />
   } 
    {/* {openDialog &&
      <ReverseContainer
        products={item?.products}
        dialogManage={dialogManage}
        openDialog={openDialog}
        saleDetailId={item?.id}
        initialFunc={initialFunc}
        t={t}
        setOpenHDM={setOpenHDM}
        messageAfterReverse={messageAfterReverse}
        saleInfo={saleData}
        amountForPrePayment={amountForPrePayment} 
        setAmountForPrePayment={setAmountForPrePayment}
        detailsData={item}
      />
    } */}
    { openDialog && <ReverseDialog
      openDialog={openDialog}
      setOpendDialog={setOpenDialog}
      products={item?.products}
      item={item}
      messageAfterReverse={messageAfterReverse}
      paymentInfo={paymentInfo}
      setPaymentInfo={setPaymentInfo}
      setToBasket={setToBasket}
      setOpenBasket={setOpenBasket}
      setOpenWindow={setOpenWindow}
      deleteBasketGoods={deleteBasketGoods}
    /> }
    </>
  )
};

export default memo(HistoryItems);
