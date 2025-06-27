import axios from "axios"
import { baseUrl, option } from "../baseUrl";

export  async function removeDeviceToken(token) {
    try{
        const  data = await axios.get(baseUrl + `User/RemoveDeviceToken?deviceToken=${token}`, option());
    }catch(err){
    }
};

export  async function sendDeviceToken(token) {
    try{
        const  data = await axios.get(baseUrl + `User/AddDeviceToken?deviceToken=${token}`, option());
    }catch(err){
    }
};

export  async function getNotificationHistoryPush(body) {
    try{
        const  data = await axios.post(baseUrl + `User/GetNotificationHistory`,body, option());
        return data
    }catch(err){
        return err
    }
};


export  async function readNotificationsPush(id) {
    try{
        const  data = await axios.post(baseUrl + `User/ReadNotifications`,[id], option());
        return data
    }catch(err){
        return err
    }
};