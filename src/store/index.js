import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import businessSlice from "./slices/bussinessSlice";
import userSlice from "./slices/userSlice";
import walletSlice from "./slices/walletSlice";
import adminSlice from "./slices/adminSlice";
import subscriptionSlice from "./slices/subscriptionSlice";
import  manageUserSlice  from "./slices/manageUserSlice";
import storeSlice from "./slices/storeSilce";
import borrowSlice from "./slices/borrowSlice";
import ecoRewardSlice from "./slices/ecoRewardSlice";
export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    businesses: businessSlice,
    wallet: walletSlice,
    admin: adminSlice,
    subscription: subscriptionSlice,
    manageUser:manageUserSlice,
    store: storeSlice,
    borrow: borrowSlice,
    ecoreward:ecoRewardSlice,
  },
});

export default store;
