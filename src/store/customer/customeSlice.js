import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  history: [],
  cashiers: [],
  payments: [],
  invoices: []
}

const customerSlice =  createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomerHistory: (state,action) => {
      state.history = action.payload
    },
    setCustomerPayments: (state,action) => {
      state.payments = action.payload
    },
    setCustomerCashiers: (state,action) => {
      state.cashiers = action.payload
    }
  }
});

export const {setCustomerCashiers, setCustomerHistory, setCustomerPayments } = customerSlice.actions;
export default customerSlice.reducer;