import { memo, useEffect } from "react";
import { useInvoicesDetailsQuery, useLazyInvoicesDetailsQuery } from "../../../store/customer/customerApi";
import UniversalTable from "../../table/UniversalTable";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { setCollumns } from "../../../store/filter/collumnFilterSlice";
import { createDateFormat, createRowModel } from "../../modules/variables";


let cc = ["id","isFromFile","paymentId", "sendingDay", "sendingStatus","store"]
const invoicesCollNames = cc.map((item, index)=> {
  return {
    id: index,
    title: item,
    key:item,
    // title: `admin.${item}`,
    name: item,
    checked: true,
  }
});

const AdminInvoices = () => {
  const dispatch = useDispatch();
  const search = useLocation().search;
  const collSlice = useSelector((state)=>state?.collumnFilter)
  const date = useSelector((state)=>state?.startEndDate)
  const storeId = new URLSearchParams(search).get("id");
  const page = new URLSearchParams(search).get("page") || 1;
  const [fetchInvoices,{ data:invoices, isError, isLoading }] = useLazyInvoicesDetailsQuery();

  const rows = invoices?.map((item,index) => {
    return createRowModel(
      `${index+1}.`,
      collSlice?.collTitle.includes("id") && item?.id, 
      collSlice?.collTitle.includes("isFromFile") && `${item?.isFromFile}`, 
      collSlice?.collTitle.includes("paymentId") && item?.paymentId, 
      collSlice?.collTitle.includes("sendingDay") && createDateFormat(item?.sendingDay,1,0), 
      collSlice?.collTitle.includes("sendingStatus") && `${item?.sendingStatus}`, 
      collSlice?.collTitle.includes("store") && `${item?.store}`, 
    )
  })

  if(isLoading){<div>Loading...</div>}

  useEffect(() => {
    dispatch(setCollumns(invoicesCollNames))
    localStorage.setItem("historyColumn", JSON.stringify(invoicesCollNames))
  },[]);
  
  useEffect(() => {
    page && date && fetchInvoices({
      "page": page,
      "count": 11,
      "isPayd": true,
      "searchString": "",
      "byDate": date,
      "storeId": storeId,
    })
  },[date,page]);

  return(
    <div>
      <UniversalTable
        rows={rows} 
        collumns={collSlice?.collumns}
        clickToRow={()=>console.log("click to invooice row")} 
      />
    </div>
  )
};

export default memo(AdminInvoices);