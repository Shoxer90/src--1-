import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  type: "",
  text: ""
}

const messageSlice = createSlice({
  name:"message",
  initialState,
  reducers: {
    setMessage:(state, action) => {
      state.type = action.payload?.type
      state.text = action.payload?.text
    }
  },
});

export const {setMessage} = messageSlice.actions;

export default messageSlice.reducer;
