// walletSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";
import { getUserRole } from "../../utils/authUtils";

// deposite money
export const depositeMoneyApi = createAsyncThunk(
  "wallet/depositeMoneyApi",
  async ({ walletId, amount, paymentMethod }, { rejectWithValue }) => {
    try {
      const response = await fetcher.post(`/wallets/${walletId}/deposit`, {
        amount: parseInt(amount),
      
        paymentMethod,
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
  async({page,limit,typeGroup = "personal",direction,walletType}, {rejectWithValue}) => {
    try {
      let url = `/wallet-transactions/my`;
      const params = [];
      
      // If walletType not provided, infer from current user role
      const resolvedWalletType = walletType || (() => {
        const role = getUserRole?.();
        if (role === "business") return "business";
        return "customer";
      })();

      if (resolvedWalletType) {
        params.push(`walletType=${resolvedWalletType}`);
      }
      params.push(`typeGroup=${typeGroup}`);
      params.push(`page=${page}`);
      params.push(`limit=${limit}`);
      
      if (direction && direction !== "all") {
        params.push(`direction=${direction}`);
      }
      
      url += `?${params.join('&')}`;
      const response = await fetcher.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
)


export const getTransactionHistoryBusinessApiDetail = createAsyncThunk(
  "wallet/getTransactionHistoryBusinessApiDetail",
  async({id}, {rejectWithValue}) => {
    try {
      const response = await fetcher.get(`/wallet-transactions/${id}`);
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
    isDetailLoading: false,
    error: null,
    totalPages: 0,
    total: 0,
    currentPage: 1,
    depositResult: null,
    transactionHistory: [],
    transactionTotalPages: 0,
    transactionTotal: 0,
    transactionCurrentPage: 1,
    transactionDetail: null,
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
        // Normalize different possible response shapes from BE for multiple gateways
        const paymentUrl =
          payload?.paymentUrl ||
          payload?.url ||
          payload?.vnpayUrl ||
          payload?.momoUrl ||
          null;

        state.depositResult = {
          vnpayUrl: payload?.vnpayUrl || payload?.url || null,
          momoUrl: payload?.momoUrl || null,
          paymentUrl,
          paymentMethod: payload?.paymentMethod || payload?.provider || null,
        };
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
      .addCase(getTransactionHistoryBusinessApiDetail.pending, (state) => {
        state.isDetailLoading = true;
        state.error = null;
      })
      .addCase(getTransactionHistoryBusinessApiDetail.fulfilled, (state, {payload}) => {
        state.isDetailLoading = false;
        state.error = null;
        state.transactionDetail = payload.data;
      })
      .addCase(getTransactionHistoryBusinessApiDetail.rejected, (state, {payload}) => {
        state.isDetailLoading = false;
        state.error = payload;
      })
  },
});

export const { clearDepositResult } = walletSlice.actions;
export default walletSlice.reducer;
