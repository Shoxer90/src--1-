import axios from "axios";
import { baseUrl, option } from "../baseUrl";

export const getPaymentCardServices = async() => {
  const getWithHistory = false
 try{
  const data = await axios.get( baseUrl + `InternalPayments/GetBillingPage?GetHistory=${getWithHistory}`, option());
  return data?.data
 }catch(err){
  return err
 }
};

export const postNewCreditCard = async() => {
  try{
    const data = await axios.post( baseUrl + `InternalPayments/AddNewCard`, {}, option());
    return data?.data?.formUrl

  }catch(err){
    return err
  }
};

export const payForServiceWithAttachedCard = async(body) => {
  
  try{
    const data = await axios.post( baseUrl + `InternalPayments/PayWithAttachCard`, body, option());
    console.log(data,"data")
    return data?.data

  }catch(err){
    console.log(err,"err")
    return err?.response?.status
  }
};


export const setActiveCard = async(id) => {
  try{
    const data = await axios.post( baseUrl + `InternalPayments/SetDefaultCard?CardId=${id}`, {}, option());
    console.log(data,"data")
    return data?.data

  }catch(err){
    console.log(err,"err")
    return err
  }
};

 export const payForServiceWithNewCard = async(body) => {
  try{
    const data = await axios.post( baseUrl + `InternalPayments/Pay`, body, option());
    console.log(data,"data")
    return data?.data

  }catch(err){
    console.log(err,"err")
    return err
  }
};


export const autoPaymentSwitch = async(bool) => {
  try {
    const data = await axios.put( baseUrl + `InternalPayments/SetBinging?BindingStatus=${bool}`, {}, option());
    console.log(data,"about bool")
    return data
  }catch(err) {
    console.log(err,"err")
    return err
  }
};