import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice"
import businessSlice from "./slices/bussinessSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    businesses: businessSlice,
  },
  });

  export default store;