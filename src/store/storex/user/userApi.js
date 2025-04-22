import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUserNew } from "./userNewSlice";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://storextest.payx.am/api/User",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token"); 
      if (token) {
        headers.set("Authorization", `Bearer ${token}`); 
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    userNew: builder.query({
      query:(credentials) => ({
        url:`/GetUser`,
        method: "GET",
        body: credentials 
      }),
      onQueryStarted: async (credentials, { dispatch, queryFulfilled }) => {
        try {
          const { data, meta } = await queryFulfilled;
          dispatch(setUserNew(data?.data))
        } catch(error) {
          console.log(error,"error from customerApi")
        }
      },
    }),

    
  })
});

export const {
  useLazyUserNewQuery,
  useUserNewQuery
} = userApi;
