import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import authReducer from "./tokenSlice";
import paginationReducer from "./pagination/paginationSlice";
import titleReducer from "./adminTitle/titleSlice";
import customerReducer from "./customer/customeSlice";
import collumnReducer from "./filter/collumnFilterSlice";
import messageReducer from "./messages/messageSlice";
import navigationReducer from "./navigation/NavigationSlice";

import { storesApi } from "./storesUsers/storesApi";
import { adminApi } from "./admin/adminApi";
import { customerApi } from "./customer/customerApi";

export default configureStore({
  reducer: {
    user: userReducer,        
    auth: authReducer,
    pagination: paginationReducer,
    title: titleReducer,
    customer: customerReducer,
    collumnFilter: collumnReducer,
    message: messageReducer,
    navigation: navigationReducer,
    [adminApi.reducerPath]:adminApi.reducer,
    [storesApi.reducerPath]:storesApi.reducer,
    [customerApi.reducerPath]:customerApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
     getDefaultMiddleware()
      .concat(adminApi.middleware)
      .concat(storesApi.middleware)
      .concat(customerApi.middleware)
})