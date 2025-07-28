import { memo, useEffect } from "react";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";
import { Alert, Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import ItemReverse from "./ItemReverse";
import SelectAll from "./SelectAll";
import { editOrReversePrepaymentReceipt, getHistoryByIdForReverse, reverseProductNew } from "../../../services/user/userHistoryQuery";
import Loader from "../../loading/Loader";
import ReverseConditions from "./ReverseConditions";
import EmarkInput from "./EmarkInput";

const ReverseDialog = ({
  openDialog,
  setOpendDialog,
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
  const [checkedEmarkQRs, setCheckedEmarkQRs] = useState([]);
  const [openEmarkInput, setOpenEmarkInput] = useState(false);
  const [emarksForReverse, setEmarksForReverse] = useState([])
  const [conditionState, setConditionState] = useState({
    cashAmount: 0,
    cardAmount: 0,
    prePaymentAmount: 0,
    emarks: emarksForReverse
  });

  const selectAllProducts = (bool) => {
    const newArr = reverseContainer?.map((item) => {
       return({
        ...item,
        isChecked: bool
       })
    })
    setIsAllSelected(bool)
    return setReverseContainer(newArr)
  };

  const checkedProduct = (i, name, value) => {
    if(!value) {
      setIsAllSelected(false)
    }
    let newContainer = reverseContainer.map((item) =>{
      if(item?.recieptId === i){
        return {
          ...item,
          [name]: value
        }
      }else{
        return item
      }
    })
    setReverseContainer(newContainer)
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

const checkEmarksOrSubmit = () => {
   if(checkedEmarkQRs?.length) {
    return setOpenEmarkInput(true)
  }else{
    chooseFuncForSubmit()
  }
}

const chooseFuncForSubmit = () => {
  setOpenEmarkInput(false)
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

const defineEmarkQrs = () => {
  console.log(reverseContainer, "reverseContainer");
  let emarkList = []
  const prodForReverse = reverseContainer.filter((item) => item?.isChecked);
  if(prodForReverse?.length) {
    prodForReverse.forEach((item) => {
      if(item?.emarks?.length) {
        emarkList.push(...item?.emarks)
      }
    })
    setCheckedEmarkQRs(emarkList)
  }
}

const reversePrepaymentProds = async () => {
  setLoad(true)
  const body = {
    "saleDetailId": item?.id,
    "products" : []
  }
  reverseContainer?.forEach((prod, index) => {
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
    })
 
};

  const totalCounter = async() => {
    let total = 0;
    reverseContainer?.forEach((item, i) => {
      if(item?.isChecked) {  
        total+= item?.discountedPrice * item?.quantity
        // total+= products[i]?.discountedPrice * reverseContainer[i]?.quantity
      }
    })
    await setReverseTotal(total)
  };

  const fillReverseContainer = async() => {
    const arr = item?.products?.map((item) => {
      return ({
        ...item,
        quantity: item?.count, 
        isChecked: false
      })
     
    })
    setReverseContainer(arr)
  };
  
  const createReceiptAmountForPrePayment = () => {
    let total = 0
      item?.products.forEach((prod)=>{
      total += prod?.count * prod?.discountedPrice
    })
    return setReceiptAmountForPrepayment(total)
  };

  const checkAllAdd = () => {
    const newArr =  reverseContainer?.filter((item)=>  {
      return item?.isChecked !==true
     })
     if (newArr?.length){
       setIsAllSelected(false)
     }else{
       setIsAllSelected(true)
     }
  };

  useEffect(() => {
    fillReverseContainer(item) 
    item?.saleType === 5 && createReceiptAmountForPrePayment()
  }, [openDialog]);

  
  useEffect(() => {
    checkAllAdd()
    totalCounter()
    defineEmarkQrs()
  }, [reverseContainer]);

  return(
    reverseContainer ? <Dialog
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

        {reverseContainer ?
          <>
            <SelectAll selectAllProducts={selectAllProducts} isAllSelected={isAllSelected} />
            { reverseContainer?.map((prod)=>(
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
          {...item}
          reverseTotal={reverseTotal}
          conditionState={conditionState}
          setConditionState={setConditionState}
          receiptAmountForPrepayment={receiptAmountForPrepayment}
          chooseFuncForSubmit={chooseFuncForSubmit}
          isAllSelected={isAllSelected}
          defineEmarkQrs={defineEmarkQrs}
          checkEmarksOrSubmit={checkEmarksOrSubmit}
        />
          <EmarkInput
            open={openEmarkInput}
            close={()=>setOpenEmarkInput(false)}
            chooseFuncForSubmit={chooseFuncForSubmit}
            emarksForReverse={emarksForReverse}
            setEmarksForReverse={setEmarksForReverse}
            checkedEmarkQRs={checkedEmarkQRs}
            setCheckedEmarkQRs={setCheckedEmarkQRs}
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
    </Dialog>: ""
  )
};

export default memo(ReverseDialog);
