import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import HistoryItems from "./HistoryItems";

import { Alert, Dialog, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import PdfReceiptDialog from "../newHdm/PdfReceiptDialog";

const HistoryContent = ({
  content,
  columns,
  setLoad,
  flag,
  setFlag,
  pageName,
  logOutFunc,
}) => {
  const {t} = useTranslation();

  const [filterBody, setFilterBody] = useState([]);
  const [openPdfDial, setOpenPdfDial] = useState({
    status: false,
    link:""
  })

  const filterBodyFill = () => {
    const newBody = [];
    columns.map((item) => item?.checked ? newBody.push(item?.key): null)
    setFilterBody(newBody)
  };

  const messageAfterReverse = (urlString) => {
    setFlag( urlString)
    setOpenPdfDial({
       status:true,
       link: urlString
    })
  };

  useEffect(() => {
    filterBodyFill()
  }, [columns]);
  
  return (
    <div>
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
                  filterBody={filterBody} 
                  setLoad={setLoad}
                  pageName={pageName}
                  logOutFunc={logOutFunc}
                  date={new Date(item?.date)}
                  messageAfterReverse={messageAfterReverse}
                />
              ))}
              </TableBody>
          </Table>
        </TableContainer>
      <PdfReceiptDialog
        open={openPdfDial?.status}
        close={()=>setOpenPdfDial({status:false,link:""})}
        text={t("dialogs.welldone")}
        func={()=>{
          window.open( openPdfDial?.link, '_blank', 'noopener,noreferrer')
          setOpenPdfDial({status:false,link:""})
        }}
      />
    </div>
  )
};

export default memo(HistoryContent);
