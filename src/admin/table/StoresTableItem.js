import { memo, useState } from "react";
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function Row({row,index}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow 
        sx={{ 
          '& > *': { borderBottom: 'unset' }, 
          '&.MuiTableRow-root:hover':{
            backgroundColor: '#D8DBDF',
          },
          alignItems:"flex-start", 
          background:index%2 ?"#F0F4F8":null,
          cursor:"pointer"
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">{row.legalName}</TableCell>
        <TableCell align="left">{row?.legalAddress}</TableCell>  
        <TableCell align="left">{row?.tin}</TableCell>
        <TableCell align="left">{row?.director}</TableCell>
        <TableCell align="left">{row?.email}</TableCell>
        <TableCell align="left">{row?.phoneNumber}</TableCell>
        {/* <TableCell align="left">{row?.tradeName}</TableCell> */}
        <TableCell align="left">{row?.city}</TableCell>
        {/* <TableCell align="left">{row?.businessAddress}</TableCell> */}
        {/* <TableCell align="left">{row?.merchName}</TableCell>
        <TableCell align="left">{row?.merchCity}</TableCell>
        <TableCell align="left">{row?.merchAddress}</TableCell>
        <TableCell align="left">{row?.bankName}</TableCell>
        <TableCell align="left">{row?.bankAccount}</TableCell>
        <TableCell align="left">{row?.serviceType}</TableCell>
        <TableCell align="left">{row?.workType}</TableCell>
        <TableCell align="left">{row?.paymentSystem}</TableCell>
        <TableCell align="left">{row?.mid}</TableCell> */}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="left">Amount</TableCell>
                    <TableCell align="left">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="left">{historyRow.amount}</TableCell>
                      <TableCell align="left">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default memo(Row);