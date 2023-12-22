import axios from "axios";
import { baseUrl, option } from "../baseUrl"

export const getPaymentCardServices = async() => {
    const getWithHistory = false
 try{
    const data = await axios.get( baseUrl + `InternalPayments/Payments?GetHistory=${getWithHistory}`, option());
    console.log(data,"DATA")
    return data?.data

 }catch(err){
    console.log(err,"Err")
    return err
 }
}