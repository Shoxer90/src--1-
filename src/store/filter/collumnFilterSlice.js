import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  collumns: [],
  collTitle: [],
}

const collumnFilterSlice =  createSlice({
  name: "collumnFilter",
  initialState,
  reducers: {
    setCollumns: (state, action) => {
      state.collumns = action.payload; // Обновляем только collumns
    },
    setCollTitle: (state, action) => {
      state.collTitle = action.payload; // Обновляем только collTitle
    },
  }
});

export const {setCollTitle, setCollumns} = collumnFilterSlice.actions;
export default collumnFilterSlice.reducer;
