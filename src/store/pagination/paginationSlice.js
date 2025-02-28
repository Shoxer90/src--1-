
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  length:0,
  perPage:0,
  path:  ``
}

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setPagination: (state, action) => {
      state.length = action.payload?.length;
      state.perPage = action.payload?.perPage;
    },
    setPaginationPath:(state, action) =>{
      state.path = action.payload.path
    }
  },
});

export const { setPagination, setPaginationPath } = paginationSlice.actions;

export default paginationSlice.reducer;