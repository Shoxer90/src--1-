import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

import { adminApi } from "./adminApi";
import authReducer from "./tokenSlice";

export default configureStore({
  reducer: {
    user: userReducer,        
    auth: authReducer,
    [adminApi.reducerPath]:adminApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(adminApi.middleware),
})