import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../services/baseUrl";
import { setNotifications, setReserveIds } from "./notificationSlice";

 export const notificationApi = createApi({
  reducerPath:"notificationApi",

  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token"); 
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        headers.set( "accept_language", localStorage.getItem("i18nextLng") ||localStorage.getItem("lang") );
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
          const count = meta.response.headers.get("count");
          const ids = []
          data.map((item) => {
            item?.list.map((item) => {
              return ids.push(item?.id)
            })
          })
          dispatch(setReserveIds(ids))

          dispatch(setNotifications({list:data, count:count}))
        } catch(error) {
        }
      },
    }),
    removeNotificationList: builder.mutation({
      query: (credentials) => ({
        url:"/User/DeleteNotifications",
        method: "DELETE",
        body: credentials,
      }),
      // onQueryStarted: async (credentials, { dispatch, queryFulfilled }) => {
      //   try {
      //     const { data, meta } = await queryFulfilled;
      //     dispatch(setNotifications({list:data[0]?.list, count:count}))
      //   } catch(error) {
      //   }
      // },
    }),
  // }),

  readNotification: builder.mutation({
      query: (credentials) => ({
        url:"/User/ReadNotifications",
        method: "POST",
        body: credentials,
      }),
      // onQueryStarted: async (credentials, { dispatch, queryFulfilled }) => {
      //   try {
      //     const { data, meta } = await queryFulfilled;
      //   } catch(error) {
      //   }
      // },
    })
  })
});

export const { useLazyGetNotificationHistoryQuery, useRemoveNotificationListMutation, useReadNotificationMutation} = notificationApi