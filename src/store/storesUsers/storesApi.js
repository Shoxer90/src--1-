import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { setAuthToken } from "../tokenSlice";
import { setStores } from "./storesUsersSlice";
import { setPagination } from "../pagination/paginationSlice";

 export const storesApi = createApi({
  reducerPath:"storesApi",

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
    storesByPage: builder.query({
      query: (credentials) => ({
        url:"/GetStoresByPage",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (credentials, { dispatch, queryFulfilled }) => {
        try {
          const { data, meta } = await queryFulfilled;
          const count = meta.response.headers.get("count")
          dispatch(setPagination({length:count, perPage: credentials?.count}))
          dispatch(setStores(data));
        } catch(error) {
          dispatch(setAuthToken(null));
        }
      },
    }),
  })
});
// get=> query
// post=> builder
export const {useStoresByPageQuery, useLazyStoresByPageQuery} = storesApi