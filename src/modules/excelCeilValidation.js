import { getAdg, uniqueBarCode } from "../services/products/productsRequests"
import { allLanguageMeasures } from "./modules"

export const barcodeValidation = async(value) => {
     const valid = /^[a-zA-Z0-9_]+$/
     if(valid.test(value)){
       const uniq = await uniqueBarCode(value)
       return uniq
    }else{
      // return false
      return "notValid"
    }
  };
  
  export const priceValidation = (value) => {
     const valid = /^\d*\.?(?:\d{1,2})?$/
    if(valid.test(value)){
      return true
    }else{
      return false
    }
  }

  export const adgValidation = async(arg) => {
    let flag = 0
    const arr = await getAdg(arg)
    if(arr?.length){
        arr.forEach((item) => {
           if(item?.code === arg){
                return flag++
            } 
          })
          return Boolean(flag)      
    }
    return Boolean(flag)
  };

  export const measureValidation = async(arg) => {
  if(allLanguageMeasures.includes(arg)) {
    return true
    }else{
      return false
    }
  };

  export const nameLimitValidation = (value) => {
    if(value?.length <= 50) {
      return true
    }else{
      return false
    }
  };

  // export const getAdgWholeArr = async() => {
  //   await getAdg("").then((res) => {
  //     return res

  //   })
  // }
  // export const adgArray = await getAdg(" ")