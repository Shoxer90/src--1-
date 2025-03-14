import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { Dialog } from "@mui/material";

import Navigation from "../navigation";
import SnackErr from "../../Container2/dialogs/SnackErr"
import PaginationControlled from "./pagination/Pagination";

import { setMessage } from "../../store/messages/messageSlice";
import { setPaginationPath } from "../../store/pagination/paginationSlice";
import { setNavigation } from "../../store/navigation/NavigationSlice";

import styles from "./index.module.scss";

const AdminPanel = ({children}) => {
  const search = useLocation().search;
  const pathname = useLocation().pathname;
  const paginationState = useSelector((state) => state?.pagination);
  const message = useSelector((state) => state?.message);
  const dispatch = useDispatch();
  const navigate = useNavigate();

 const navfromslice = useSelector((state)=> state?.navigation?.navigation);

  const changeNavigation = (id) => {
    navfromslice.map((item) => {
      if(item?.id === id) {
        if(id === "0") {
          dispatch(setPaginationPath({path:`${item?.path}`}))
        } else{
          dispatch(setPaginationPath({path:`${item?.path}${search}`}))
        }
        dispatch(setNavigation({id:id}))
      }
    })
  }

  const navigateByBar = () => {
    navigate(paginationState?.path)
  }
  const navOrientation = () => {
    if(pathname.includes("stores")){
    dispatch(setNavigation({id:"0"}))
    }else if(pathname.includes("info")){
    dispatch(setNavigation({id:"01"}))
    }else if(pathname.includes("transactions")){
    dispatch(setNavigation({id:"1"}))
    }else if(pathname.includes("invoices")){
    dispatch(setNavigation({id:"2"}))
    }else if(pathname.includes("payments")){
    dispatch(setNavigation({id:"3"}))
    }
  }

  useEffect(()=> {
    navigateByBar()
  }, [paginationState]);

  useEffect(()=> {
    navOrientation()
    !paginationState?.path  && dispatch(setPaginationPath({path:`${pathname}${search}`}))
  }, []);


  if(!navfromslice ){<div>Loading....</div> }
  return(
    <div className={styles.admin_page}>
      <Navigation currentNavigation={navfromslice} changeNavigation={changeNavigation} />

      {children}

      <PaginationControlled count={paginationState?.length/paginationState?.perPage} />

      <Dialog open={message?.text}>
        <SnackErr 
          message={message?.text} 
          type={message?.type} 
          close={()=>dispatch(setMessage({text:"", type:""}))} 
        />
      </Dialog>
    </div>
  )
};

export default memo(AdminPanel);
