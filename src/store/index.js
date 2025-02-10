import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import authReducer from "./tokenSlice";
import countReducer from "./contentCountSlice";

import { storesApi } from "./storesUsers/storesApi";
import { adminApi } from "./admin/adminApi";

export default configureStore({
  reducer: {
    user: userReducer,        
    auth: authReducer,
    count: countReducer,
    [adminApi.reducerPath]:adminApi.reducer,
    [storesApi.reducerPath]:storesApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
     getDefaultMiddleware()
      .concat(adminApi.middleware)
      .concat(storesApi.middleware),
})