import { memo, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";
import { Alert, Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";
import React from "react";
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import ItemReverse from "../../../../Container2/historyPage/editsales/ItemReverse";
import SelectAll from "../../../../Container2/historyPage/editsales/SelectAll";
// import { editOrReversePrepaymentReceipt, reverseProductNew } from "../../../../services/user/userHistoryQuery";
// import Loader from "../../loading/Loader";
// import ReverseConditions from "./ReverseConditions";
import { editOrReversePrepaymentReceipt, reverseProductNew } from "../../../../services/user/userHistoryQuery";
import ReverseConditions from "../../../../Container2/historyPage/editsales/ReverseConditions";
import Loader from "../../../../Container2/loading/Loader";

const ReverseReciept = ({open, close, data}) => {
const {t} = useTranslation();
const [type, setType] = useState();
const [load, setLoad] = useState(false);
const [ownMessage, setOwnMessage] = useState();
const [reverseTotal, setReverseTotal] = useState(0);
const [reverseContainer, setReverseContainer] = useState([]);
const [isAllSelected, setIsAllSelected] = useState(false);
const [receiptAmountForPrepayment, setReceiptAmountForPrepayment] = useState(0);
const ref = useRef();


const [conditionState, setConditionState] = useState({
  cashAmount: 0,
  cardAmount: 0,
  prePaymentAmount: 0
});

const selectAllProducts = (bool) => {
  const newArr = []
  reverseContainer.forEach((item) => {
    newArr.push({
      ...item,
      isChecked: bool,
    })
  })
  setIsAllSelected(bool)
  return setReverseContainer(newArr)
};

const checkedProduct = (i, name, value) => {
  if(!value) {
    setIsAllSelected(false)
  }
  setReverseContainer(
    reverseContainer.map((item) =>{
      if(item?.recieptId === i){
        return {
          ...item,
          [name]: value
        }
      }else{
        return item
      }
    })
  )
};

const handleOk = async(func, body) => {
setLoad(true)
  await func(body).then((res) => {
  setLoad(false)
  if(res === 400) {
    setType("error")
    setOwnMessage(`${t("dialogs.sorry")}, ${t("dialogs.wrong")}`)
  }else if(res === 406) {
    setType("error")
    setOwnMessage(`${t("dialogs.sorry")}, ${t("dialogs.choose")}`)
  }else if(res === 403) {
    setType("error")
    setOwnMessage(`${t("dialogs.sorry")}, ${t("dialogs.noReverse")}`)
  }else if(res.status === 200 && res?.data?.reverceLink){
   return close
  }
})
};  

const chooseFuncForSubmit = () => {
if(data?.saleType !== 5) {
  reverse()
}else {
  if(!conditionState?.cardAmount && !conditionState?.cashAmount) {
    reversePrepaymentProds()()
    
  }else {
    reverse()
  }
}
};

const reversePrepaymentProds = async () => {
setLoad(true)
const body = {
  "saleDetailId": data?.id,
  "products" : []
}
reverseContainer.forEach((prod, index) => {
  if(prod?.isChecked) {
    body?.products.push({
      remove: reverseContainer[index]?.quantity === data?.products[index]?.count,
      products:{
        ...data[index],
        count: reverseContainer[index]?.quantity
      }
    })
  }
})
handleOk(editOrReversePrepaymentReceipt,body)

};

const reverse = async () => {
const newArr = []
  await reverseContainer.map((item) => {
    if(item?.isChecked){
      newArr.push({
        recieptId: item?.recieptId,
        quantity: +item?.quantity
      })
    }  
    return newArr
  })
  await handleOk(reverseProductNew, {
    saleDetailId: data?.id,
    products: [...newArr],
    cashAmount: Math.round(+conditionState?.cashAmount*100) /100,
    cardAmount: Math.round(+conditionState?.cardAmount*100) /100,
  })

};

const totalCounter = async() => {
  let total = 0;
  reverseContainer.forEach((item, i) => {
    if(item?.isChecked) {  
      total+= data?.products[i]?.discountedPrice * reverseContainer[i]?.quantity
    }
  })
  await setReverseTotal(total)
};

const fillReverseContainer = async() => {
  const arr = []
  await data?.products && data?.products.map((item) => arr.push({
    ...item,
    quantity: item?.count, 
    isChecked: false
  }))
  setReverseContainer(arr)
};

const createReceiptAmountForPrePayment = () => {
  let total = 0
    data?.products.forEach((prod)=>{
    total += prod?.count * prod?.discountedPrice
  })
  return setReceiptAmountForPrepayment(total)
};

const checkAllAdd = () => {
  const newArr =  reverseContainer.filter((item)=>  {
    return item?.isChecked !==true
   })
   if (newArr?.length){
     setIsAllSelected(false)
   }else{
     setIsAllSelected(true)
   }
}

useEffect(() => {
  open && fillReverseContainer() 
  data?.saleType === 5 && createReceiptAmountForPrePayment()
}, [open]);


useEffect(() => {
  checkAllAdd()
  totalCounter()
}, [reverseContainer]);

return(
  <Dialog
    open={open}
    PaperProps={{
      sx: {
        width: '800px',
        maxWidth: 'none',
      },
    }}
  >
    <DialogContent>
      <DialogTitle className={styles.reverseContainer_header}>
        <span>{t("history.reverse_products")}</span>
        <CloseIcon onClick={close} />
      </DialogTitle>
      <Divider color="black" />

      {data?.products?.length ?
        <>
          <SelectAll selectAllProducts={selectAllProducts} isAllSelected={isAllSelected} />
          { reverseContainer.map((prod)=>(
            <ItemReverse
              key={prod?.id}
              {...prod}
              reverseContainer={reverseContainer}
              setReverseContainer={setReverseContainer}
              checkedProduct={checkedProduct}
              totalCounter={totalCounter}
            />
          ))}
        
        </>: <div style={{display:"flex",alignItems:"center", flexFlow:"column"}}>{t("basket.useprepayment")}</div>
      }
      <Divider color="black" />

      <ReverseConditions
        {...data}
        reverseTotal={reverseTotal}
        conditionState={conditionState}
        setConditionState={setConditionState}
        receiptAmountForPrepayment={receiptAmountForPrepayment}
        chooseFuncForSubmit={chooseFuncForSubmit}
        isAllSelected={isAllSelected}
      />

      {ownMessage && 
        <Dialog open={Boolean(ownMessage)} >
          <Alert  severity={type} sx={{padding:"3px 10px", margin:0}} onClose={()=>setOwnMessage("")}>
            {ownMessage}
          </Alert>
        </Dialog>
      }
    <Dialog open={!!load}> <Loader /> </Dialog>
    </DialogContent>
  </Dialog>
)
};

export default memo(ReverseReciept);
