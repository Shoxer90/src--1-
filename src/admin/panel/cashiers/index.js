import { memo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCashiersDetailsQuery } from "../../../store/customer/customerApi";
import { useDispatch, useSelector } from "react-redux";
import { createRowModel } from "../../modules/variables";
import UniversalTable from "../../table/UniversalTable";
import { setCollumns } from "../../../store/filter/collumnFilterSlice";

const cc = ["id", "blocked","firstName","userName", "password", "email","ehdmStatus", "reverceStatus","physicalHdmStatus", "ehdmMode"];
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

const CustomerCashiers = () => {
  const dispatch = useDispatch();
  const search = useLocation();
  const storeId = new URLSearchParams(search).get("id");
  const collSlice = useSelector(state => state?.collumnFilter);

  const {data:cashiers,isLoading,isError} = useCashiersDetailsQuery(storeId);

   const rows = cashiers?.map((item,index) => {
      return createRowModel(
        `${index+1}.`,
        collSlice?.collTitle.includes("id") && item?.id, 
        collSlice?.collTitle.includes("blocked") && `${item?.blocked}`, 
        collSlice?.collTitle.includes("firstName") &&   `${item?.firstName} ${item?.lastName}`, 
        collSlice?.collTitle.includes("userName") && item?.userName, 
        collSlice?.collTitle.includes("password") && `${item?.password}`, 
        collSlice?.collTitle.includes("email") && `${item?.email}`, 
        collSlice?.collTitle.includes("ehdmStatus") && `${item?.ehdmStatus}`, 
        collSlice?.collTitle.includes("reverceStatus") && `${item?.reverceStatus}`, 
        collSlice?.collTitle.includes("physicalHdmStatus") && `${item?.physicalHdmStatus}`, 
        collSlice?.collTitle.includes("ehdmMode") && `${item?.ehdmMode}`, 
      )
    });

    useEffect(() => {
      dispatch(setCollumns(invoicesCollNames))
      localStorage.setItem("historyColumn", JSON.stringify(invoicesCollNames))
    }, []);

  if(isLoading){<div>Loading...</div>};

  return(
    <div>

      Cashiers
      {cashiers && 
        <UniversalTable
          rows={rows} 
          collumns={collSlice?.collumns}
        />
      }
    </div>
  )
};

export default memo(CustomerCashiers);
