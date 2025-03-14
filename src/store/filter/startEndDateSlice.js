import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  "startDate": "",
  "endDate": ""
};

const startEndDateSlice = createSlice({
  name:"startEndDate",
  initialState,
  reducers: {
    setStartEndDate: (state, action) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate
      }
    },
});

export const {setStartEndDate} = startEndDateSlice.actions;
export default startEndDateSlice.reducer;
