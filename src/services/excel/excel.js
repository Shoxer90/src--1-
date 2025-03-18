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

   export const sendEmarkCSV = async(prodId, file) => {
      const option = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          contentType: 'multipart/form-data', 
        },
      }

      try{
      const data = await axios.post(baseUrl + `Products/AddEmarks?productId=${prodId}`,file, option)
      console.log(data,"CSV response")
      }catch(err){
        console.log(err,"CSV response")

      }
   }
