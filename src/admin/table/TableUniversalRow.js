import { memo } from "react";
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

function TableUniversalRow({row,index,clickToRow}) {
  const rowArray = Object.values(row)
  return (
    <TableRow 
      onClick={()=>clickToRow(rowArray)}
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
      {rowArray && rowArray.map((item, index) => <TableCell align="center"  key={index} style={{fontWeight:700, fontSize:"100%"}}>{item}</TableCell>)}
    </TableRow>
  );
};

export default memo(TableUniversalRow);
