import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { setAuthToken } from "../tokenSlice";
import { setAuthAdmin } from "./adminSlice";

 export const adminApi = createApi({
  reducerPath:"adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://storextest.payx.am/api/Admin",

   prepareHeaders: (headers) => {
      const token = localStorage.getItem("authAdmin"); // Get token from localStorage
      if (token) {
        headers.set("Authorization", `Bearer ${token}`); // Set token in headers
      }
      return headers;
    },
  }),

 
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url:"/LoginAdmin",
        method: "POST",
        body: credentials 
      }),
      // for prepare token to header
      onQueryStarted: async (credentials, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("authAdmin", data.token)
          dispatch(setAuthToken(data.token));
        } catch(error) {
          dispatch(setAuthToken(null));
        }
      },
      // 
    }),
    getAdminUser: builder.query({
      query: () => ({
        url:"/GetAdminUser",
        method: "GET",
      }),
      onQueryStarted: async (credentials, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuthAdmin(data));
        } catch(error) {
          dispatch(setAuthToken(null));
        }
      },
    }),
  })
});
// get=> query
// post=> builder
export const {useLoginMutation, useGetAdminUserQuery} = adminApi