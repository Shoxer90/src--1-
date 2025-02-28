import { memo, useEffect, useState } from "react";
import { useLazySaleDetailsQuery } from "../../../store/customer/customerApi";
import UniversalTable from "../../table/UniversalTable";
import { createDateFormat, createRowModel } from "../../modules/variables";
import { Button, ButtonGroup } from "@mui/material";
import HdmStatus from "../../../modules/hdmStatus";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setCollTitle, setCollumns } from "../../../store/filter/collumnFilterSlice";
import { useLocation } from "react-router-dom";
import { columnNames } from "../../../services/baseUrl";

const CustomerSaleHistory = () => {
  const search = useLocation().search;
  const storeId = new URLSearchParams(search).get("id");
  const page = new URLSearchParams(search).get("page") || 1;
  const saleType = new URLSearchParams(search).get("type") || 1;

  const {t} = useTranslation();
  const [fetchData, { data, isLoading, error }] = useLazySaleDetailsQuery();
  const [reverse, setReverse] = useState({
    isOpen:false,
    data: {}
  });
  const customerHistory = useSelector((state)=> state?.customer.history);
  const dispatch = useDispatch();
  const collSlice = useSelector((state)=>state?.collumnFilter)
  
  const createCollumnBody = async() => {
    const dataFromLS = await JSON.parse(localStorage.getItem("historyColumn"))
    const newBody = [];
    dataFromLS.forEach((item) => {
      if(item?.checked) {
        newBody.push(item?.key)
      }
    })
    dispatch(setCollTitle(newBody))
  };

 
  const rows = customerHistory?.map((item,index) => {
    const date = new Date(item?.date)
    return createRowModel(
      index + 1,
      collSlice?.collTitle.includes("id") ? 
      <strong>
        {item?.id}
        <HdmStatus status={Boolean(item?.ehdmStatus)} mode={item?.hdmMode} />
      </strong>: null,
      collSlice?.collTitle.includes("date") ? createDateFormat(item?.date): null,
      collSlice?.collTitle.includes("operation") ?
       <ButtonGroup>
        <Button 
          variant="contained"  
          onClick={()=>{
            window.open( item?.link, '_blank', 'noopener,noreferrer');
          }}
        >
          SEE
        </Button>
      
        {/* {(saleType === "1" || saleType === "4") &&
        <Button 
          variant="contained"  
          onClick={()=>{
            setReverse({
              isOpen:true,
              data:item
            })
          }}
        >
          Reverse
        </Button>} */}
      </ButtonGroup>: null,
      
      collSlice?.collTitle.includes("recieptId") ? item?.recieptId: null,
      collSlice?.collTitle.includes("total") ? item?.total: null,
      collSlice?.collTitle.includes("cashAmount") ? item?.cashAmount: null ,
      collSlice?.collTitle.includes("cardAmount") ? item?.cardAmount: null ,
      collSlice?.collTitle.includes("prepaymentAmount") ? item?.prepaymentAmount : null,
      collSlice?.collTitle.includes("additionalDiscount") ? item?.additionalDiscount: null,
      collSlice?.collTitle.includes("saleType") ?
      item?.saleType === 1 ? t("history.cash") :
      item?.saleType === 2 ? t("history.card") :
      item?.saleType === 3 ? t("history.qr") :
      item?.saleType === 4 ? t("history.link") :
      item?.saleType === 5 ? t("history.prepaymentRedemption") :
      item?.saleType === 7 ? t("history.combo") :
      item?.saleType === 8 ? t("history.cardCashSell"): "":null,

      collSlice?.collTitle.includes("partnerTin") ? item?.partnerTin || "-" : null,
      collSlice?.collTitle.includes("cashier") ? item?.cashier?.fullName: null
    )
  });

  useEffect(() => {
    fetchData({
      page: page,
      count: 10,
      isPayd: true,
      searchString: "",
      "storeId": storeId,
      "historyType": saleType
    })
  },[saleType, page]);

  useEffect(() => {
    createCollumnBody()
  },[page]);

  useEffect(() => {
    if(!JSON.parse(localStorage.getItem("historyColumn"))){
      dispatch(setCollumns(columnNames))
      localStorage.setItem("historyColumn", JSON.stringify(columnNames))
    }
    else{
      dispatch(setCollumns(JSON.parse(localStorage.getItem("historyColumn"))))
    }
  },[]);


  if(isLoading){ <div>Loading....</div> }

  return (
    <div>
      {customerHistory &&
        <UniversalTable 
          rows={rows}
          // key={rows[0]}
          collumns={collSlice?.collTitles}
          clickToRow={()=>console.log("click to paymtransaction row")} 
        />
      }
      {/* Ռեվերսի ֆոեւնկցիանգրված չէ,ուղղակի սթորիքսի ռեվերսն ա դրած */}
      {/* { reverse?.isOpen &&
        <ReverseReciept
        open={reverse?.isOpen}
        close={()=>
          setReverse({
          isOpen:false,
          data:{}
        })} 
        data={reverse?.data}
        /> 
      } */}
    </div>
  )
};

export default memo(CustomerSaleHistory);
