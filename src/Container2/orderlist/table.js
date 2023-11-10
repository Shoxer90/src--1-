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

const DenseTable = ({basketContent}) => {

  const {t} = useTranslation();
  return (
    <TableContainer  sx={{mb:2, mt:2}} component={Paper}>
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
          {basketContent?.productsList.map((item, index) => (
            <TableRow key={item.name} style={{background: index%2 ? "#F8F6F6":"white"}}>
              <TableCell component="th" scope="row" style={{display:"flex"}}>
                <span>{index+1}.</span>
                <span style={{display:"flex", alignItems:"center"}}>
                  <img 
                    className={styles.prod_img}
                    src={item?.photo || "/default-placeholder.png"} 
                    alt=""
                  />
                  <span>
                    {item.name}
                  </span>
                </span>
              </TableCell>
              <TableCell align="center">{item?.count}</TableCell>
              <TableCell align="center">{t(`units.${item?.measure}`)}</TableCell>
              <TableCell align="center">
                {item?.price}{item?.discount ? 
                  <span style={{color:"red",fontWeight:"600"}}> /
                    {item?.discountType === 1 || item?.discountType === 0 ?  item?.price - item?.price * item?.discount/100:
                    item?.discountType === 2 ? item?.price - item?.discount:"dr"
                  } </span>: ""
                }
              </TableCell>
              <TableCell align="center">  
                {
                  item?.discountType === 1  || item?.discountType === 0 ?
                  (item?.price - (item?.price * item?.discount / 100))*item?.count :
                  item?.discountType === 2 ?
                  (item?.price - item?.discount) * item?.count : item?.price*item?.count
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default memo(DenseTable);
