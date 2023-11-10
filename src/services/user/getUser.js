import axios from "axios"
import { baseUrl, option } from "../baseUrl";

export default async function getUser() {
    try{
        const  data = await axios.get(baseUrl + "User/GetUser", option());
        return data.data
    }catch(err){
        return err.response.status
    }
};

export  async function getLogo() {
    try{
        const  data = await axios.get(baseUrl + "Logo/GetLogo", option());
        return data.data
    }catch(err){
        return err.response.status
    }
};

export  async function updateLogo(body) {
    try{
        const  data = await axios.put(baseUrl + "Logo/UpdateLogo", body, option());
        return data.data
    }catch(err){
        return err.response.status
    }
};

