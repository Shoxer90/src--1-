import { TableCell, TableRow } from "@mui/material";
import { t } from "i18next";
import React, { memo } from "react";

import styles from "./index.module.scss";

 const TableItem = ({item,index}) => {
    return(
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
					((item?.price - (item?.price * item?.discount / 100))*item?.count ).toFixed(2):
					item?.discountType === 2 ?
					((item?.price - item?.discount) * item?.count).toFixed(2) : (item?.price*item?.count).toFixed(2)
				}
			</TableCell>
		</TableRow>  
	)
};

 export default memo(TableItem);
