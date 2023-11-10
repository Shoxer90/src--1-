import dayjs from "dayjs";
import axios from "axios";
import jwtDecode from "jwt-decode";

const myUrl = "https://storex.payx.am/api/";

let authTokens = localStorage.getItem("token") ? localStorage.getItem("token") : "null";

const axiosInstance = axios.create({
    myUrl,
    headers: {Authorization: `Bearer ${authTokens}`}
});

axiosInstance.interceptors.request.use(async req => {
    if(!authTokens){
        authTokens =  localStorage.getItem("token")
        req.headers.Authorization = `Bearer ${authTokens}`
    }
    const user = jwtDecode(authTokens) 
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1
    if(!isExpired) return req
})

export default axiosInstance;