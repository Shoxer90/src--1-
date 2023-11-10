import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl, option } from "../services/baseUrl";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async function(_,{rejectWithValue}) {
    try{
      const  response = await fetch(baseUrl + "User/GetUser", option());
      if(!response.ok) {
        throw new Error("Server ERROR" )
      }
      const data = await response.json()
      return data
    }catch(error){
      return rejectWithValue(error.message)
   
    } 
  }
);

export const changeUserHdmStatus = createAsyncThunk(
  "user/changeUserHdmStatus",
  async function(status, {rejectWithValue}) {
    try{
      const  data = await axios.post(baseUrl + `User/SetEhdmStatus?Status=${status}`, status, option());
      if(data.status === 401) {
        throw new Error( )
      }
      return data.config.data
    }catch(error){
      return rejectWithValue(error)
    }
  }
)





const userSlice = createSlice({
    name: "user",
    initialState: {
        user: {},
        status :null,
        error: null
    },
    reducers: {
        getUserInformation (state, action) {

        }
    },
    extraReducers: {
      [fetchUser.pending]: (state,action) => {
        state.status = "loading";
        state.error = null;
      },
      [fetchUser.fulfilled]: (state,action) => {
        state.status = "resolved";
        state.user = action.payload;
      },
      [fetchUser.rejected]: (state,action) => {
        state.status = "rejected";
        state.error = action.payload
      },
      [changeUserHdmStatus.pending]: (state,action) => {
        state.status = "loading";
        state.error = null;
      },
      [changeUserHdmStatus.fulfilled]: (state,action) => {
        state.status = "resolved";
        state.user = action.payload;
      },
      [changeUserHdmStatus.rejected]: (state,action) => {
        state.status = "rejected";
        state.error = action.payload.response?.status
      },
    }
});

export default userSlice.reducer;
