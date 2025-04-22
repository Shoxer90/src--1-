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

export  async function getNewNotifications() {
    try{
        const  data = await axios.post(baseUrl + "User/GetConfirmationText",{}, option());
        return data.data
    }catch(err){
        return err.response.status
    }
};

export  async function cleanNotifications(bool) {

    try{
        const  data = await axios.post(baseUrl + `User/SaveConfirmation?Status=${bool}`, {}, option());
        return data.data
        // return 
    }catch(err){
        return err.response.status
    }
};

export  async function SignNewContract() {
    try{
        const  data = await axios.get(baseUrl + "User/SignNewContract", option());
        return data.data
    }catch(err){
        return err.response
    }
};


