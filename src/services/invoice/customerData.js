import axios from "axios";
import { baseUrl, option } from "../baseUrl";

export const getCountries = async() => {
  try {
    const data = await axios.get(baseUrl + `Store/GetCountries`, option());
    return data?.data
  }catch(error) {
    console.log("countries", error);
  };
};

export const getRegions = async() => {
  try {
    const data = await axios.get(baseUrl + `Store/GetRegions`, option());
    return data?.data
  }catch(error) {
    console.log("countries", error);
  };
};


export const getComunities = async(id) => {
  try{
    const data = await axios.get(baseUrl + `Store/GetCommunitiesByRegion?id=${id}`, option());
    return data?.data
  }catch(error) {
    console.log(error, "error")
  }
}

export  const getResidence = async(id) => {
  try{
    const data = await axios.get(baseUrl + `Store/GetResidencesByRegion?id=${id}`, option());
    console.log(data,"Data")
    return data?.data
  }catch(error) {
    console.log(error, "error")
    
  }
}