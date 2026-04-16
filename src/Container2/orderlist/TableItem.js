import { TableCell, TableRow } from "@mui/material";
import { t } from "i18next";
import React, { memo } from "react";

import styles from "./index.module.scss";
import { formatOrderNumber } from "./formatOrderNumbers";

 const TableItem = ({item,index}) => {
    const discountedUnitPrice =
      item?.discountType === 1 || item?.discountType === 0
        ? item?.price - (item?.price * item?.discount) / 100
        : item?.discountType === 2
          ? item?.price - item?.discount
          : "dr";

    return(
			<TableRow key={item.name} style={{background: index%2 ? "#F8F6F6":"white"}}>
			<TableCell component="th" scope="row" align="left" className={styles.tableNameCellWrap}>
				<div className={styles.tableNameCell}>
					<span className={styles.tableNameIndex}>{index + 1}.</span>
					<div className={styles.tableNameCellInner}>
						<img
							className={styles.prod_img}
							src={item?.photo || "/default-placeholder.png"}
							alt=""
						/>
						<span className={styles.tableNameText}>{item.name}</span>
					</div>
				</div>
			</TableCell>
			<TableCell align="center" className={styles.tableCellNumeric}>
				<div className={styles.tableCellBodyInner}>{formatOrderNumber(item?.count)}</div>
			</TableCell>
			<TableCell align="center" className={styles.tableCellNumeric}>
				<div className={styles.tableCellBodyInner}>{t(`units.${item?.measure}`)}</div>
			</TableCell>
			<TableCell align="center" className={styles.tableCellPrice}>
				<div className={styles.tableCellBodyInner}>
					<div className={styles.priceStack}>
						<span className={styles.priceStackBase}>{formatOrderNumber(item?.price)}</span>
						{item?.discount ? (
							<span className={styles.priceStackDiscount}>
								/ {formatOrderNumber(discountedUnitPrice)}
							</span>
						) : null}
					</div>
				</div>
			</TableCell>
			<TableCell align="center" className={styles.tableCellNumeric}>
				<div className={styles.tableCellBodyInner}>
					{formatOrderNumber(
						item?.discountType === 1 || item?.discountType === 0
							? (item?.price - (item?.price * item?.discount) / 100) * item?.count
							: item?.discountType === 2
								? (item?.price - item?.discount) * item?.count
								: item?.price * item?.count
					)}
				</div>
			</TableCell>
		</TableRow>  
	)
};

 export default memo(TableItem);
