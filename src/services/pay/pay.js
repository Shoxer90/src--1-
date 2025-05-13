import axios from "axios";
import { baseUrl, option } from "../baseUrl";

export const payRequest = async(content,type) => {
  const option = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
  const body = {
    ...content,
    "saleType": type,
  }
  try{
    const data = await axios.put(baseUrl + `Products/SaleProduct`, body, option)
    return data.data
  }catch(err){
    return err.response.status
  }
};

export const payRequestQR = async(content) => {
  const option = {
    headers: {
      Authorization: localStorage.getItem("token"), 
    },
  };
  const body = {
    ...content,
  }
  try{
    const data = await axios.post(baseUrl + `Sale/GetSaleQR`, body, option)
    return data
  }catch(err){
    return err.response.status
  }
};

export const transferQuery = async(id) => {
  const option = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
  try{
    const data = await axios.get(baseUrl + `History/CheckStatus?transferId=${id}`, option)
    return data
  }catch(err){
    return err.response.status
  }
};

export const sendSmsForPay = async(body) => {
  const option = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
  try{
    // const data = await axios.post(baseUrl + "Products/GetSMSLink",body, option)
    const data = await axios.post(baseUrl + "Sale/SendBasketList",body, option)
    return data
  }catch(err){
    // return err
    return err?.response?.status
  }
};

export const copySmsLink = async(content) => {
  const option = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
  const body = {
    ...content,
  }
  try{
    const data = await axios.post(baseUrl + `Products/CopySmsLink`, body, option)
    return data
  }catch(err){
    return err.response.status
  }
};

export const basketListCreator = async(id) => {

  try{
    const data = await axios.get(baseUrl + `Sale/GetBasketListV2?SaleId=${id}`, option())
    return data
  }catch(err){
    return err
  }
}

export const basketListUrl = async(body) => {
  try{
    const data = await axios.post(baseUrl + `Sale/CopyBasketListV2`, body, option())
    return data
  }catch(err){
    return err?.response?.status
  }
};

export const completePaymentForOrder = async(saleId, paymentType) => {
  try {
    const data = await axios.post(baseUrl + `Sale/CompletePaymentByType?SaleId=${saleId}&paymentType=${paymentType}`, {}, option())
    return data?.data
  }catch(err){
    return err?.response?.status
  }
}


export const saleProductFromBasket = async(content) => {
  const option = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
  try{
    const data = await axios.put(baseUrl + `Sale/Sale`, content, option, { retry: 0 })
    console.log(data,"DATA")
    return data.data
  }catch(err){
    console.log(err?.code,"err")
    if(err?.code === "ERR_NETWORK"){
      return "ERR_NETWORK"
    }else{
      return err.response.status
    }
  }
}

export const leftPrepaymentForProducts = async(content) => {
  const option = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
  try{
    const data = await axios.post(baseUrl + `PrePayment/SalePrepayment`, content, option)
    return data.data
  }catch(err){
    return err.response.status
  }
}
