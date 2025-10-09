// walletSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

// deposite money
export const depositeMoneyApi = createAsyncThunk(
  "wallet/depositeMoneyApi",
  async ({ walletId, amount }, { rejectWithValue }) => {
    try {
      console.log("Gọi API nạp tiền:", { walletId, amount });
      const response = await fetcher.post(`/wallets/${walletId}/deposit`, {
        amount: parseInt(amount), 
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi API nạp tiền:", error.response?.data);
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    wallet: null,
    isLoading: false,
    error: null,
    depositResult: null, 
  },
  reducers: {
    clearDepositResult: (state) => {
      state.depositResult = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(depositeMoneyApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(depositeMoneyApi.fulfilled, (state, { payload }) => {
        console.log("Deposit API response:", payload);
        state.isLoading = false;
        state.error = null;
       state.depositResult = { vnpayUrl: payload.url };
      })
      .addCase(depositeMoneyApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export const { clearDepositResult } = walletSlice.actions;
export default walletSlice.reducer;