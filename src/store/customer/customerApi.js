import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCustomerHistory, setCustomerPayments } from "./customeSlice";
import { setPagination } from "../pagination/paginationSlice";
import { setMessage } from "../messages/messageSlice";

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://storextest.payx.am/api/Admin",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authAdmin"); 
      if (token) {
        headers.set("Authorization", `Bearer ${token}`); 
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    saleDetails: builder.query({
      query:(credentials) => ({
        // url:`/GetSaleDetailsByStore?storeId=${credentials?.storeId}&historyType=${credentials?.historyType}`,
        url:`/GetSaleDetailsByStore?storeId=${1}&historyType=${credentials?.historyType}`,
        method: "POST",
        body: credentials 
      }),
      onQueryStarted: async (credentials, { dispatch, queryFulfilled }) => {
        try {
          const { data, meta } = await queryFulfilled;
          const count = meta.response.headers.get("count")
          dispatch(setPagination({length:count, perPage: credentials?.count}))
          dispatch(setCustomerHistory(data));
        } catch(error) {
          console.log(error,"error from customerApi")
        }
      },
    }),

    paymentsDetails: builder.query({
      query: ({ storeId, sended, ...bodyData }) => ({
        url:`/GetPaymentsByPage?storeId=${storeId}&sended=${sended}`,
        // url:`/GetPaymentsByPage?storeId=1&sended=${credentials.sended}`,
        method: "POST",
        body: bodyData 
      }),
      onQueryStarted: async (credentials, { dispatch, queryFulfilled }) => {
        try {
          const { data, meta } = await queryFulfilled;
          const count = meta.response.headers.get("count")
          dispatch(setPagination({length:count, perPage: credentials?.count}))
          dispatch(setCustomerPayments(data));
        } catch(error) {
          console.log(error,"error from customerApi")
        }
      },
    }),

    blockCustomer: builder.mutation({
      query:(credentials) => ({
        url:`/BlockDirector?status=${credentials?.status}&directorId=${credentials?.directorId}`,
        method: "PUT",
        body: credentials 
      }),
      onQueryStarted: async (credentials, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setMessage({
            text: data?.message,
            type: "success"
          }))
        } catch(error) {
          console.log(error,"error in block")
        }
      },
    }),
    updateCustomer: builder.mutation({
      query:(credentials) => ({
        url:`/UpdateStore`,
        method: "PUT",
        body: credentials 
      }),
      onQueryStarted: async (credentials, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setMessage({
            text: data?.message,
            type: "success"
          }))
        } catch(error) {
          console.log(error,"error in update user")
        }
      },
    })
  })
});

export const {
  useSaleDetailsQuery, 
  usePaymentsDetailsQuery,
  useLazySaleDetailsQuery , 
  useBlockCustomerMutation,
  useUpdateCustomerMutation,

} = customerApi
