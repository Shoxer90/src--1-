import axios from "axios"
import { baseUrl } from "../baseUrl"

export const getUserCards = async() => {
    const option = {
        headers: {
          Authorization:  `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json',
          'accept':'application/json'
        },
      };
    try{
        const data = await axios.get( baseUrl + "InternalPayments/GetUserCardsInfo",option)
        return data?.data
        
    }catch(err){
        return err.response.status
    }

}