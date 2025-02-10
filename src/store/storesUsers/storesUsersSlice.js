
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    stores: [],
};

const storesUsersSlice = createSlice({
  name: "storesUsers",
  initialState,
  reducers: {
    setStores: (state, action) => {
      state.stores = action.payload;
    },
  },
});

export const { setStores } = storesUsersSlice.actions;

export default storesUsersSlice.reducer;