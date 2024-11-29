import axios from "axios";
import { baseUrl, option } from "../baseUrl";

// get not filtered data Paid,Unpaid,Canceled by page
export async function getSaleProducts(page, pagination) {
  const response = {
    count: "",
    data: ""
  }
  try{
    const  data = await axios.post(baseUrl + `History/${page}`, pagination, option());
    response.count = data.headers.count
    response.data = data.data
    return response
  }catch(err){
    return err
  }
};
// get filtered data
export async function filterByDate(date, status) {
  const response = {
    data: "",
    count: 0
  }
  try {
    if(status === "Paid"){
      const  data = await axios.get(
        baseUrl + `History/GetSaleProductsByDate?startDate=${date.startDate}&endDate=${date.endDate}`,option())
      response.data = data?.data
      response.count = data?.headers.count
      return response
    }else if (status === "Unpaid") {
      const  data = await axios.get(
        baseUrl + `History/GetNotPaidSaleProductsByDate?startDate=${date.startDate}&endDate=${date.endDate}`, option())
      response.data = data?.data
      response.count = data?.headers.count
      return response
    }else if( status === "Canceled") {
      const  data = await axios.get(
        baseUrl + `History/GetReveredHistoryByDate?startDate=${date.startDate}&endDate=${date.endDate}`, option())
      response.data = data?.data
      response.count = data?.headers.count
      return response
    }
  }catch(err) {
    return err?.message
  }
 }
// 

export async function reverseProductNew(body) {
  try{
    const  data = await axios.post(baseUrl + `Sale/ReturnReciept`,body, option());
    return data
  }catch(err){
    return err?.response?.status
  }
};


export async function sendSmsPDF(plchld, body) {
  try{
    if(plchld === "phone") {
      const  data = await axios.post(baseUrl + `History/SendSms`, body, option());
      return data

    }else if(plchld === "email") {
      const  data = await axios.post(baseUrl + `History/SendEmail`, body, option());
      return data
    }
  }catch(err){
    return err
  }
};


export async function generateToExcel(queryDate){

  const bb = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    responseType: "blob"
  }
  try {
    const  data = await axios.get(baseUrl + `History/GenerateExcel?startDate=${queryDate?.startDate}&endDate=${queryDate?.endDate}&products=${queryDate?.products}`, bb);
    return data?.data
  }catch(err) {
    return err
  }
};

export async function editOrReversePrepaymentReceipt(body) {
  try{
    const  data = await axios.post(baseUrl + `PrePayment/EditPrePaymentProducts`, body, option());
    return data
  }catch(err){
    return  err?.response?.status
  }
};

export async function closePrepaymentReceiptWithSelling(body) {
  try{
    const  data = await axios.post(baseUrl + `PrePayment/SalePrepayment`, body, option());
    return data
  }catch(err){
    return  err?.response?.status
  }
};


// New lite history queries, get whole history and get history by Id

export async function getHistoryById(id) {
  try {
    const data = await axios.get(baseUrl + `History/GetHistoryByRecieptId?code=${id}`,option())
    return data?.data
  }catch(err) {
    return err?.response?.status
  }

}

