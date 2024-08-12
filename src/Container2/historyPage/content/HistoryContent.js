import { Alert, Dialog, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { memo, useRef } from "react";
import HistoryItems from "./HistoryItems";
import Loader from "../../loading/Loader";
import { useEffect } from "react";
import { useState } from "react";

const HistoryContent = ({
  content,
  t, 
  columns,
  setLoad,
  pageName,
  logOutFunc,
  initialFunc}) => {
    
  const [filterBody, setFilterBody] = useState([]);
  const [message, setMessage] = useState({m:"",t:""})
  const [reveredLink,setReverdLink] = useState("")
  
  const ref = useRef();

  const filterBodyFill = () => {
    const newBody = [];
    columns.map((item) => item?.checked ? newBody.push(item?.key): null)
    setFilterBody(newBody)
  };

  const messageAfterReverse = () => {
    setMessage({m:t("dialogs.welldone"),t:"success"})
    initialFunc("Paid")
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
      {!content ? <Loader /> :
        <TableContainer style={{fontSize:"120%"}}component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
                <TableRow>
                  {columns && columns.map((item, index) => item?.checked ? <TableCell key={index}> <strong>{t(item?.title)}</strong> </TableCell> : null)}
                </TableRow>
            </TableHead>
            <TableBody style={{fontSize:"60%"}}>
              {content &&  content.map((item, index) => (
                <HistoryItems item={item} 
                  index={index} 
                  t={t} 
                  key={index}
                  columns={columns} 
                  filterBody={filterBody} 
                  setLoad={setLoad}
                  pageName={pageName}
                  logOutFunc={logOutFunc}
                  initialFunc={initialFunc}
                  date={new Date(item?.date)}
                  messageAfterReverse={messageAfterReverse}
                  setReverdLink={setReverdLink}
                />
              ))}
              </TableBody>
          </Table>
        </TableContainer>
      }
      {message?.m && 
        <Dialog open={Boolean(message?.m)}>
          <Alert type={message?.t} onClose={() =>setMessage({m:"",t:""})}>{message?.m}</Alert> 
        </Dialog>
      }
    </div>
  )
};

export default memo(HistoryContent);
