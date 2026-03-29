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
    return data?.data
  }catch(error) {
    console.log(error, "error")
    
  }
};


export  const getInvoiceTableDataByName = async(name, isAc=false) => {
  try{
    const data = await axios.get(baseUrl + `Store/GetTaxServiceTypesByName?name=${name}&isAc=${isAc}`, option());
    return data?.data
  }catch(error) {
    return error    
  }
};

export const getDraftsByType = async(num, body) => {
  let body2={
  "page": body?.page,
  "count": body?.count,
  "isPayd": body?.isPayd || false,
  "searchString": body?.searchString,
  // "byDate": {
  //   "startDate": body?.byDate?.startDate,
  //   "endDate": body?.byDate?.endDate
  //   }
  }
  try {
    const data = await axios.post(baseUrl + `History/GetInvoicesByPage?invoiceType=${num}`, body2, option())
    return data
  }catch(err) {
    return err
  }
}

export const removeInvoice = async(id) => {
  try {
    const data = await axios.delete(baseUrl + `History/RemoveInvoice?id=${id}`, option())
    console.log(data,"remove data")
    return data
  }catch(err) {
    console.log(err,"remove err")
    return err
  }
}
