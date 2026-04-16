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
import { formatOrderNumber } from "./formatOrderNumbers";

const DenseTable = ({basketContent}) => {

  const {t} = useTranslation();
  return (
    <TableContainer
      sx={{
        mb: 2,
        mt: 2,
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "thin",
      }}
      component={Paper}
    >
      {basketContent?.productsList.length ?
      <Table
        size="small"
        sx={{
          borderCollapse: "collapse",
          width: "100%",
          tableLayout: "fixed",
          "& thead .MuiTableCell-root:first-of-type, & tbody .MuiTableCell-root:first-of-type": {
            width: "40%",
            minWidth: 0,
            boxSizing: "border-box",
          },
          /* колонка «цена»: две строки по центру */
          "& .MuiTableRow-root .MuiTableCell-root:nth-child(4)": {
            boxSizing: "border-box",
            minWidth: "4.5rem",
            "@media (max-width: 720px)": {
              width: "18%",
            },
          },
          "& .MuiTableCell-root": {
            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
          },
          "& .MuiTableHead-root .MuiTableCell-root": {
            borderBottom: "1px solid rgba(0, 0, 0, 0.18)",
            verticalAlign: "middle",
          },
          /* первая колонка — название: влево у картинки; остальные — по центру */
          "& .MuiTableBody-root .MuiTableCell-root:first-of-type": {
            verticalAlign: "middle",
            textAlign: "left",
          },
          "& .MuiTableBody-root .MuiTableCell-root:not(:first-of-type)": {
            verticalAlign: "middle",
            textAlign: "center",
          },
        }}
      >
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
      <h4> {t("basket.useprepayment")} {formatOrderNumber(basketContent?.total)} {t("units.amd")}</h4>}
    </TableContainer>
  );
};

export default memo(DenseTable);
