import { memo, useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import { useLazyStoresByPageQuery } from "../../../store/storesUsers/storesApi";
import { createRowModel, STORES_COLLUMN_NAMES } from "../../modules/variables";
import UniversalTable from "../../table/UniversalTable";
import { useDispatch } from "react-redux";
import { setUserName } from "../../../store/adminTitle/titleSlice";
import { setPaginationPath } from "../../../store/pagination/paginationSlice";
import { Button, ButtonGroup } from "@mui/material";
import { useBlockCustomerMutation } from "../../../store/customer/customerApi";
import UpdateCustomer from "../customers/update"
import AdminTitle from "../../modules/AdminTitle";
import { setNavigation } from "../../../store/navigation/NavigationSlice";

const UsersContainer = () => {
  const [blockCustomer] = useBlockCustomerMutation();
  const [flag,setFlag] = useState(false);
  const [openUpdate,setOpenUpdate] = useState(false);
  const search = useLocation().search;
  const page = + (new URLSearchParams(search).get("page")) || 1 ;
  const dispatch = useDispatch()
  const [fetchStores, { data: stores, isError, isLoading }] = useLazyStoresByPageQuery();

  const rows = stores?.map((item) => {
    return createRowModel(
      item?.store?.id || "-",
      item?.store?.legalName || "-",
        <ButtonGroup>
        <Button 
          size="small"
          style={{background: item?.director?.isActive ? "green": "red",marginLeft:"3px",width:"70px"}}
          variant="contained"  
          onClick={(event)=>{
            event.stopPropagation()
            blockCustomer({ status:!item?.director?.isActive , directorId:item?.director?.id }).unwrap();
            setTimeout(()=>{
              setFlag(!flag)
            },0.18)
          }}
        >
          {item?.director?.isActive ? "Active": "Blocked"}
        </Button>
        <Button 
          size="small"
          variant="contained"  
          onClick={(event)=>{
            event.stopPropagation()
            setOpenUpdate(true)
          }}
        >
          Update
        </Button>
        </ButtonGroup>,
      item?.store?.legalAddress || "-", 
      item?.store?.tin || "-",
      `${item?.director?.firstName} ${item?.director?.lastName}` || "-",
      item?.director?.email || "-",
      item?.director?.phoneNumber || "-",
      item?.store?.city || "-",
    )
  });

  const goToCustomerPage = (rowData) => {
    dispatch(setUserName({
      userName:rowData[1]
    }))
    dispatch(setPaginationPath({
      path:`/admin/transactions/customer?id=${rowData[0]}&type=1&page=1`
    }))
    dispatch(setNavigation({id:"1"}))
  };

  useEffect(()=> {
    fetchStores({
    page: page ,
    count: 8,
    searchString: ""
  })
  }, [flag, page]);
  
  useEffect(()=> {
    dispatch(setNavigation({id:"0"}))
  }, [])

  return(
    <div>
      <AdminTitle />
      <UniversalTable rows={rows} collumns={STORES_COLLUMN_NAMES} clickToRow={goToCustomerPage} />
      <UpdateCustomer open={openUpdate} setOpen={setOpenUpdate} />
    </div>
  )
}
export default memo(UsersContainer);