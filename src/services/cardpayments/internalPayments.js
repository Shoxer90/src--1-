import axios from "axios";
import { baseUrl, option } from "../baseUrl";
  
export const removeBankCard = async(id) => {
  try{
    const data = await axios.delete(baseUrl + `InternalPayments/DeleteCard?CardId=${id}`, option())
    return data
  }catch(err){
    return err.response.status
  }
};

export const bindNewCard = async(body) => {
  const option = {
    headers: {
      Authorization:  `Bearer ${localStorage.getItem("token")}`,
    },
  };
  try{
    const data = await axios.post(baseUrl + `InternalPayments/Pay`, body, option)
    return data?.data
  }catch(err){
    return err.response.status
  }
};
