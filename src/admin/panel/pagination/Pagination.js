import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setPaginationPath } from '../../../store/pagination/paginationSlice';

export default function PaginationControlled({count}) {
  const dispatch = useDispatch();
  const search = useLocation().search;
  const pathname = useLocation().pathname;
  const page = + (new URLSearchParams(search).get("page")) ;
  
  const handleChange = (event, value) => {
    const newSearchParams = new URLSearchParams(search);
    newSearchParams.set("page", value);
    return dispatch(setPaginationPath({path:`${pathname}?${newSearchParams}`}))
  };

  return (
    <div style={{
      position:"fixed", 
      background:"white",
      paddingTop:"5px",
      bottom:0,
      width:"100dvw",  
      display:"flex",
      justifyContent: "center"
    }}>
      <Stack 
        spacing={2}
        
      >
        <Pagination count={Math.ceil(count)} page={page} onChange={handleChange} color="primary"/>
      </Stack>
    </div>
  )
}