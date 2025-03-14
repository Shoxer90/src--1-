import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  history: [],
  cashiers: [],
  payments: [],
  invoices: [],
  info: {},
  fullName: ""
}

const customerSlice =  createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomerInfo: (state,action) => {
      localStorage.setItem("customer",JSON.stringify(action.payload))
      state.info = action.payload
    },
    setCustomerHistory: (state,action) => {
      state.history = action.payload
    },
    setCustomerPayments: (state,action) => {
      state.payments = action.payload
    },
    setCustomerInvoices: (state,action) => {
      state.invoices = action.payload
    },
    setCustomerFullName: (state,action) => {
      state.fullName = action.payload
    },
    setCustomerCashiers: (state,action) => {
      state.cashiers = action.payload
    }
  }
});

export const {setCustomerCashiers, setCustomerHistory, setCustomerPayments, setCustomerFullName,setCustomerInvoices, setCustomerInfo } = customerSlice.actions;
export default customerSlice.reducer;