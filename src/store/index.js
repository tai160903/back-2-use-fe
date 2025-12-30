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
import voucherSlice from "./slices/voucherSlice";
import notificationSlice from "./slices/notificationSlice";
import leaderBoardSlice from "./slices/leaderBoardSlice";
import staffSlice from "./slices/staffSlice";
import feedbackSlice from "./slices/feedbackSlice";
import rewardPointPackageSlice from "./slices/rewardPointPackageSlice";
import returnSlice from "./slices/returnSlice";
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
    vouchers: voucherSlice,
    notification: notificationSlice,
    leaderBoard: leaderBoardSlice,
    staff: staffSlice,
    feedback: feedbackSlice,
    rewardPointPackage: rewardPointPackageSlice,
    return: returnSlice,
  },
});

export default store;
