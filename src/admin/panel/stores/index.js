import { memo, useState } from "react";
import { useStoresByPageQuery } from "../../../store/storesUsers/storesApi";
import StoresItem from "./StoresItem";
import PaginationSnip from "../../../Container2/pagination";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { loadResources } from "i18next";
import { Pagination, PaginationItem } from "@mui/material";

const UsersContainer = () => {
  const search = useLocation().search;
  // const [page, setPage] = useState(+new URLSearchParams(search).get("page") || 1);
  const page = + (new URLSearchParams(search).get("page")) || 1 ;

  const count = useSelector((state) => state.count?.count);

  const {data: stores, isError, isLoading} = useStoresByPageQuery({
    page: page ,
    count: 15,
    searchString: ""
  });

  if(isLoading) {<div> "...Loading" </div>}

  return(
    <div>
      {stores && stores.map((storeInfo, index)=> (
        <StoresItem 
          key={storeInfo?.store?.id}
          index={index+1}
          {...storeInfo}
        />
      ))}
      {count ? <Pagination
      style={{
        position:"fixed", 
        background:"white",
        paddingTop:"5px",
        bottom:0, 
        width:"100dvw",  
        display:"flex",
        justifyContent: "center"
      }}
      page={page}   
      count={Math.ceil(count/15)}
      color="secondary"
      renderItem={(item) => (
        <PaginationItem
          component={Link}
          to={`/admin/stores?page=${item?.page}`}
          {...item}
        />
      )}/> : null}
    </div>
  )
};
export default memo(UsersContainer);