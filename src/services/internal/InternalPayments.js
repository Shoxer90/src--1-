import axios from "axios";
import { baseUrl, option } from "../baseUrl";

export const getPaymentCardServices = async() => {
  const getWithHistory = true
 try{
  const data = await axios.get( baseUrl + `InternalPayments/GetBillingPage?GetHistory=${getWithHistory}`, option());
  return data?.data
 }catch(err){
  return err
 }
};

export const postNewCreditCard = async() => {
  try{
    const data = await axios.post( baseUrl + `InternalPayments/AddNewCard?Web=true`, {}, option());
    return data?.data?.formUrl

  }catch(err){
    return err
  }
};

export const payForServiceWithAttachedCard = async(body) => {
  
  try{
    const data = await axios.post( baseUrl + `InternalPayments/PayWithAttachCard`, body, option());
    return data

  }catch(err){
    return err?.response?.status
  }
};

export const prepaymentPay = async(body) => {
  
  try{
    const data = await axios.post( baseUrl + `InternalPayments/PrePaymentPay`, body, option());
    return data?.data

  }catch(err){
    return err?.response?.status
  }
};


export const setActiveCard = async(id) => {
  try{
    const data = await axios.post( baseUrl + `InternalPayments/SetDefaultCard?CardId=${id}`, {}, option());
    return data?.data

  }catch(err){
    return err
  }
};

 export const payForServiceWithNewCard = async(body) => {
  try{
    const data = await axios.post( baseUrl + `InternalPayments/Pay`, body, option());
    return data?.data

  }catch(err){
    return err
  }
};

export const autoPaymentSwitch = async(bool) => {
  try {
    const data = await axios.put( baseUrl + `InternalPayments/SetBinding?BindingStatus=${bool}`, {}, option());
    return data
  }catch(err) {
    return err
  }
};


export const changeCreditCardName = async(str) => {
  try {
    const data = await axios.put( baseUrl + `InternalPayments/UpdateCardName`, str, option());
    return data
  }catch(err) {
    return err
  }
};

