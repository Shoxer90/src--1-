import { baseUrl, option } from "../baseUrl";
import axios from "axios";

export async function loginAPI (username, password){
  const lang = localStorage.getItem("lang")
  const option = {
    headers: {
      accept_language: lang === "hy" || lang === "ru" || lang === "eng" ? lang : "hy"
    },
  };
  const body = { username: username, password: password, isLastVersion:true };
    try {
      const res = await axios.post(baseUrl + "Login/Login", body, option);
        localStorage.setItem("role", res?.data?.role);
        localStorage.setItem("token", res.headers["token"]);
        return res;
    } catch(err) {
      return err;
    }
  };

export default loginAPI;

export async function forgotPassword (mail){
  const option = {
    headers: {},
  };

  try {
    const res = await axios.post(baseUrl + "Login/ResetPassword", mail, option);
      return res;
  } catch(err) {
    return err?.response;
  }
};

export async function updateUserPassword (password, token){
  const option = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };
  
  try {
    const res = await axios.post(baseUrl + "Login/UpdatePassword", password, option);
      return res;
  } catch(err) {
    return err?.response?.status;
  }
};


export async function registrationNew(user) {

  try{
    const  data = await axios.post(baseUrl + `Registration/RegistrationNew`,user, option);
    return data.status
  }catch(err){
    return err
  }
};

export const completeEhdmRegistration = async(newUserData) => {
  try{
    const  data = await axios.post(baseUrl + `Registration/RegisterEhdmFromStoreX`,newUserData, option());
    return data
  }catch(err) {
    return err?.request
  }
};

export const payForEhdm = async(bool,paymentType ) => {
  try{
    const  data = await axios.get(baseUrl + `Registration/PayForEhdm?isWeb=true&attach=${bool}&paymentType=${paymentType}`, option());
    return data
  }catch(err){
    return err?.request?.status
  }
};

export const payForEhdmWithUsingCard = async(cardId) => {
  try{
    const  data = await axios.get(baseUrl + `Registration/PayForEhdmWithCard?isWeb=true&cardId=${cardId}`, option());
    return data
  }catch(err){
    return err?.request?.status
  }
};



export async function newConfirmCode(tkn) {
  const  token = {
    headers: {
      Authorization: tkn,
    }}
  try{
    const  data = await axios.post(baseUrl + `Registration/GenerateNewCode`,{}, token);
    return data.status
  }catch(err){
    return err.request.status
  }
};

export async function finishRegistration(tkn, code) {
  const  token = {
    headers: {
      Authorization: tkn,
    }}
  try{
    const  data = await axios.post(baseUrl + `Registration/FinishRegistration?code=${code}`,{}, token);
    return data.request.status
  }catch(err){
    return err.request.status
  }
}

export async function isUniqueNik(name) {
  try{
    const  data = await axios.post(baseUrl + `Registration/UsernameUniqueness?Username=${name}`, {});
    return data.data
  }catch(err){
    return err
  }
};

export async function createNewCashier(inputs) {
  const option = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  }
  try {
    const data = await axios.post(baseUrl + `Registration/RegisterCashier`,inputs, option)
    return data
  }catch(err) {
    return err
  }
};


export const getNews = async(lang) => {
  try{
    const data = await axios.get(baseUrl + `Login/GetNews?language=${lang}`, {});
    return data.data
  }catch(err){
    return console.log(err)
  }
}

export const getDataByTin = async(tin) => {
  try{
    const data = await axios.get(baseUrl + `Registration/GetDetailsByTin?tin=${tin}`, {});
    return data
  }catch(err){
    return err
  }
}