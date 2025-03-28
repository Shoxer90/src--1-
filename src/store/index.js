import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import authReducer from "./tokenSlice";
import paginationReducer from "./pagination/paginationSlice";
import titleReducer from "./adminTitle/titleSlice";
import customerReducer from "./customer/customeSlice";
import collumnReducer from "./filter/collumnFilterSlice";
import messageReducer from "./messages/messageSlice";
import navigationReducer from "./navigation/NavigationSlice";
import startEndDateReducer from "./filter/startEndDateSlice";
import payForEhdmReducer from "./storex/openPaySlice";
import userNewReducer from "./storex/user/userNewSlice";

import { storesApi } from "./storesUsers/storesApi";
import { adminApi } from "./admin/adminApi";
import { customerApi } from "./customer/customerApi";
import { userApi } from "./storex/user/userApi";

export default configureStore({
  reducer: {
    user: userReducer,        
    userNew:userNewReducer,
    auth: authReducer,
    pagination: paginationReducer,
    title: titleReducer,
    customer: customerReducer,
    collumnFilter: collumnReducer,
    message: messageReducer,
    navigation: navigationReducer,
    startEndDate: startEndDateReducer,
    payForEhdm: payForEhdmReducer,
    [adminApi.reducerPath]:adminApi.reducer,
    [storesApi.reducerPath]:storesApi.reducer,
    [customerApi.reducerPath]:customerApi.reducer,
    [userApi.reducerPath]:userApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
     getDefaultMiddleware()
      .concat(adminApi.middleware)
      .concat(storesApi.middleware)
      .concat(customerApi.middleware)
      .concat(userApi.middleware)
})