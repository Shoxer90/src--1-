import { createSlice } from "@reduxjs/toolkit";
import { NAV_TITLES } from "../../admin/modules/variables";

const initialState={
  navigation: NAV_TITLES
} ;

const navigationSlice = createSlice({
  name:"navigation",
  initialState,
  reducers: {
    setNavigation: (state, action) => {
      const newArr = []
      state?.navigation.forEach((item) => {
        if(item?.id === action.payload?.id){
         newArr.push({
          ...item,
          isActive: true,
         })
        }else{
          newArr.push({
          ...item,
          isActive: false,
          })
        }
      })
      state.navigation = newArr
    }
  }
});


export const { setNavigation } = navigationSlice.actions;

export default navigationSlice.reducer;