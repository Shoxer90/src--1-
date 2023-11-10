import React, { useState } from "react" ;
import { memo } from "react";
import styles from "./index.module.scss";
import { useEffect } from "react";


const ReverseItem = ({product, products,checkedProduct,index,handleChange,reverseContainer,t,setReverseTotal,reverseTotal, saleInfo}) => {
  const [inputStep, setInputStep] = useState();

  const getInputStep = unit => unit === "pcs" || unit === "шт" || unit === "հատ" ? setInputStep("1"): setInputStep("0.1");
  
  const totalCounter = async() => {
    if(saleInfo?.res?.printResponseInfo?.partialAmount) {
       setReverseTotal(saleInfo?.res?.printResponseInfo?.totalAmount)
       return
    }
    let total = 0;

    reverseContainer.map((item, i) => {
      if(item?.isChecked) {
       return total+= +(products[i]?.price - products[i]?.price * 0.01* products[i]?.discount  -
         ( products[i]?.price - products[i]?.price * 0.01 * products[i]?.discount) * 0.01 * saleInfo?.res?.printResponseInfo?.items[0]?.additionalDiscount) *
        reverseContainer[i]?.quantity
      }else{
        return item
      }
    })
    await setReverseTotal(total)
  }; 

  useEffect(() => {
    totalCounter()
    getInputStep(t(`units.${product?.unit}`))
  },[reverseContainer]);

  return(
     <label className={styles.radioDialog}>
        <span style={{display:"flex"}}>
          <input 
            type="checkbox"
            name="isChecked"
            onChange={(e)=>{
              if(saleInfo?.res?.printResponseInfo?.partialAmount > 0) return
              checkedProduct(index, e.target.name, e.target.checked)
            }}
            checked={saleInfo?.res?.printResponseInfo?.partialAmount > 0 ? true: null}
            readOnly={saleInfo?.res?.printResponseInfo?.partialAmount > 0 ? true : false}
          />
          <img 
            src={product?.photo || "/default-placeholder.png"} 
            alt="prod" 
            style={{width:"40px",height:"30px",border:"solid grey 1px",borderRadius:"2px",alignSelf:"center",margin:"2px"}} 
          />
          <p style={{fontSize:"80%"}}>{product?.brand} {product?.name}</p>
        </span>
        <label className={styles.reverse_quantity}>
          <input
            type="number"
            name="quantity"
            value={reverseContainer[index]?.quantity}
            onChange={(e)=>{
              handleChange(index, product?.unit, e.target.name, e.target.value)
            }}
            step={inputStep}
          />
          <div style={{width:"4px"}}>{" "}</div>
          <span style={{minWidth:"40px"}}>
            {t(`units.${product?.unit}`)}
          </span> 
        
        </label>
      </label> 
  )
};

export default memo(ReverseItem);
