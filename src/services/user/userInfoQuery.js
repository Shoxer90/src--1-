import axios from "axios";
import { baseUrl, option } from "../baseUrl";

// User Queries
export  async function changeEHDM(status) {
  try{
    const  data = await axios.post(baseUrl + `User/SetEhdmStatus?Status=${status}`, status, option());
    return data.config.data
  }catch(err){
    return err
  }
};
// new number
export async function eddUserNumber(newNumber) {
  try{
    const  data = await axios.post(baseUrl + `Phone/AddPhone`, newNumber);
    return data.config.data
  }catch(err){
    return err
  }
};

export async function removeUserNumber(id) {
  try{
    const  data = await axios.delete(baseUrl + `Phone/DeletePhone?id=${id}`, option());
    return data
  }catch(err){
    return err
  }
};

// REMOVE ADRESS
export async function removeUserAddress(id) {
  try{
    const  data = await axios.delete(baseUrl + `Address/DeleteAddress?id=${id}`, option());
    return data
  }catch(err){
    return err
  }
};

export async function getCashiers() {
  try{
    const  data = await axios.get(baseUrl + `Store/GetCashiers`, option());
    return data
  }catch(err){
    return err
  }
};

export async function setCashierEhdmStatus(id, bool) {
  try{
    const  data = await axios.post(baseUrl + `Store/SetCashierEhdmStatus?cashierId=${id}&status=${bool}`,{}, option());
    return data
  }catch(err){
    return err
  }
};
export async function setCashierReverseStatus(id,bool) {
  try{
    const  data = await axios.post(baseUrl + `Store/SetCashierReverceStatus?cashierId=${id}&status=${bool}`,{} , option());
    return data
  }catch(err){
    return err
  }
};



export async function operationCashiers(id, operation) {
  // 0 block
  // 1 unblock
  // 2 delete
  try{
    const  data = await axios.delete(baseUrl + `Store/RemoveCashiers?cashierId=${id}&ActionType=${operation}`, option());
    return data
  }catch(err){
    return err
  }
};
export async function updateCashiersData(body) {
  try{
    const  data = await axios.put(baseUrl + `Store/UpdateCashiers`, body, option());
    return data
  }catch(err){
    return err
  }
};


// REMOVE MAIL
export async function removeUserMail(id) {
  try{
    const  data = await axios.delete(baseUrl + `Email/DeleteEmail?id=${id}`, option());
    return data
  }catch(err){
    return err
  }
}

// ADD PHONE
export default async function addUserNumber(inputs) {
  try{
    const  data = await axios.post(baseUrl + `Phone/AddPhone`, inputs, option());
    return data
  }catch(err){
    return err
  }
}

// ADD ADDRESS
export async function addUserAdress(inputs) {
  try{
    const  data = await axios.post(baseUrl + `Address/AddAddress`, inputs, option());
    return data
  }catch(err){
    return err
  }
}

// ADD EMAIL
export async function addUserEmail(inputs) {
  try{
    const  data = await axios.post(baseUrl + `Email/AddEmail`, inputs, option());
    return data
  }catch(err){
    return err
  }
};

// Add new password
export async function updateUserPassword(inputs) {
  try{
    const  data = await axios.post(baseUrl + `Login/UpdatePassword`, inputs, option());
    return data.data.message
  }catch(err){
    return err
  }
};

