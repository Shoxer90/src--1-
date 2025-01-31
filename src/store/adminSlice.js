
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: 1,
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    role: 2
}

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAuthAdmin: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { setAuthAdmin } = adminSlice.actions;

export default adminSlice.reducer;