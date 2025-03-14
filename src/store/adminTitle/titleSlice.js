import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title:"",
  subTitle:"",
  userName:""
};

const adminTitleSlice = createSlice({
  name: "adminTitle",
  initialState,
  reducers: {
    setTitle:(state, action) => {
      state.title = action.payload.title;
      state.subTitle = action.payload.subTitle;
    },
    setUserName: (state, action) => {
      state.userName = action.payload.userName;
      localStorage.setItem("customer",JSON.stringify({
        name: action.payload.userName
      }))
    }
  },
});

export const {setTitle, setUserName} = adminTitleSlice.actions;

export default adminTitleSlice.reducer;
