import { memo, useRef, useEffect, useState } from "react";

import HistoryItems from "./HistoryItems";

import { Alert, Dialog, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useTranslation } from "react-i18next";

const HistoryContent = ({
  content,
  columns,
  setLoad,
  flag,
  setFlag,
  pageName,
  logOutFunc,
  paymentInfo,
  setPaymentInfo,
  setToBasket,
  setOpenBasket,
  setOpenWindow,
  deleteBasketGoods,
  getHistoryByStartAndEndDates
}) => {
  const [filterBody, setFilterBody] = useState([]);
  const [message, setMessage] = useState({m:"",t:""})
  const [reveredLink,setReverdLink] = useState("")
  const ref = useRef();
  const {t} = useTranslation();

  const filterBodyFill = () => {
    const newBody = [];
    columns.map((item) => item?.checked ? newBody.push(item?.key): null)
    setFilterBody(newBody)
  };

  const messageAfterReverse = (urlString) => {
    setFlag((flag) => urlString)
    setMessage({m:t("dialogs.welldone"),t:"success"})

  };
  const handleCloseMessage = () => {
    setMessage({m:"",t:""})
    setReverdLink(flag)
  }

  useEffect(() => {
    filterBodyFill()
  }, [columns]);

  useEffect(() =>{
    reveredLink && ref.current.click()
  }, [reveredLink]);

  return (
    <div>
      <a href={reveredLink} target="_blank" ref={ref} rel="noreferrer" > </a>
  
        <TableContainer style={{fontSize:"120%"}}component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns && columns.map((item, index) => item?.checked ? <TableCell key={index}> <strong>{t(item?.title)}</strong> </TableCell> : null)}
              </TableRow>
            </TableHead>
            <TableBody style={{fontSize:"60%"}}>
              {content &&  content.map((item, index) => (
                <HistoryItems
                  key={index}
                  item={item} 
                  t={t} 
                  filterBody={filterBody} 
                  setLoad={setLoad}
                  pageName={pageName}
                  logOutFunc={logOutFunc}
                  date={new Date(item?.date)}
                  messageAfterReverse={messageAfterReverse}
                  setReverdLink={setReverdLink}
                  paymentInfo={paymentInfo}
                  setPaymentInfo={setPaymentInfo}
                  setToBasket={setToBasket}
                  setOpenBasket={setOpenBasket}
                  setOpenWindow={setOpenWindow}
                  deleteBasketGoods={deleteBasketGoods}
                />
              ))}
              </TableBody>
          </Table>
        </TableContainer>
      {message?.m && 
        <Dialog open={Boolean(message?.m)}>
          <Alert type={message?.t} onClose={() =>handleCloseMessage({m:"",t:""})}>{message?.m}</Alert> 
        </Dialog>
      }
    </div>
  )
};

export default memo(HistoryContent);
