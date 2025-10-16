import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import businessSlice from "./slices/bussinessSlice";
import userSlice from "./slices/userSlice";
import walletSlice from "./slices/walletSlice";
import adminSlice from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    businesses: businessSlice,
    wallet: walletSlice,
    admin: adminSlice,
  },
});

export default store;
