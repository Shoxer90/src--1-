import { memo, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";
import { Alert, Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";
import React from "react";
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import ItemReverse from "./ItemReverse";
import SelectAll from "./SelectAll";
import { editOrReversePrepaymentReceipt, reverseProductNew } from "../../../services/user/userHistoryQuery";
import Loader from "../../loading/Loader";
import ReverseConditions from "./condition/ReverseConditions";

const ReverseDialog = ({
  openDialog,
  setOpendDialog,
  products,
  item,
  messageAfterReverse,
}) => {

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
      reverseContainer.map((item,index) =>{
        if(index === i){
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
      messageAfterReverse(res?.data?.reverceLink);
      setOpendDialog(false)
    }
  })
};  

const chooseFuncForSubmit = () => {
  if(item?.saleType !== 5) {
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
    "saleDetailId": item?.id,
    "products" : []
  }
  reverseContainer.forEach((prod, index) => {
    if(prod?.isChecked) {
      body?.products.push({
        remove: reverseContainer[index]?.quantity === item?.products[index]?.count,
        products:{
          ...item[index],
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
      saleDetailId: item?.id,
      products: [...newArr],
      cashAmount: Math.round(+conditionState?.cashAmount*100) /100,
      cardAmount: Math.round(+conditionState?.cardAmount*100) /100,
      // cashAmount: +conditionState?.cashAmount,
      // cardAmount: +conditionState?.cardAmount
    })
 
};

  const totalCounter = async() => {
    let total = 0;
    reverseContainer.forEach((item, i) => {
      if(item?.isChecked) {  
        total+= products[i]?.discountedPrice * reverseContainer[i]?.quantity
      }
    })
    await setReverseTotal(total)
  };

console.log(reverseTotal,"reverseTotal");
console.log(conditionState.productscashAmount,"cashAmount");
console.log(conditionState.cardAmount,"cardAmount");

  const fillReverseContainer = async() => {
    const arr = []
    await products && products.map((item) => arr.push({
      recieptId: item?.recieptId, 
      quantity: item?.count, 
      isChecked: false
    }))
    setReverseContainer(arr)
  };
  
  const createReceiptAmountForPrePayment = () => {
    let total = 0
      products.forEach((prod)=>{
      total += prod?.count * prod?.discountedPrice
    })
    return setReceiptAmountForPrepayment(total)
  };

  useEffect(() => {
    openDialog && fillReverseContainer() 
    item?.saleType === 5 && createReceiptAmountForPrePayment()
  }, [openDialog]);

  
  useEffect(() => {
    totalCounter()
  }, [reverseContainer]);

  return(
    <Dialog
      open={openDialog}
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
          <CloseIcon onClick={()=>setOpendDialog(false)} />
        </DialogTitle>
        <Divider color="black" />

        <SelectAll selectAllProducts={selectAllProducts} isAllSelected={isAllSelected} />
        {products.map((prod,index)=>(
          <ItemReverse
            key={prod?.id}
            {...prod}
            reverseContainer={reverseContainer}
            setReverseContainer={setReverseContainer}
            checkedProduct={checkedProduct}
            index={index}
            totalCounter={totalCounter}

          />
        ))}
        <Divider color="black" />

        <ReverseConditions
          {...item}
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

export default memo(ReverseDialog);
