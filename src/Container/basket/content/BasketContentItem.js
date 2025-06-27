import { memo, useRef, useState } from 'react';
import styles from "../index.module.scss"
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect } from 'react';
import ConfirmDialog from '../../../Container2/dialogs/ConfirmDialog';
import {cheackProductCountnPrice } from '../../../services/products/productsRequests';
import { useTranslation } from 'react-i18next';
import EmarkInputForDeleteItem from "../emark/EmarkInputForDeletItem";
import useDebonce from '../../../Container2/hooks/useDebonce';

const BasketContentItem = ({
  el, 
  avail, 
  setAvail, 
  deleteBasketItem,
  changeCountOfBasketItem,
  screen,
  flag,
  createMessage,
  freezeCount,
  setOpenBasket,
 setFrom

}) => {
  const ref = useRef();
  const {t} = useTranslation();
  const [notAvailable, setNotAvailable] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [errRed, setErrRed] = useState(false);
  const [ownCount, setOwnCount] = useState(0);
  const [dataFromLS, setDataFromLS] = useState({});
  const [openEmarkInput, setOpenEmarkInput] = useState(false);
  const [operation,setOperation] = useState("");
  const [change, setChange] = useState(false);
  const [newCount, setNewCount] = useState(el?.count)

  const removeOneProduct = async() => {
    notAvailable && setAvail(avail.filter(item => item !== el.id))
    editRemovePrepaymentItem(el?.productId || el?.id)
    deleteBasketItem(el.id, el?.isEmark, el?.barCode)
    setOpenDialog(false)
  };

  const getErrorStyle = (isErr) => {
    if(isErr) {
      ref.current.style.border="solid red 2px"
      ref.current.style.color="red"
      return ref
    }else {
      ref.current.style.color="";
      ref.current.style.border="";
    }
  };

  const checkPriceChangeV2 = async(val) => {
    let count = {count:0}
    if(freezeCount?.length) {
      count = freezeCount.find(item => item?.productId === el?.productId)
      if(count === undefined) {
        count = {count:0}
      }
    }
    if(+val > count?.count) {
      cheackProductCountnPrice([{
        "id": el?.productId || el?.id,
        "count": val - count?.count,
        "price": el?.price
      }]).then((result) => {
        if(!result[0]?.countStatus) {
          // if we havenot so many prod
          getErrorStyle(true)
          return createMessage("error", ` ${el?.name} ${t("dialogs.havenot")} ${result[0]?.existCount} ${t(`${el?.measure}`)}`)
        }else if(!result[0]?.priceStatus) {
          getErrorStyle(true)
          return createMessage("error", t("basket.price_change"))
        }
        else{
          changeCountOfBasketItem( el?.id, val)
        }
      })
    }else {
      if(localStorage.getItem("isEditPrepayment")) {
        editPrepaymentCounts(el?.productId, val)
      }
      changeCountOfBasketItem( el?.id, val)
    }
  };

// remove one prod from prepayment
  const editRemovePrepaymentItem= async(id) => {
    let editedData = await (JSON.parse(localStorage.getItem("isEditPrepayment")))
    let flag = 0
    let newDataForEdit = editedData?.sales?.map((item) => {
      if(item?.id === id){
        flag += 1
        return {
          ...item,
          count: 0
        }  
      }else {
        return item
      }
    })
    if(!flag) {
      newDataForEdit?.push({
        id:id,
        count:0
      })
    }
    localStorage.setItem("isEditPrepayment", JSON.stringify({
      ...editedData,
      sales: newDataForEdit
    }))
  }
// edit one prod from prepayment

const editPrepaymentCounts = async(id,value) => {
  let infuncData = await JSON.parse(localStorage.getItem("isEditPrepayment"))
  if(infuncData) {
    let flag = 0
    let arr = infuncData?.sales?.map((item) => {
      if(item?.id === id) {
        flag+=1
        return {
          ...item,
          count: value
        }
      }else {
        return item
      }
    })
    if(!flag) {
      arr?.push({
        id: id,
        count: value
      })
    }
    localStorage.setItem("isEditPrepayment",JSON.stringify({...infuncData, sales:arr}))
  }
}


const handleChangeBasketCount = (val, fromEmarkDialog) => {
  setNewCount(val)
  if(val> el?.count){
    setOperation("incr")
  }else{
    setOperation("decr")
  }
  if((dataFromLS?.scanRequired || 
    dataFromLS?.scanRequired === undefined || 
    (dataFromLS?.scanRequired && el?.count < dataFromLS?.emarks?.length && operation !=="incr")) &&
    el?.isEmark
  ) {
    return setOpenEmarkInput(true)
  }else{
    setErrRed(false)
    let count = {count:0}
    if(freezeCount?.length) {
      count = freezeCount.find(item => item?.productId === el?.productId)
      if(count === undefined) {count = {count:0}}
    }
    if(+val > (+count?.count + el?.remainder))  return setErrRed(true)
  // ete amen ban ok a u apranqi qanake petq e poxenq
    else{
      getErrorStyle(false)
      let isValid = false;
      if(el?.measure === "հատ" || el?.measure === "pcs" || el?.measure === "шт") {
        const needSymb = /^[0-9]*$/;
        isValid = needSymb.test(val);
        if(isValid || val === "") {
          checkPriceChangeV2(+val)
        }else{
          return
        }
      }else {
        const needSymb = /^\d+(\.\d{0,3})?$/
        isValid = needSymb.test(val)
        if(isValid || val === "") {
          if(val[`${val}`.length - 1] === ".") {
            return checkPriceChangeV2(val)
          }else { 
            return checkPriceChangeV2(+val)
          }
        }else if (val === "0" || val === "."){
          return checkPriceChangeV2( "0.")
        }else{
          return
        }
      }
    }
  }
};
  
// freezed counts from prepayment and made owncount for limit with plusing to remainder
  const getFreezedCount = () => {
    let count = 0
    if(freezeCount?.length) {
      count = freezeCount.find(item => item?.productId === el?.productId)
      if(count === undefined) {
        return setOwnCount(0)
      }else{
        return setOwnCount(count?.count)
      }
    }
  };

  const emarkQrCounting = () => {
    const data = localStorage.getItem("emarkNewList")
    if(el?.isEmark && data){
      const allEmarkList = JSON.parse(data) || []
      if (allEmarkList?.length) {
       let data = allEmarkList?.filter((item) => item?.barcode === el?.barCode)
        if(data?.length){
          setDataFromLS(data[0])
        }
      }
    }
  }

  useEffect(() => {
    getFreezedCount()
  }, [freezeCount]);

  useEffect(() => {  
    setNotAvailable(false)
  }, [flag]);

  useEffect(() => {
    avail?.length ? 
    avail.map((item) =>{
      return item === el?.id ? setNotAvailable(true) : setNotAvailable(false)
    }): setNotAvailable(false)
  }, [avail]);

  useEffect(() => {
    emarkQrCounting()
  }, [el?.count, change]);
  
  return (
    <div className={styles.basketContent_item} ref={ref} style={{border:notAvailable? "red solid 2px":"none"}}> 
      {screen > 500 && <div className={styles.basketContent_item_image}>
        <img
          src= {el?.photo || "/default-placeholder.png"}
          alt="img"
        />
      </div>}
        <div className={styles.basketContent_item_info}>
          <div 
            className={styles.basketContent_item_info_title} 
            style={{fontSize:el?.name?.length>14 ? "80%": "100%"}}
          >
            <span className={styles.hovertext} data-hover={el?.name} >
              {el?.name?.length>30 ? `${el?.name.slice(0,30)}...` : el?.name }
            </span>
          </div>
          <div style={{fontSize:"80%"}}>

            <div className={styles.basketContent_item_info_price}> 
          
              <div>
                <span>{el?.price} {t("units.amd")} </span> 
                { el?.discount > 0 &&  
                  <span style={{color:"red"}}> 
                    /{(el?.discountedPrice)?.toFixed(2)} {t("units.amd")}
                  </span>
                }
              </div>
            </div>
            <div style={{fontSize:"90%"}}>
              <strong>{el?.barCode || el?.goodCode? `bar ${el?.barCode || el?.goodCode} /  `: ""}</strong>
              <span 
                style={{
                  color:!el?.remainder || errRed ? "red": null,
                  fontWeight:!el?.remainder || errRed ? 700: null
                }}
              > 
                <div>
                  {t("basket.maxCount")} {el?.remainder + ownCount} {t(`units.${el?.unit || el?.measure}`)}
                </div>
              </span>
        
            </div>
          </div> 
        </div>
        <div className={styles.basketContent_item_quantity}>
          <input
            ref={ref}
            style={{ width:"100%",border: !el?.count? "red solid 2px":null,fontWeight:700,fontSIze:"100%"}}
            value={el?.count}
             onBlur={() => {
              if(el?.count < dataFromLS?.emarks?.length) {
                setOperation("decr")
                setOpenEmarkInput(true)
              }
            }}
            onChange={(event) => handleChangeBasketCount(event.target.value, false)} 
          />

          <div style={{margin:"3px",width:"40px", fontSize:"80%"}}>
            {el?.measure ? t(`units.${el?.measure}`) : t(`units.${el?.unit}`)}
          </div>
        </div>
        <div className={styles.basketContent_item_garbage} onClick={()=>setOpenDialog(true)}>
         <DeleteIcon fontSize="medium" sx={{"&:hover":{color:"green"}}} />
        </div>
        <ConfirmDialog
          question={t("basket.removeoneprod")}
          func={removeOneProduct}
          title={t("settings.remove")}
          open={openDialog}
          close={setOpenDialog}
          content={" "}
          t={t}
        />
        <EmarkInputForDeleteItem 
          open={openEmarkInput} 
          setFrom={setFrom}
          close={()=>setOpenEmarkInput(false)} 
          count={dataFromLS?.emarks?.length} 
          operation={operation}
          setOperation={setOperation}
          bCode={el?.barCode}
          setChange={setChange}
          change={change}
          setOpenBasket={setOpenBasket}
          name={el?.name}
          checkPriceChangeV2={checkPriceChangeV2}
          productCount={el?.count}
          isLessThanQr={dataFromLS?.emarks?.length > newCount}
          handleChangeBasketCount={handleChangeBasketCount}
          completeFunc={()=>{
            checkPriceChangeV2(dataFromLS?.emarks?.length)
            setOpenEmarkInput(false)
          }}
        />
    </div>
  )
}

export default memo(BasketContentItem);
