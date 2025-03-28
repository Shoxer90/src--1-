import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
}

const paySlice = createSlice({
  name:"payForEhdm",
  initialState,
  reducers: {
    setPayForEhdm:(state, action) => {
      state.isOpen = action.payload
    }
  },
});

export const {setPayForEhdm} = paySlice.actions;

export default paySlice.reducer;
