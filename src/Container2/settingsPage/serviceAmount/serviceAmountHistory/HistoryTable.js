import React from 'react'
import { memo } from 'react'
import Loader from '../../../loading/Loader';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import HistoryTableItem from './HistoryTableItem';

const HistoryTable = ({history}) => {
  const [load, setLoad] = useState(false);

  const {t} = useTranslation();

  const columns = [t("history.number"),t("history.transaction"),t("history.date"), `${t("history.total")} (${t("units.amd")})`];
  
  return (
    !history ? <Loader open={Boolean(history)} /> :
    <TableContainer style={{margin :"auto",alignContent:"center",width:"60%"}} component={Paper}>
      <Table>
        <TableHead >
            <TableRow style={{fontSize:"110%",textAlign:"center"}}>
              {columns && columns.map((item, index) => <TableCell key={index}> <strong>{t(item)}</strong> </TableCell> )}
            </TableRow>
        </TableHead>
        <TableBody>
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
  
  )
}

export default memo(HistoryTable);
