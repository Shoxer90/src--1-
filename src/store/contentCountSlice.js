
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    count: 0
};

const contentCountSlice = createSlice({
  name: "count",
  initialState,
  reducers: {
    setCount: (state, action) => {
      state.count = action.payload;
    },
  },
});

export const { setCount } = contentCountSlice.actions;

export default contentCountSlice.reducer;