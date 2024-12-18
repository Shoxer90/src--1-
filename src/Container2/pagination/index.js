import React, { memo } from "react";

import { Pagination, PaginationItem } from "@mui/material";
import styles from "./index.module.scss";
import { Link } from "react-router-dom";
import { useState } from "react";

const PaginationSnip = ({
  pageCount, 
  page, 
  navig_Name,
  perPage,
  }) => {
  const [screenWidth, setScreenWidth] = useState();

  window.addEventListener('resize', function(event) {
    setScreenWidth(window.innerWidth)
  }, true);

  return (
    <div className={styles.pagination_container}>
      <Pagination
        page={page}   
        count={Math.ceil(pageCount / perPage)}
        color="secondary"
        size={screenWidth < 450 ? "small" : "large"}
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            to={`/${navig_Name}${item?.page === 1 ? '' : `&page=${item?.page}`}`}
            {...item}
          />
        )}
      />
    </div>
  )
}

export default memo(PaginationSnip);
