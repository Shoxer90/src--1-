import axios from "axios";
import { baseUrl, option } from "../baseUrl";


export const getProducts = () => axios.get(baseUrl + "Products/GetProducts", option)

export const getNotAvProducs = (option) => axios.get(baseUrl + "Products/GetNotAvailableProducts", option)

export const getAvProducts = (option) => axios.get(baseUrl + "Products/GetAvailableProducts", option)

export const getAdg = async(type) => {
  const option = {
    headers: {
      Authorization: localStorage.getItem("token"),
    }
  }
  try{
    const data = await axios.get(baseUrl + `Adg/GetAdgByCode?q=${type}`, option)
    return data.data
  }catch(err) {
    return err
  }
}

export const getAllAdgCode = async() => {
  const option = {
    headers: {
      Authorization: localStorage.getItem("token"),
    }
  }
  try{
    const data = await axios.get(baseUrl + `Adg/GetAllAdgs`, option)
    return data.data
  }catch(err) {
    return err
  }
}



// PRODUCT QUERY

export const productQuery = async(type,page) =>{
  const option = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
    params: {
      page: page,
      count: 20,
    },
  };
  try{
    const query = await axios.get(baseUrl + `Products/${type}`, option);
    return query
  }catch(err) {
    return err.response.status
  }
};
// Search Products by date and barcode
export const byBarCode = async(barcode) =>{
  const option = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
  try{
    const query = await axios.get(baseUrl + `Products/SearchByBarCode?q=${barcode}`, option);
    return query.data
  }catch(err) {
    return err.response.status
  }
};
//check isAvailable basket products
export const cheackProductCount = async(body) => {
  try{
    const data = await axios.put( baseUrl + "Products/CheackProductCount", body, option());
    return data?.data
  }catch(err) {
    return err.response?.status
  }
}

export const searchByName = async(input) =>{
  const option = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
  try{
    const query = await axios.get(baseUrl + `Products/SearchByProductName?q=${input}`, option);
    return query.data
  }catch(err) {
    return err.response.status
  }
};

// 

export const updateIsFavorite = async(id,status) => {
  const option = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
  try{
    const data =  await axios.post(baseUrl + `Products/AddFavoriteProduct?product=${id}&status=${status}`, {}, option)
    return data.data
  }catch(err){
    return err.message
  }
};

export const createProduct = async(product) => {
  const option = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
  const body={
    "id": 0,
    "type": product?.type,
    "name": product?.name,
    "brand": product?.brand,
    "measure": product?.measure,
    "photo": product?.photo || "",
    "barCode": product?.barCode,
    "remainder": +(product?.remainder),
    "purchasePrice": +(product?.purchasePrice),
    "price": +(product?.price),
    "discount": 0,
    "lastUpdate": new Date().toISOString(),
    "dep": +product?.dep,
    "isFavorite": false,
    "coment": "",
    "category": 0,
    "description": "",
    "keyWords": [
      {
        "id": 0,
        "keyWord": ""
      }
    ]
  }
  try{
    const data =  await axios.post(baseUrl + `Products/addProduct`, body, option)
    return data
  }catch(err){
    return err?.response?.status
  }
};

export const createProductList = async(body) => {
  const option = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  }

  try{
    const data =  await axios.post(baseUrl + `Products/AddProductList`, body, option)
    return data.status
  }catch(err){
    return err?.response?.status
  }
};

 export const updateProduct = async(product) => {
  const body={
    "id": product?.id,
    "type": product?.type,
    "name": product?.name,
    "brand": product?.brand,
    "measure": product?.measure,
    "photo": product?.photo,
    "barCode": product?.barCode,
    "remainder": +(product?.remainder),
    "purchasePrice": +(product?.purchasePrice),
    "price": +(product?.price),
    "discountType": +(product?.discountType),
    "discount": +(product?.discount),
    "lastUpdate": new Date().toISOString(),
    "dep": product?.dep,
    "isFavorite": product?.isFavorite,
    "coment": product?.coment,
    "category": product.category,
    "description": product?.description,
    "keyWords": [
      {
        "id": 0,
        "keyWord": ""
      }
    ]
  }
  const option = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
  try{
    const data =  await axios.put(baseUrl + `Products/UpdateProduct`, body, option)
    return data?.status
  }catch(err){
    return err?.response?.status
  }
 };

 export const removeProduct = async(id) => {
  const option = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  }
    try{
      const data =  await axios.delete(baseUrl + `Products/DeleteProduct?id=${id}`, option)
      return data
    }catch(err){
      return err.message
    }
}

export const uniqueBarCode = async(code) => {
  const option = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  }
  try{
    const data = await axios.get(baseUrl + `Products/BarCodeUniq?BarCode=${code}`, option)
    return data?.data?.isUniq
  }catch(err){
    return err
  }
};


export const addFavProds = () => axios.post(baseUrl + "Products/AddFavoriteProduct", {}, option)

export const addNewProds = (option, body) => axios.post(baseUrl + "Products/AddProduct", body, option)

export const editProds = (option, body) => axios.put(baseUrl + "Products/UpdateProduct", body, option)

export const getFavProds = (option) => axios.get(baseUrl + "Products/GetFavoriteProducts", option)

export const SearchByProductName = (option) => axios.get(baseUrl + "Products/SearchByProductName", option)

export const SearchByBarCode = (option) => axios.get(baseUrl + "Products/SearchByBarCode", option)

export const checkStatus = (option) => axios.get(baseUrl + "History/CheckStatus", option)

export const smsLinkReq = (body,option) => axios.post(baseUrl + "Products/GetSMSLink",body, option)

export const productChangesHistory = async() => {
    const option = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        params: {},
    };
    try{
        const query = await axios.get(baseUrl + "Products/GetProductChangesHistory", option)
        return query.data
    }
    catch(err){
        return err.response.status
    }
}

export const getProductsSaleByDays = async(date) => {
    const option = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        params: date
    };
    try{
      const query = await axios.get(baseUrl + "Products/GetProductsSaleByDays", option)
      return query.data
    }catch(err){
        return err
    }
}

