import Pagination from '@mui/material/Pagination';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setPaginationPath } from '../../../store/pagination/paginationSlice';
import { paginationSx } from '../../../Container2/pagination';
import styles from '../../../Container2/pagination/index.module.scss';

export default function PaginationControlled({count}) {
  const dispatch = useDispatch();
  const search = useLocation().search;
  const pathname = useLocation().pathname;
  const page = + (new URLSearchParams(search).get("page")) || 1;
  const compact = useMediaQuery("(max-width:600px)");
  const pages = Math.ceil(Number(count) || 0);

  const handleChange = (event, value) => {
    const newSearchParams = new URLSearchParams(search);
    newSearchParams.set("page", value);
    return dispatch(setPaginationPath({path:`${pathname}?${newSearchParams}`}))
  };

  if (!Number.isFinite(pages) || pages <= 1) return null;

  return (
    <div className={styles.pagination_container}>
      <Pagination
        count={pages}
        page={page}
        onChange={handleChange}
        shape="rounded"
        siblingCount={compact ? 0 : 1}
        boundaryCount={1}
        size={compact ? "small" : "medium"}
        sx={paginationSx(compact)}
      />
    </div>
  );
}