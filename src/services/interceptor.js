import axios from "axios";
import { baseUrl } from "./baseUrl";

export const getNewCode = async() => {
    const options =  {headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        accept_language: localStorage.getItem("i18nextLng") ||localStorage.getItem("lang") ,
        rcode: localStorage.getItem("rcode") || ""
    }}

    try {
        const data = await axios.post(baseUrl + `Login/GetNewCode`, {}, options);
        localStorage.setItem("rcode", data?.data?.rcode) 
        return localStorage.setItem("token",data?.data?.token)
    }catch(error) {
    }
}

export const mainFetch = async(func, args = []) => {
    try {
       const data = await func(...args);
        return data;
    }catch(error){
        if(error?.status === 401) {
            getNewCode()
        }
    }
}

// mainFetch(loginFunc, [name, password]);