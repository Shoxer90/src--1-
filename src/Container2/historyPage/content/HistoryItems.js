import { TableCell, TableRow } from "@mui/material";
import { memo, useState } from "react";
import HdmStatus from "../../../modules/hdmStatus";
import { useEffect } from "react";
import { hdm_generate } from "../../../services/user/hdm_query";
import HistoryDetails from "../details/HistoryDetails";
import ReverseContainer from "../reverse";
import Receipt from "../hdm/receipt/index";

const HistoryItems = ({
  item, 
  t, 
  filterBody,
  setLoad,
  pageName,
  logOutFunc,
  initialFunc,
  date,
  messageAfterReverse
}) => {

  const [openDetails, setOpenDetails] = useState(false);
  const [originTotal, setOriginTotal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openHDM, setOpenHDM] = useState(false);
  const [message, setMessage] = useState("");
  const [saleData, setSaleData] = useState({});
  const reverseButton = true;

  const dialogManage = () => {
    setOpenDialog(!openDialog)
  };

  const openCloseHDM = async(id) => {
    setLoad(true)
    if(pageName?.status !== "Paid" || item?.hdmMode) {
      setOpenDetails(true)
    }
       else if(!openHDM ){
      await hdm_generate(id).then((resp) => {
        setLoad(false)
        if(resp?.res?.printResponse){
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
      onClick={()=> openCloseHDM(item?.id)}
      sx={{'&:hover':{backgroundColor: 'rgb(243, 243, 239)'}}}
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
      {filterBody.includes("recieptId") && <TableCell style={{padding:"0px 16px"}}>{item?.recieptId}</TableCell>}
      {filterBody.includes("total") && <TableCell style={{padding:"0px 16px"}}>{item?.total} {t("units.amd")}</TableCell>}
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
          {/* {item?.saleType === 7 && t("history.redacted")} */}
          {item?.saleType === 8 && t("history.cardCashSell")}
        </TableCell>
      }
      {filterBody.includes("1") && <TableCell>{"not found "}</TableCell>}
      {filterBody.includes("2") && <TableCell>{"Cash not found"}</TableCell>}
      {filterBody.includes("3") && <TableCell>{"Casheless not found"}</TableCell>}
      {filterBody.includes("4") && <TableCell>{"Type not found"}</TableCell>}
      {filterBody.includes("5") && <TableCell>{"Prepayment redemption"}</TableCell>}
      {filterBody.includes("6") && <TableCell>{"reverse Part"}</TableCell>}
      {filterBody.includes("7") && <TableCell>{"reverse amount"}</TableCell>}
      {filterBody.includes("8") && <TableCell>{"reverse rec number"}</TableCell>}
      {filterBody.includes("9") && <TableCell>{"fiskal num"}</TableCell>}
      {filterBody.includes("partnerTin") && <TableCell style={{padding:"0px 16px"}}>{item?.partnerTin || t("history.notspecified")}</TableCell>}
      {filterBody.includes("cashier") && <TableCell style={{padding:"0px 16px"}}>{item?.cashier.fullName}</TableCell>}
      {filterBody.includes("10") && <TableCell style={{padding:"0px 16px"}}>{"fiskal num"}</TableCell>}
    </TableRow>
    { openDetails && (pageName !=="Paid" || item?.hdmMode === 2) &&
      <HistoryDetails
        t={t}
        openDetails={openDetails}
        id={item?.id} 
        products={item?.products}
        setOpenDetails={setOpenDetails}
        additionalDiscount={item?.additionalDiscount}
        total={item?.total}
        cashier={item?.cashier.id}
        originTotal={originTotal}
        date={item?.date}
        message={message}
        setMessage={setMessage}
        hdmMode={item?.hdmMode}
        item={item}
      />
    }
   { openHDM && pageName?.status === "Paid" &&
     <Receipt
       setOpenHDM={setOpenHDM}
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
   {openDialog &&
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
      />
   }
    </>
  )
};

export default memo(HistoryItems);
