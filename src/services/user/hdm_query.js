import axios from "axios";
import { baseUrl, option } from "../baseUrl";

export async function hdm_generate(checkId) {
  try {
    const  data = await axios.post(
      baseUrl + `History/PrintCopy?saleDetailId=${checkId}`, {} , option()
    );
    return data?.data
  }catch(err) {
    return err.response.status
  }
};

export async function sendMail(body) {
  try {
    const  data = await axios.post(baseUrl + `Store/SendReport`, body , option());
    return data
  }catch(err) {
    return err.response.status
  }
};
