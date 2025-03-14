import { memo } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableUniversalRow from './TableUniversalRow';
import { useTranslation } from 'react-i18next';

const UniversalTable = ({collumns,rows,clickToRow}) => {
  const {t} = useTranslation();

  return (
    <TableContainer component={Paper} sx={{ width: '100%',marginBottom:"40px"}}>
        { rows?.length ? <Table aria-label="collapsible table"  stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell />
            { collumns?.map((collumnName) => {
              if(collumnName?.checked) {
                return <TableCell align="center" key={collumnName?.id}>
                  <strong style={{fontSize:"110%"}}>
                    {/* {collumnName?.name} */}
                    {t(`${collumnName?.title}`)}
                  </strong>
                </TableCell>
              }
            })}
          </TableRow>
        </TableHead>
      
          <TableBody>
            { rows?.map((row, index) =><TableUniversalRow key={index} row={row} index={index} clickToRow={clickToRow} />) }
          </TableBody>
      </Table>
      :
      <div style={{color:"lightgrey",width:"100%",display:"flex",justifyContent:"center"}}>
        <h1> NO CONTENT </h1> 
      </div>
    }
    </TableContainer>
  );
}
export default memo(UniversalTable);
