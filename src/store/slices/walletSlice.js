// walletSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

// deposite money
export const depositeMoneyApi = createAsyncThunk(
  "wallet/depositeMoneyApi",
  async ({ walletId, amount }, { rejectWithValue }) => {
    try {
      const response = await fetcher.post(`/wallets/${walletId}/deposit`, {
        amount: parseInt(amount),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// withdraw money
export const withdrawMoneyApi = createAsyncThunk(
  "wallet/withdrawMoneyApi",
  async ({ walletId, amount }, { rejectWithValue }) => {
    try {
      const response = await fetcher.post(`/wallets/${walletId}/withdraw`, {
        amount: parseInt(amount),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// get transaction history
export const getTransactionHistoryApi = createAsyncThunk(
  "wallet/getTransactionHistoryApi",
  async({page,limit,typeGroup = "personal",direction}, {rejectWithValue}) => {
    try {
      let url = `/wallet-transactions/my?typeGroup=${typeGroup}&page=${page}&limit=${limit}`;
      if (direction && direction !== "all") {
        url += `&direction=${direction}`;
      }
      const response = await fetcher.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
)

// get business transaction history
export const getBusinessTransactionHistoryApi = createAsyncThunk(
  "wallet/getBusinessTransactionHistoryApi",
  async({page,limit}, {rejectWithValue}) => {
    try {
      const response = await fetcher.get(`/wallet-transactions/my?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
)

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    wallet: null,
    isLoading: false,
    error: null,
    totalPages: 0,
    total: 0,
    currentPage: 1,
    depositResult: null,
    transactionHistory: [],
    transactionTotalPages: 0,
    transactionTotal: 0,
    transactionCurrentPage: 1,
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
      })
      .addCase(withdrawMoneyApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(withdrawMoneyApi.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        state.error = null;
        state.wallet = payload
      })
      .addCase(withdrawMoneyApi.rejected, (state, {payload}) => {
        state.isLoading = false;
        state.error = payload
      })
      .addCase(getTransactionHistoryApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTransactionHistoryApi.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        state.error = null;
        state.transactionHistory = payload.data;
        state.transactionTotalPages = payload.totalPages;
        state.transactionTotal = payload.total;
        state.transactionCurrentPage = payload.currentPage;
      })
      .addCase(getTransactionHistoryApi.rejected, (state, {payload}) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(getBusinessTransactionHistoryApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBusinessTransactionHistoryApi.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        state.error = null;
        state.transactionHistory = payload.data;
        state.transactionTotalPages = payload.totalPages;
        state.transactionTotal = payload.total;
        state.transactionCurrentPage = payload.currentPage;
      })
      .addCase(getBusinessTransactionHistoryApi.rejected, (state, {payload}) => {
        state.isLoading = false;
        state.error = payload;
      })
  },
});

export const { clearDepositResult } = walletSlice.actions;
export default walletSlice.reducer;
