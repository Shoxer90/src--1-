import React,{ memo } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useTranslation } from "react-i18next";

import styles from "./index.module.scss";
import TableItem from "./TableItem";

const DenseTable = ({basketContent}) => {

  const {t} = useTranslation();
  return (
    <TableContainer  sx={{mb:2, mt:2}} component={Paper}>
      {basketContent?.productsList.length ?
      <Table  size="small">
        <TableHead className={styles.table_titles}>
          <TableRow style={{background:"#eeeeee"}}>
            <TableCell align="center"> {t("productinputs.name")}</TableCell>
            <TableCell align="center">{t("updates.count")}</TableCell>
            <TableCell align="center"> {t("updates.measure")}</TableCell>
            <TableCell align="center"> {t("updates.price")}</TableCell>
            <TableCell align="center">{t("basket.totalndiscount2")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className={styles.table_titles}>
          { basketContent?.productsList.map((item, index) => (
            <TableItem 
              index={index}
              item={item}
              key={index}
            />
          ))}
        </TableBody>
      </Table>:
      <h4>1. {t("basket.useprepayment")} {basketContent?.total} {t("units.amd")}</h4>}
    </TableContainer>
  );
};

export default memo(DenseTable);
