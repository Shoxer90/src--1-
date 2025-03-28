import { createSlice } from "@reduxjs/toolkit";

const initialState = {}

const userNewSlice = createSlice({
  name:"userNew",
  initialState,
  reducers: {
    setUserNew:(state, action) => {
      state = action.payload
    }
  },
});

export const {setUserNew} = userNewSlice.actions;

export default userNewSlice.reducer;
