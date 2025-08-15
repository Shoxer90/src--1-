import axios from 'axios';
import { baseUrl } from './baseUrl';

const api = axios.create({
  baseURL: baseUrl,
});

// 👉 Добавляем accessToken в каждый запрос
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});


let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(p => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const rcode = localStorage.getItem("rcode");

        const res = await axios.post(baseUrl+'/GetNewCode', null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            accept_language: localStorage.getItem("i18nextLng") ||localStorage.getItem("lang") ,
            rcode: rcode || ""
          },
        });

        const newToken = res.data?.token;
        localStorage.setItem("token", newToken);
        localStorage.setItem("rcode", data?.data?.rcode) 

        processQueue(null, newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("token");
        localStorage.removeItem("rcode");
        window.location.href = "/login"; // редиректим на логин
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
