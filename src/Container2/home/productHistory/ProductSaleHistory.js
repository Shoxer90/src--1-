import { forwardRef, memo, useEffect, useState } from "react";
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { getProductHistory, getProductSaleHistory } from "../../../services/products/productsRequests";
import HistoryFilter from "./HistoryFilter";
import { Box, Card, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useTranslation } from "react-i18next";

const ProductSaleHistory = ({ content, dateFormat, index}) => {
  const {t}= useTranslation();

  return (
    <>
      {content.map((row, index) => (
        <TableRow
          key={row.name}
          sx={{background: index%2 ? "#f0f0f0":"#ffffff"}}
        >
          <TableCell align="right"> {index+1}.</TableCell>
          <TableCell align="right"> {dateFormat(row?.date)}</TableCell>
          <TableCell align="right">{row?.receiptId}</TableCell>
          <TableCell align="right">{row?.quantity}</TableCell>
          <TableCell align="right">{row?.totalPrice/row?.quantity} {t("units.amd")}</TableCell>
          <TableCell align="right">{row?.totalPrice}  {t("units.amd")}</TableCell>
          <TableCell align="right">{row?.initialRemainder} {row?.otherLangMeasure}</TableCell>
          <TableCell align="right">{row?.finalRemainder} {row?.otherLangMeasure}</TableCell>
            <TableCell align="right">
              {row?.saleType === 1 && t("history.cash")}
              {row?.saleType === 2 && t("history.card")}
              {row?.saleType === 3 && t("history.qr")}
              {row?.saleType === 4 && t("history.link")}
              {row?.saleType === 5 && t("history.prepaymentRedemption")}
              {row?.saleType === 7 && t("history.combo")}
              {row?.saleType === 8 && t("history.cardCashSell")}
            </TableCell>
        </TableRow>
      ))}
    </>
  )
};

export default memo(ProductSaleHistory);

