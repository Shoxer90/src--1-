import { baseUrl, option } from "../baseUrl";
import axios from "axios";

export async function loginAPI (username, password){
  const option = {
    headers: {},
  };

  const body = { username: username, password: password, isLastVersion:true };
    try {
      const res = await axios.post(baseUrl + "Login/Login", body, option);
        localStorage.setItem("role", res?.data?.role);
        localStorage.setItem("token", res.headers["token"]);
        return res;
    } catch(err) {
      return err?.response?.status;
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
    return err
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
  
  const newUser = {
    "legalName":  user?.legalName,
    "legalAddress":  user?.legalAddress,
    "tin":  user?.tin,
    "tradeName":  user?.tradeName,
    "country":  user?.country,
    "city":  user?.city,
    "businessAddress":  user?.businessAddress,
    "firstName":  user?.firstName,
    "lastName":  user?.lastName,
    "email":  user?.email,
    "phoneNumber": `0${user?.phoneNumber}`,
    "zipCode":  user?.zipCode,
    "userName": user?.tin,
    "password":  user?.password,
    
    "businessCity": user?.businessCity ,
    "businessZipCode": user?.businessZipCode ,
    "directiorAddress": user?.directiorAddress ,
    "directiorCity": user?.directiorCity,
    "directorZipCode": user?.directorZipCode ,

  }
  try{
    const  data = await axios.post(baseUrl + `Registration/RegistrationNew`,newUser, option);
    return data.status
  }catch(err){
    return err.request.status
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
    const  data = await axios.get(baseUrl + `Login/GetNews?language=${lang}`, {});
    return data.data
  }catch(err){
    return err
  }
}