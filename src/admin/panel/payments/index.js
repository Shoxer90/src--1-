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
      collSlice?.collTitle.includes("id") && item?.id, 
      collSlice?.collTitle.includes("store") && item?.store, 
      collSlice?.collTitle.includes("serviceType") && item?.serviceType, 
      collSlice?.collTitle.includes("paymentDate") && createDateFormat(item?.paymentDate),
      collSlice?.collTitle.includes("pxNumber") && <span 
        className={styles.hovertext}
        onClick={()=>navigator.clipboard.writeText(item?.pxNumber)}
        data-hover={item?.pxNumber}
      >
        {`${item?.pxNumber.slice(0,7)}...`} 
      </span>,
      collSlice?.collTitle.includes("price") && item?.price, 
      collSlice?.collTitle.includes("status") && item?.status, 
      collSlice?.collTitle.includes("cardId") && item?.cardId, 
      collSlice?.collTitle.includes("currentRemainderCredit") && item?.currentRemainderCredit, 
      collSlice?.collTitle.includes("recieptId") && item?.credit,
      collSlice?.collTitle.includes("credit") && `${item?.attach}`,
      collSlice?.collTitle.includes("attachProcess") && `${item?.attachProcess}`,
      collSlice?.collTitle.includes("activePayment") && `${item?.activePayment}`,
      collSlice?.collTitle.includes("paidStatus") && `${item?.paidStatus}`,
      collSlice?.collTitle.includes("bindingPay") && `${item?.bindingPay}`,
      collSlice?.collTitle.includes("web") && `${item?.web}`,
      collSlice?.collTitle.includes("send") && `${item?.send}`,
      collSlice?.collTitle.includes("months") && item?.months, 
      collSlice?.collTitle.includes("paymentRealDate") && createDateFormat(item?.paymentRealDate),
      collSlice?.collTitle.includes("realMonths") && item?.realMonths, 
      collSlice?.collTitle.includes("cardPan") && item?.cardPan.trim() || "-", 
      collSlice?.collTitle.includes("cardPan") && `${item?.draftSend}`, 
      collSlice?.collTitle.includes("sendDraftMounts") && item?.sendDraftMounts || "-",
      collSlice?.collTitle.includes("lastDraftDate") && createDateFormat(item?.lastDraftDate), 
      collSlice?.collTitle.includes("cashierId") && item?.cashierId
    )  
  });

   useEffect(() => {
        dispatch(setCollumns(paymentsCollNames))
        localStorage.setItem("historyColumn", JSON.stringify(paymentsCollNames))
    },[]);

  if(isLoading){<div>Loading...</div>}


  return (
    <div>
      <UniversalTable 
        rows={rows} 
        collumns={collSlice?.collumns} 
        // clickToRow={()=>console.log("click to payment row")} 
      />
    </div>
  )
};

export default memo(CustomerPayments);
