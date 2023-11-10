import React, { memo, useEffect,useState } from "react";

import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { Alert, Divider, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import { reverseProductNew } from "../../../services/user/userHistoryQuery";
import Loader from "../../loading/Loader";

import styles from "./index.module.scss";
import ReverseItem from "./ReverseItem";
import ReverceConditions from "./ReverceConditions";
import ReversePrepayment from "./ReversePrepayment";

const ReverseContainer = ({
  products, 
  dialogManage, 
  openDialog, 
  saleDetailId, 
  initialFunc,
  t,
  setOpenHDM, 
  messageAfterReverse,
  saleInfo
}) => {
  const [ownMessage,setOwnMessage]=useState();
  const [type,setType] = useState();
  const [load,setLoad] = useState(false);
  const [reverseContainer,setReverseContainer] = useState([]);
  const [reverseTotal, setReverseTotal] = useState(0);

  const [reversePrepayment, setReversePrepayment] = useState(false);

  const [conditionState,setCondition] = useState({
  cashAmount: 0,
  cardAmount: 0,
});

  const cancelDialog = () => {
    setOwnMessage({m:"", t:""})
    dialogManage();
    initialFunc("Paid");
  };


  const handleOk = async(body) => {
    setLoad(true)
      await reverseProductNew(body).then((res) => {
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
      }else if(res.status === 200){ 
        setOpenHDM(false)
        cancelDialog()
        messageAfterReverse();
      }
    })
  };  

  const handleChange = (i,measure,name, value) => {
    if(!value || value <= 0) return
    setReverseContainer(reverseContainer.map((item,index) => {
      if(index !== i){
        return item
      }else {
        if(+value > products[i].count) return item
        else if(measure === "հատ" || measure === "pcs" || measure === "шт"){
          return{
            ...item,
            [name]: Math.round(+value)
          }
        }else if((value.indexOf(".") !== -1 && value.split('.')[1]?.length > 3 ) || +value > products[index].quantity){ 
          return item

        }else{
          return {
            ...item,
            [name]: +value
          }
        }
      }
    })
  )}
  
  const checkedProduct = (i,name, value) => {
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

  const reverse = async () => {
    const newArr = []
    if(saleInfo?.res?.printResponseInfo?.saleType !== 0) {
      await reverseContainer.map((item) => {
        if(item?.isChecked){
          newArr.push({
            recieptId: item?.recieptId,
            quantity: item?.quantity
          })
        }  
        return newArr
      })
      await handleOk({
        saleDetailId: saleDetailId,
        products: [...newArr],
        cashAmount: +conditionState?.cashAmount,
        cardAmount: +conditionState?.cardAmount
      })
    }else if(reversePrepayment){
      handleOk({
        saleDetailId: saleDetailId,
        products: [],
        cashAmount: +conditionState?.cashAmount,
        cardAmount: +conditionState?.cardAmount
      })
    }
  };

  const fillReverseContainer = async() => {
    const arr = []
    await products && products.map((item) => arr.push({
      recieptId: item?.recieptId, 
      quantity: item?.count, 
      // isChecked: false
      isChecked: saleInfo?.res?.printResponseInfo?.partialAmount? true : false
    }))
    setReverseContainer(arr)

  }
 
  useEffect(() => {
    fillReverseContainer()
  }, [openDialog]);
  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      open={openDialog}
    >
      <DialogTitle>
        {t("history.reverse_products")}
      </DialogTitle>
      <IconButton
          aria-label="close"
          onClick={dialogManage}
          sx={{
            position: 'absolute',
            right: 11,
            top: 11,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

      <Divider color="black"/>

      <DialogContent  style={{padding:"10px"}} >
        <div style={{padding:"10px",paddingBottom:"12px"}}> 
          {products?.length ? products.map((product,index) => (
            <ReverseItem 
              key={product?.id} 
              product={product} 
              checkedProduct={checkedProduct} 
              index={index} 
              products={products}
              handleChange={handleChange}
              reverseContainer={reverseContainer}
              t={t}
              setReverseTotal={setReverseTotal}
              reverseTotal={reverseTotal}
              saleInfo={saleInfo}
            />
          )) :
            <ReversePrepayment
              saleInfo={saleInfo} 
              handleChange={handleChange}
              setReverseTotal={setReverseTotal}
              reverseTotal={reverseTotal}
              reversePrepayment={reversePrepayment}
              setReversePrepayment={setReversePrepayment}
            />
          }
        </div>
        <Divider color="black" />
        <ReverceConditions 
          saleInfo={saleInfo} 
          t={t} 
          reverseTotal={reverseTotal} 
          conditionState={conditionState}
          setCondition={setCondition} 
          reversePrepayment={reversePrepayment}
          setReversePrepayment={setReversePrepayment}
        />
      <Divider color="black" />
      </DialogContent>
      <DialogActions style={{position:"sticky",marginTop:"0px"}}>
        <Button autoFocus onClick={dialogManage}>
          {t("buttons.close")}
        </Button>
        <Button onClick={reverse}>{t("buttons.submit")}</Button>
      </DialogActions>
      
      <Dialog open={load}> <Loader /> </Dialog>

      {ownMessage && 
        <Dialog open={Boolean(ownMessage)} >
          <Alert  severity={type} sx={{padding:"3px 10px", margin:0}} onClose={()=>setOwnMessage("")}>
            {ownMessage}
          </Alert>
        </Dialog>
      }
    </Dialog>
  );
}

export default memo(ReverseContainer);
