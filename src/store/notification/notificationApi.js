import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../services/baseUrl";
import { setNotifications } from "./notificationSlice";

 export const notificationApi = createApi({
  reducerPath:"notificationApi",

  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token"); 
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getNotificationHistory: builder.query({
      query: (credentials) => ({
        url:"/User/GetNotificationHistory",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (credentials, { dispatch, queryFulfilled }) => {
        try {
          const { data, meta } = await queryFulfilled;
          const count = meta.response.headers.get("count")

          console.log(data,"DATATATATATA")
          
          dispatch(setNotifications({list:data[0]?.list, count:count}))
        } catch(error) {
        }
      },
    }),
  })
});

export const { useLazyGetNotificationHistoryQuery} = notificationApi