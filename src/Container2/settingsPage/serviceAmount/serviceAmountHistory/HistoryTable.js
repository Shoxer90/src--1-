import React, { memo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import Loader from '../../../loading/Loader';
import HistoryTableItem from './HistoryTableItem';

const HistoryTable = ({history}) => {
  const [load, setLoad] = useState(false);
  const {t} = useTranslation();
  const columns = [t("history.number"), t("history.date"), `${t("history.total")} (${t("units.amd")})`];
  // const columns = [t("history.number"),t("history.transaction"),t("history.date"), `${t("history.total")} (${t("units.amd")})`];
  
  return (
    !history ? 
    <Loader open={Boolean(history)} /> :
    <Table>
      <TableHead >
        <TableRow style={{textAlign:"center"}}>
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
  )
};

export default memo(HistoryTable);
