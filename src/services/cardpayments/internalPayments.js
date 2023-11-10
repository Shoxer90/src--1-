import axios from "axios";
import { baseUrl, option } from "../baseUrl";

export const payAndSubscribe = async(content) => {
  try{
    const data = await axios.post(baseUrl + `InternalPayments/Payment`, content, option)
    return data
  }catch(err){
    return err.response.status
  }
};
  
  
export const changeActiveStatus = async(id) => {
  const option1 = {
    headers: {
      Authorization:  `Bearer ${localStorage.getItem("token")}`,
    },
  };
  try{
    const data = await axios.put(baseUrl + `InternalPayments/SetActiveCard?CardId=${id}`, {}, option1)
    return data

  }catch(err){
    return err.response.status
  }
};
  
export const removeBankCard = async(id) => {
  try{
    const data = await axios.put(baseUrl + `InternalPayments/DeleteCard?CardId=${id}`, option)
    return data

  }catch(err){
    return err.response.status
  }
};

// export async function getSaleProducts(page, pagination) {
//   const response = {
//     count: "",
//     data: ""
//   }
//   try{
//     const  data = await axios.post(baseUrl + `History/${page}`, pagination, option());
//     response.count = data.headers.count
//     response.data = data.data
//     return response
//   }catch(err){
//     return err
//   }
// };
export const getServiceHistoryAndPayAmount = async() => {
  const option = {
    headers: {
      Authorization:  `Bearer ${localStorage.getItem("token")}`,
    },
  };
  try{
    const data = await axios.post(baseUrl + `InternalPayments/GetServicesTypes`, {}, option)
    return data?.data
  }catch(err){
    return err.response.status
  }
};
  
export const bindNewCard = async() => {
  const option = {
    headers: {
      Authorization:  `Bearer ${localStorage.getItem("token")}`,
    },
  };
  try{
    const data = await axios.post(baseUrl + `InternalPayments/AttachCard`, {isBinding: true}, option)
    return data?.data
  }catch(err){
    return err.response.status
  }
};
  