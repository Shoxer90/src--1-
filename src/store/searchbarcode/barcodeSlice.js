
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  main: "",
  basket: "",
  newProd: "",
  emarkConfig: ""
};

const barcodeSlice = createSlice({
  name: "barCode",
  initialState,
  reducers: {
    setSearchBarCodeSlice: (state, action) => {
      state[action.payload?.name] = action.payload?.value;
    },
  },
});

export const { setSearchBarCodeSlice} = barcodeSlice.actions;

export default barcodeSlice.reducer;