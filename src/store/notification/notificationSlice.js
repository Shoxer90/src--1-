
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  count: 0
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload?.list;
      state.count = action.payload?.count;
    },
    addNotification: (state, action) => {
      state.notifications?.push(action.payload);
      // state.notifications?.unshift(action.payload);
    },
    setChangeNotification:(state, action) =>{
      state = state.map((item) => {
        if(item?.id === action?.payload) {
          return {
            ...item,
            status: true
          }
        }
      })
    }
  },
});

export const { setNotifications, addNotification,setChangeNotification } = notificationSlice.actions;

export default notificationSlice.reducer;