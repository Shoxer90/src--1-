import React, { memo } from "react";

import { motion } from "framer-motion";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Card } from "@mui/material";

function createData(name, calories) {
  return { name, calories };
};

const tableAnimation = {
  hidden:{
    x: -100,
    opacity: 0
  },
  visible: custom => ({
    x: 0,
    opacity: 1,
    transition: {delay: custom * 0.8}
  })
 };

const PriceTable = ({t}) => {

  const rows = [
    createData(t("landing.priceListRow1"), t("landing.priceListFree")),
    createData(t("landing.priceListRow2"), t("landing.priceListFree")),
    createData(t("landing.priceListRow3"), 5),
    createData(t("landing.priceListRow4"), t("landing.priceListUnlimit")),
    createData(t("landing.priceListRow5"), t("landing.priceListUnlimit")),
    createData(t("landing.priceListRow6"), `2500 ${t("units.amd")} *`),
    createData(t("landing.priceListRow7"), `10 ${t("units.amd")}`),
    createData(t("landing.priceListRow8"), `10 ${t("units.amd")}`),
    createData(t("landing.priceListRow9"), `${t("landing.priceListFree")} **`),
  ];

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      variants={tableAnimation}
      custom={1.2}
    >
      <Card sx={{boxShadow:12}}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 280 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell><strong>{t("landing.priceListSubTitle1")}</strong></TableCell>
                <TableCell align="right"><strong>{t("landing.priceListSubTitle2")}</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </motion.div>
  )
};

export default memo(PriceTable);