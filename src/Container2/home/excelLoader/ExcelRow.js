import React, { memo, useEffect, useRef, useState } from 'react';
import { allLanguageMeasures, takeMeMeasureArr } from '../../../modules/modules';

import styles from "./index.module.scss";
import { adgValidation, barcodeValidation, measureValidation, nameLimitValidation, priceValidation } from '../../../modules/excelCeilValidation';

const ExcelRow = ({
  prod,
  inputValue,
  setInputValue,
  checkRowStatus,
  row, 
  t,
  setBarCodes,
  barCodes
}) => {
  const [measureLangArr,setMeasureLangArr] = useState([]);
  const [isValidCurrentProd, setIsValidCurrentProd] = useState({});
  const [isBarCodeNotRepeat,setIsBarCodeNotRepeat] = useState();
  const [ceilName, setCeilName] = useState("");
  const [errorName,setErrorName] = useState("");
  const ref = useRef();

  const errorStyle = {
    border: "solid red 2px",
    color: "red"
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
    setCeilName(name)
    setInputValue(arr)
  };

  const uniqBarcodeInExcel = async() => {
    setErrorName("")
    let catchSameCode = 0
    const arr = barCodes;
    arr.map((item)=> {
      if(item?.code === prod?.barCode && item?.row !== row) {
        setErrorName("Կրկնվող բառկոդ/ ներքին կոդ")
        catchSameCode++
        return false
      }
    })
    if(!catchSameCode){
      arr.push({
        code: prod?.barCode,
        row: row
      })
      // return barcodeValidation(prod?.barCode)
      return await barcodeValidation(prod?.barCode).then((res)=> {
        if(!res) {
           setErrorName("Խանութում առկա է նույն ներքին կոդով ապրանք/ ծառայություն")
        }else if(res === "notValid"){
          setErrorName("Ներքին կոդի/բառկոդի սխալ ֆորմատ")
          return false
        }
          return res
      })  
    }
  }

  const barcodeCeilManagement = async() => {
    setErrorName("")
    let catchSameCode = 0
    const arr = barCodes;
    arr.map((item)=> {
      if(item?.code === prod?.barCode && item?.row !== row) {
        setErrorName("Կրկնվող բառկոդ/ ներքին կոդ")
        return catchSameCode++
      }
    })
      if(catchSameCode) {
        return false
      }else{
          arr[`${row}`]={code:prod?.barCode,row:row}
          setBarCodes(arr)
      //  return barcodeValidation(prod?.barCode)
       return await barcodeValidation(prod?.barCode).then((res)=> {
        if(!res) {
           setErrorName("Խանութում առկա է նույն ներքին կոդով ապրանք/ ծառայություն")
        }else if(res === "notValid"){
          setErrorName("Ներքին կոդի/բառկոդի սխալ ֆորմատ")
          return false

        }
          return res
        
      })  
      }
    };

  const filterValidRow = async() => {
    setIsValidCurrentProd({
      type: await adgValidation(prod?.type),
      measure: await measureValidation(prod?.measure),
      name: await nameLimitValidation(prod?.name, prod?.name?.length),
      price: prod?.price < 1 ? false : await priceValidation(prod?.price),
      purchasePrice: await priceValidation(prod?.purchasePrice),
      remainder: await priceValidation(prod?.remainder),
      barCode: await uniqBarcodeInExcel(),
    });
  };

  const setDataToUploading = (response) => {
    return setIsValidCurrentProd({
      ...isValidCurrentProd,
      [ceilName]: response
    })
  };

  const filterValidCeil = async() => {
    let response = null;
    switch (ceilName) {
      case "type":
        response =  await adgValidation(prod?.type)
        setDataToUploading(response)
        break;
      case "measure":
        response =  await measureValidation(prod?.measure)
        setDataToUploading(response)
        break;
      case "name":
        response = await nameLimitValidation(prod?.name, prod?.name?.length)
        setDataToUploading(response)
        break;
      case "price":
        response = prod?.price < 1 ? false : await priceValidation(prod?.price)
        setDataToUploading(response)
        break;
      case "purchasePrice":
        response =  await priceValidation(prod?.purchasePrice)

        break;
      case "remainder":
        response = await priceValidation(prod?.remainder)
        setDataToUploading(response)
        break;
      case "barCode":
        response =  await barcodeCeilManagement()
        setDataToUploading(response)
      break;
    }
    setCeilName("")
  }

  const onlyNumberAndADot = (event) => {
    console.log( typeof  event.target.value, "value")
    const valid = /^\d*\.?(?:\d{1,2})?$/;
    let text = +event.target.value;  
    
    if(valid.test(text)){
      return handleChange(event.target.name, +event.target.value)
    }
  };

  const onlyNumberAndLetters = (event) => {
    const valid = /^[a-zA-Z0-9_]+$/;
    const text = event.target.value;  
    if(valid.test(text)){
      return handleChange(event.target.name, event.target.value)
    }
  };

  const getMeasureSelectOptions = async() => {
    const arr = await takeMeMeasureArr(localStorage.getItem("lang"));
    setMeasureLangArr(arr)
  };

  useEffect(() => {
    getMeasureSelectOptions()
  },[t]);

  useEffect(()=> {
    checkRowStatus(isValidCurrentProd, row)
  },[isValidCurrentProd]);

  useEffect(()=> {
    filterValidCeil()
  },[ceilName]);

  useEffect(()=> {
  filterValidRow()
  },[]);

  return (
    <tr className={styles.tablerow}>
      <th scope="row">{prod?.__rowNum__}</th>
      <td>
        <input 
          onChange={(e)=>{
           return e.target.value.trim() || prod?.type ? (
              handleChange(e.target.name,e.target.value)
            )
            : setIsValidCurrentProd({
              ...isValidCurrentProd,
              adg: false
            })  
          }}  
          value={prod?.type}
          name="type"
          style={!isValidCurrentProd?.type ? errorStyle : undefined}
        />
      </td>
      <td  className={styles.hovertext} data-hover={prod?.name}>
        <input 
          onChange={(e)=>{
            if(e.target.value?.length <= 50 || 
              e.target.value.length < prod?.name?.length
            ){
              handleChange(e.target.name,e.target.value)
            }else{
              return
            } 
          }}
          value={prod?.name}
          name="name"
          style={!isValidCurrentProd?.name || !prod?.name  ? errorStyle : undefined}
        />
      </td>
      <td className={styles.hovertext} data-hover={prod?.brand}>
        <input
          
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
            <select 
              ref={ref}
              onChange={(e)=>{
                handleChange(e.target.name,e.target.value)
              }} 
              name="measure"
              style={{
                border: !allLanguageMeasures.includes(prod?.measure) && "solid red 2px", 
                color: !allLanguageMeasures.includes(prod?.measure) && "white"
              }}
            >
              {!allLanguageMeasures.includes(prod?.measure) && <option hidden selected></option>}
              {measureLangArr.map((measure) => {
                return <option style={{color:"black"}} value={measure} key={measure}>{measure}</option>
              })}  
            </select>  
          </div>
      </td>
      <td>
        <input 
          onChange={(e)=>{
            if(typeof e.target.value === "string" || e.target.value.length < prod?.purchasePrice.length){
              handleChange(e.target.name, +e.target.value.replace(/[^1-9]+/g,""))
            }
            onlyNumberAndADot(e)}
          } 
          value={prod?.purchasePrice} 
          name="purchasePrice"
          style={!isValidCurrentProd?.purchasePrice ? errorStyle : undefined}

        />
      </td>
      <td>
        <input 
          onChange={(e)=>{
            if(typeof e.target.value === "string" || e.target.value.length < prod?.purchasePrice.length){
              handleChange(e.target.name, +e.target.value.replace(/[^1-9]+/g,""))
            }onlyNumberAndADot(e)}
          }
          value={prod?.price} 
          name="price"
          style={!isValidCurrentProd?.price || !prod?.price? errorStyle : undefined}
        />
      </td>
      <td>
        <span className={errorName && styles.hovertext}  data-hover={errorName} >
          <input 
            onChange={(e)=>{
              if(e.target.value.length < prod?.barCode.length){
               handleChange(e.target.name,e.target.value)
              }else{
                onlyNumberAndLetters(e)
              }
            }}
            value={prod?.barCode}
            name="barCode"
            style={!isValidCurrentProd?.barCode || prod?.barCode===undefined || !prod?.barCode? errorStyle : undefined}
          />
        </span>
        
      </td>
      <td>
        <input 
          type="checkbox"
          onChange={(e)=> handleChange(e.target.name,e.target.checked? 2 : 0)} 
          checked={prod?.dep} 
          name="dep"
        />
      </td>
  </tr>
  )
}

export default memo(ExcelRow);
