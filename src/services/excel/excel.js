import axios from "axios"
import { baseUrl } from "../baseUrl"

export const getExcelEmptyForm = async() => {
    const option = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
        responseType: "blob",
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
    try{
      const data = await axios.get(baseUrl + `Products/GetProductsAddExcel`, option)
      return data.data
    }catch(err) {
      return err
    }
  };

  
export const putExcelFilledForm = async(body) => {
    const option = {
        credentials: 'include',
        headers: {
            Authorization: localStorage.getItem("token"),
            'Content-Type': 'application/json',
            'accept':'application/json'
        },
    };  
    try{
      const data =  await axios.put(baseUrl + `Products/AddProductByExcel`,body, option)
      return data
    }catch(err){
      return err?.response?.status
    }
  };