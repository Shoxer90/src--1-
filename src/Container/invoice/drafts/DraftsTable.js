import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { createData, headCells } from './imports';
import { Pagination } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { removeInvoice } from '../../../services/invoice/customerData';
import ConfirmDialog from '../../../Container2/dialogs/ConfirmDialog';
import DraftItem from './DraftItem';

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow  style={{ fontFamily: 'Arial, sans-serif', background:'#eceff1', fontWeight:900}}>
        <TableCell align='center'> ID </TableCell>
        {headCells.map((headCell) => (
          <TableCell
          style={{fontWeight:900}}
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}



 const DraftsTable = ({
  data,
  setData,
  content,
  behalfOfArr,
  contentCount,
  setMessage,
 }) => {
  const {t} = useTranslation();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] =useState('calories');
  const [selected, setSelected] = useState([]);
  const [rows2, setRow2] = useState([]);
  const [openRemoveDialog, setOpenRemoveDialog] =useState({
    status:false,
    id:0
  });
  const [transaction,setTransaction] = useState({})

const getTableRow = async(tableData) => {
    const rows = await tableData?.map((item, index) => {
    return createData(
      item?.index,  
      item?.createdAt,
      item?.deliveredAt,
      item?.partnerTin,
      item?.partnerName,
      item?.amount,
      item?.withoutTax,
      item?.tax,
      item?.invoiceSubType,
      item?.behalfOf,
      item?.destinationAddress,
      item?.sourceAddress,
      item?.operation,
    )
  }) 
  setRow2(rows)
};

const createTableContent = () => {
  let newContent = [];
  content?.map((item, index)=> {
    const date = new Date(item?.createdAt)
    const deliver = new Date(item?.deliveredAt)
    let amount = 0;
    item?.items?.forEach((prod) => {
      amount+= prod?.total
    })
    newContent.push({
      index: item?.id,
      createdAt: <div>
        <div>
          {date?.getUTCDate()>9 ? date?.getUTCDate() : `0${ date?.getUTCDate()}`}/
          {date.getMonth()>8 ? date.getMonth()+1: `0${date.getMonth()+1}`}/
          {date.getFullYear()} {" "}
        </div>
        <div> 
          {date.getHours()>9? date.getHours(): `0${date.getHours()}`}:
          {date.getMinutes()>9? date.getMinutes(): `0${date.getMinutes()}`}:
          {date?.getSeconds()>9? date?.getSeconds(): `0${date?.getSeconds()}`}  
        </div>
      </div>,
      deliveredAt:item?.deliveredAt,
      deliveredAt:<div>
        {deliver?.getUTCDate()>9 ? deliver?.getUTCDate() : `0${ deliver?.getUTCDate()}`}/
        {deliver.getMonth()>8 ? deliver.getMonth()+1: `0${deliver.getMonth()+1}`}/
        {deliver.getFullYear()} {" "}
      </div>,
      partnerTin: item?.partnerTin,
      partnerName: item?.partnerName,
      amount: amount,
      withoutTax: (amount - amount*0.1667).toFixed(2),
      tax: (amount*0.1667).toFixed(2),
      invoiceSubType:<div style={{fontSize:"80%"}}>
         { item?.invoiceSubType === 0 ? t("invoice.subTypeProd1") :
          item?.invoiceSubType === 2 ? t("invoice.subTypeServ1") :
          item?.invoiceSubType === 6 ? t("invoice.subTypeProd2") :
          item?.invoiceSubType === 7 ? t("invoice.subTypeServ1") : ""}
      </div>,
      behalfOf: <div style={{fontSize:"80%"}}>{behalfOfArr.find(it => it.id === item?.behalfOf)?.title}</div>,
      destinationAddress:<div style={{fontSize:"80%"}}>
       {` ${item?.destinationCountry}, ${item?.destinationRegion}, ${item?.destinationCommunity}, ${item?.destinationStreet}`}
      </div>,
      sourceAddress:<div style={{fontSize:"80%"}}>
        {`${item?.sourceCountry}, ${item?.sourceRegion}, ${item?.sourceCommunity}, ${item?.sourceStreet}`}
      </div>,
      operation: <DeleteIcon color='red'  sx={{"&:hover":{color:"red"}, color:"grey"}} onClick={()=>setOpenRemoveDialog({
            id:item?.id,
            status:true
          })} />
    })
  })
  getTableRow(newContent)
}

const removeInvoiceDraft = (id) => {
  removeInvoice(id).then((res) => {
    console.log(res, "res after remove")
    if(res?.status === 200){

      setMessage({text:res?.data?.message, type:"success"})
      setOpenRemoveDialog({
        status:false,
        id:0
      })
    }else{
      setMessage({text:res?.message, type:"error"})

    }
  })
}

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const [openInvoiceItem, setOpenInvoiceItem] = useState({
    id: 0,
    isOpen:true
  });

  const handleClick = (transaction, id) => {
    console.log(transaction, "trtrtr");

    let transact = content?.filter((item) => item?.id === id)
    setTransaction(transact)
    // setOpenInvoiceItem({
    //   id: id,
    //   isOpen:true
    // })
  };

  useEffect(() => {
   content && createTableContent()
  }, [content, data?.page])


  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table style={{ border:"lightgrey solid 2px", borderRadius:"5px"}} size='small'>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              // onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows2?.length}
            />
            <TableBody>
              {rows2.map((row,) => {
                return (
                  <TableRow
                    hover
                    onClick={() => handleClick(row, row.id)}
                    // tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: 'pointer'}}
                  >
                    <TableCell>{row?.id}</TableCell>
                    <TableCell align="right">{row.createdAt}</TableCell>
                    <TableCell align="right">{row.deliveredAt}</TableCell>
                    <TableCell align="right">{row.partnerTin}</TableCell>
                    <TableCell align="right">{row.partnerName}</TableCell>
                    <TableCell align="right">{row.amount}</TableCell>
                    <TableCell align="right">{row.withoutTax}</TableCell>
                    <TableCell align="right">{row.tax}</TableCell>
                    <TableCell align="right">{row.invoiceSubType}</TableCell>
                    <TableCell align="right">{row.behalfOf}</TableCell>
                    <TableCell align="right">{row.destinationAddress}</TableCell>
                    <TableCell align="right">{row.sourceAddress}</TableCell>
                    <TableCell align='center'>{row.operation} </TableCell>
    
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
       
        <Pagination 
          style={{margi:"10px",
            display: 'flex',
            justifyContent: 'center',
            padding:"10px",
          }}
          count={Math.ceil(contentCount/10)} 
          variant="outlined"
          color="primary" 
          onChange={(event, value) => {
            setData({
              ...data,
              page:value
            })}
          }
        />
        { transaction?.length && 
          <DraftItem 
            transaction={transaction} 
            setTransaction={setTransaction}
            behalfOfArr={behalfOfArr}
          />
         }
        <ConfirmDialog
          question={`${t("invoice.removeInvoice")} id = ${openRemoveDialog?.id}`}
          func={()=>removeInvoiceDraft(openRemoveDialog?.id)}
          title= ""
          open={openRemoveDialog?.status}
          close={()=>setOpenRemoveDialog({
            id:0,
            status:false
          })}
          content={" "}
          t={t}
        />
      </Paper>
    
    </Box>
  );
}

export default memo(DraftsTable);

