import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { createRowModel, STORES_COLLUMN_NAMES } from '../modules/variables';
import { useTranslation } from 'react-i18next';
import { useStoresByPageQuery } from '../../store/storesUsers/storesApi';
import { memo } from 'react';
import { useLocation } from 'react-router-dom';
import Row from "./StoresTableItem";
import TableUniversalRow from './TableUniversalRow';

function createData(  
  legalName,
  legalAddress,
  tin,
  director,
  email,
  phoneNumber,
  tradeName,
  city,
  businessAddress,
  merchName,
  merchAddress,
  merchCity,
  bankName,
  bankAccount,
  serviceType,
  tax,
  workType,
  paymentSystem,
  mid,) {
  return {
    legalName,
    legalAddress,
    tin,
    director,
    email,
    phoneNumber,
    tradeName,
    city,
    businessAddress,
    // merchName,
    // merchAddress,
    // merchCity,
    // bankName,
    // bankAccount,
    // serviceType,
    // tax,
    // workType,
    // paymentSystem,
    // mid,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3,
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1,
      },
    ],
  };
}


const CollapsibleTable = () => {
  const search = useLocation().search;
  const page = + (new URLSearchParams(search).get("page")) || 1 ;

  
  const {t} = useTranslation();
  const {data: stores, isError, isLoading} = useStoresByPageQuery({
    page: page ,
    count: 8,
    searchString: ""
  });
    const rorororor = stores?.map((item) => {
      return createRowModel(
        item?.store?.legalName || "-", 
        item?.store?.legalAddress || "-", 
        item?.store?.tin || "-",
        `${item?.director?.firstName} ${item?.director?.lastName}` || "-",
        item?.director?.email || "-",
        item?.director?.phoneNumber || "-",
        item?.store?.city || "-",
      )
    })

    const rows = stores?.map((item) => {
      return createData(
        item?.store?.legalName || "-", 
        item?.store?.legalAddress || "-", 
        item?.store?.tin || "-",
        `${item?.director?.firstName} ${item?.director?.lastName}` || "-",
        item?.director?.email || "-",
        item?.director?.phoneNumber || "-",
        // item?.director?.tradeName || "-",
        item?.store?.city || "-",
        // item?.director?.businessAddress || "-",
        // item?.director?.merchName || "-",
        // item?.director?.merchCity || "-",
        // item?.director?.merchAddress || "-",
        // item?.director?.bankName || "-",
        // item?.director?.bankAccount || "-",
        // item?.director?.serviceType || "-",
        // item?.director?.workType || "-",
        // item?.director?.paymentSystem || "-",
        // item?.director?.mid || "-",
      )
    })

  return (
    <TableContainer component={Paper} sx={{ width: '100%',marginBottom:"40px"}}>
      <Table aria-label="collapsible table"  stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell />
            { STORES_COLLUMN_NAMES?.map((collumnName, index) => (
               <TableCell key={collumnName?.id}>
                <strong style={{fontSize:"110%"}}>{collumnName?.name}</strong>
              </TableCell>
              // return <TableCell>{t(`${collumnName?.title}`)}</TableCell>
            )) }
          </TableRow>
        </TableHead>
        <TableBody>
          {/* {rows?.map((row, index) => (
            <Row key={row.name} row={row} index={index} />
          ))} */}
          {rorororor?.map((row, index) => (
            <TableUniversalRow key={row.name} row={row} index={index} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default memo(CollapsibleTable);
