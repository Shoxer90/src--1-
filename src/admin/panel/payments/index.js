import { memo, useEffect, useState } from "react";
import { usePaymentsDetailsQuery } from "../../../store/customer/customerApi";
import UniversalTable from "../../table/UniversalTable";
import { createDateFormat, createRowModel } from "../../modules/variables";

import styles from "./index.module.scss";
import { useLocation } from "react-router-dom";
import { setCollumns } from "../../../store/filter/collumnFilterSlice";
import { useDispatch, useSelector } from "react-redux";

let cc = ["id","store","serviceType","paymentDate","pxNumber","price","status","cardId","currentRemainderCredit","credit","attach","attachProcess","activePayment","paidStatus","bindingPay","web","send","months","paymentRealDate","realMonths","cardPan","draftSend","sendDraftMounts","lastDraftDate","cashierId"]
const paymentsCollNames = cc.map((item, index)=> {
  return {
    id: index,
    title: item,
    key:item,
    // title: `admin.${item}`,
    name: item,
    checked: true,
  }
})

const CustomerPayments = () => {
  const dispatch = useDispatch();
  const collSlice = useSelector((state)=>state?.collumnFilter)


  const [sended, setSended] = useState(false);
  const search = useLocation().search
  const page = + (new URLSearchParams(search).get("page")) || 1 ;
  const id = + (new URLSearchParams(search).get("id")) || 1 ;

  const  { data: payments, isError, isLoading } = usePaymentsDetailsQuery({
    "page": +page,
    "count": 10,
    "isPayd": false,
    "searchString": "",
    "storeId": id,
    "sended": sended,
    "byDate": {
      "startDate": "2024-02-28T08:28:13.127Z",
      "endDate": "2025-02-28T08:28:13.127Z"
    }
  });

  const rows = payments?.map((item, index) => {
    return createRowModel(
      `${index+1}.`,
      item?.id, 
      item?.store, 
      item?.serviceType, 
      createDateFormat(item?.paymentDate),
      <span 
        className={styles.hovertext}
        onClick={()=>navigator.clipboard.writeText(item?.pxNumber)}
        data-hover={item?.pxNumber}
      >
        {`${item?.pxNumber.slice(0,7)}...`} 
      </span>,
      item?.price, 
      item?.status, 
      item?.cardId, 
      item?.currentRemainderCredit, 
      item?.credit,
      `${item?.attach}`,
      `${item?.attachProcess}`,
      `${item?.activePayment}`,
      `${item?.paidStatus}`,
      `${item?.bindingPay}`,
      `${item?.web}`,
      `${item?.send}`,
      item?.months, 
      createDateFormat(item?.paymentRealDate),
      item?.realMonths, 
      item?.cardPan.trim() || "-", 
      `${item?.draftSend}`, 
      item?.sendDraftMounts || "-",
      createDateFormat(item?.lastDraftDate), 
      item?.cashierId
    )  
  });
  console.log(paymentsCollNames,"paymentsCollNames")
  console.log(collSlice,"collSlice")

   useEffect(() => {
      if(!JSON.parse(localStorage.getItem("historyColumn"))){
        dispatch(setCollumns(paymentsCollNames))
        localStorage.setItem("historyColumn", JSON.stringify(paymentsCollNames))
      }
      else{
        dispatch(setCollumns(JSON.parse(localStorage.getItem("historyColumn"))))
      }
    },[]);

  if(isLoading){<div>Loading...</div>}


  return (
    <div>
      {!payments?.length ? 
      <div style={{color:"lightgrey",display:"flex",alignItems:"center"}}>
        <h1> NO CONTENT </h1> 
      </div>:
        <UniversalTable 
          rows={rows} 
          collumns={collSlice?.collTitles} 
          clickToRow={()=>console.log("click to payment row")} 
        />
      }
    </div>
  )
};

export default memo(CustomerPayments);
