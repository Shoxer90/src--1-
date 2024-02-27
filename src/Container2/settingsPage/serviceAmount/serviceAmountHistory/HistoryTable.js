import React, { memo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import Loader from '../../../loading/Loader';
import HistoryTableItem from './HistoryTableItem';

const HistoryTable = ({history, setOpenHistory}) => {
  const [load, setLoad] = useState(false);
  const {t} = useTranslation();
  const columns = [t("history.number"), t("history.date"), `${t("history.total")} (${t("units.amd")})`];


  return (
    !history ? 
    <Loader open={Boolean(history)} /> :
    <>
      <DialogTitle 
        style={{
          display:"flex", 
          justifyContent:"space-between",
          alignContent:"center", 
          padding:"0px", 
          margin:"10px 20px"
        }}
      >
      <div>{t("cardService.historySubTitle")}</div>
      <CloseIcon 
        sx={{":hover":{background:"#d6d3d3",borderRadius:"5px"}}}
        onClick={()=>setOpenHistory(false)}
      /> 
      </DialogTitle>
      <TableContainer sx={{ maxHeight: "100vh" }}>
        <Table stickyHeader >
            <TableHead>
              <TableRow>
                {columns && columns.map((item, index) => <TableCell key={index}> <strong>{t(item)}</strong> </TableCell> )}
              </TableRow>
            </TableHead>
            <TableBody style={{paddingTop: "102px"}}>
              {history &&  history.map((row, index) => (
                <HistoryTableItem
                  {...row} 
                  index={index} 
                  t={t} 
                  key={index}
                  columns={columns} 
                  setLoad={setLoad}
                />
              ))}
            </TableBody>
        </Table>
      </TableContainer>
      </>
  )
};

export default memo(HistoryTable);
