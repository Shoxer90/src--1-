import React, { memo, useEffect, useState } from 'react';
import { allLanguageMeasures, takeMeMeasureArr } from '../../../modules/modules';

import styles from "./index.module.scss";
import { adgValidation, barcodeValidation, measureValidation, nameLimitValidation, priceValidation } from '../../../modules/excelCeilValidation';

const ExcelRow = ({prod,inputValue,setInputValue,checkRowStatus, row, t}) => {
  const [measureLangArr,setMeasureLangArr] = useState([]);
  const [isValidCurrentProd, setIsValidCurrentProd] = useState({});
  const errorStyle = {
    border: "solid red 2px",
    color:"red"
  }

  const handleChange = (name,value) => {
    const arr = [];
    inputValue.map((row) => {
      if(row?.__rowNum__=== prod?.__rowNum__){
       return arr.push({
          ...row,
          "__rowNum__": prod?.__rowNum__,
          [name] : value
        })
      }else{
        return arr.push(row)
      }
    })
    setInputValue(arr)
  };

  const filterValidRow = async() => {
    setIsValidCurrentProd({
      type: await adgValidation(prod?.type),
      measure: await measureValidation(prod?.measure),
      name: nameLimitValidation(prod?.name, prod?.name?.length),
      price: priceValidation(prod?.price),
      purchasePrice: priceValidation(prod?.purchasePrice),
      remainder: priceValidation(prod?.remainder),
      barCode: barcodeValidation(prod?.barCode),
    })
  };

  const onlyNumberAndADot = (event) => {
    const valid = /^\d*\.?(?:\d{1,2})?$/;
    const text = event.target.value;  
    if(valid.test(text)){
      handleChange(event.target.name, +event.target.value)
    }else{
      return 
    }
  };

  const onlyNumberAndLetters = (event) => {
    const valid = /^[a-zA-Z0-9_]+$/
    const text = event.target.value;  
    if(valid.test(text)){
      handleChange(event.target.name, event.target.value)
    }else{
      return  handleChange(event.target.name,event.target.value.slice(0,-1) )
    }
  };

  const getMeasureSelectOptions = async() => {
    const arr = await takeMeMeasureArr(localStorage.getItem("lang"))
    setMeasureLangArr(arr)
  };

  useEffect(() => {
    getMeasureSelectOptions()
  },[t])

  useEffect(()=> {
    checkRowStatus(isValidCurrentProd, row)
  },[isValidCurrentProd]);

  useEffect(()=> {
    filterValidRow()
   },[inputValue]);

  return (
    <tr className={styles.tablerow}>
      <th scope="row">{prod?.__rowNum__}</th>
      <td>
        <input 
          onChange={(e)=>{
           return e.target.value.trim() || prod?.type ? (
              handleChange(e.target.name,e.target.value),
              adgValidation(e.target.value)
            ): setIsValidCurrentProd({
              ...isValidCurrentProd,
              adg:false
            })  
          }}  
          value={prod?.type}
          name="type"
          style={!isValidCurrentProd?.type ? errorStyle : undefined}
        />
      </td>
      <td>
        <input 
          onChange={(e)=>{
            if(e.target.value?.length <= 50 || 
              e.target.value?.length < prod?.type?.length
            ){
              handleChange(e.target.name,e.target.value)
            }else{
              return
            } 
          }}
          value={prod?.name}
          name="name"
          style={!isValidCurrentProd?.name ? errorStyle : undefined}
        />
      </td>
      <td>
        <input
          onError={!prod?.brand} 
          onChange={(e)=> handleChange(e.target.name,e.target.value)} 
          value={prod?.brand} 
          name="brand" 
        />
      </td>
      <td>
        <input 
          onChange={(e)=>{
            if(prod?.measure === "հատ" ||
              prod?.measure === "psc" || 
              prod?.measure === "шт"
            ){
              handleChange(e.target.name, +e.target.value.replace(/[^1-9]+/g,""))
            }else{
              onlyNumberAndADot(e)
            }
          }}
          value={prod?.remainder} 
          name="remainder" 
          style={!isValidCurrentProd?.remainder ? errorStyle : undefined}
        />
      </td>
       <td>
          <div>
            {
              !allLanguageMeasures.includes(prod?.measure) &&
              <span style={{position: "absolute",textAlign:"center",paddingLeft:"5px",color:"red"}}>{prod?.measure}</span>
            }
            <select 
              onChange={(e)=> handleChange(e.target.name,e.target.value)}
              value={allLanguageMeasures.includes(prod?.measure)? t(`units.${prod?.measure}`) : t(`authorize.errors.err`)} 
              name="measure"
              style={{border: !allLanguageMeasures.includes(prod?.measure) && "solid red 2px", 
              color: !allLanguageMeasures.includes(prod?.measure) && "white"}}
            >
              {measureLangArr.map((measure) => {
                return <option style={{color:"black"}}value={measure} key={measure}>{measure}</option>
              })} 
            </select>  
          </div>
      </td>
      <td>
        <input 
          onChange={(e)=> onlyNumberAndADot(e)} 
          value={prod?.purchasePrice} 
          name="purchasePrice"
          style={!isValidCurrentProd?.purchasePrice ? errorStyle : undefined}

        />
      </td>
      <td>
        <input 
          onChange={(e)=> {
            onlyNumberAndADot(e)
          }}
          value={prod?.price} 
          name="price"
          style={!isValidCurrentProd?.price ? errorStyle : undefined}
        />
      </td>
      <td>
        <input 
          onChange={(e)=>{
            !e.target.value ?
            handleChange(e.target.name,e.target.value):
            onlyNumberAndLetters(e)
          }}
          value={prod?.barCode}
          name="barCode"
          style={!isValidCurrentProd?.barCode ? errorStyle : undefined}
        />
      </td>
  </tr>
  )
}

export default memo(ExcelRow);
