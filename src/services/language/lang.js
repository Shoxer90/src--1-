import axios from "axios";
import { baseUrl } from "../baseUrl";
import i18n from "../../i18next/i18n";

export const measureTranslate = async(unit) => {
    const option = {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    try{
      const data = await axios.get(baseUrl + `Products/GetMeasureByLang?lang=${unit}`, option)
      return data
    }catch(err){
      return err.response.status
    }
  };
  
  