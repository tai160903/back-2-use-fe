import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";


export const borrowProductApi = createAsyncThunk(
    "borrow/borrowProductApi",
    async (data, { rejectWithValue }) => {
        try {
            const response = await fetcher.post("/borrow-transactions", data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.response ? error.response.data : error.message
            );
        }
    }
);


// get transaction history for customer
export const getTransactionHistoryApi = createAsyncThunk(
    "borrow/getTransactionHistoryApi",
    async (data = {}, { rejectWithValue }) => {
        try {
            const response = await fetcher.get(
                "/borrow-transactions/customer-history",
                {
                    params: {
                        status: data.status || undefined,
                        productName: data.productName || undefined,
                    
                        borrowTransactionType:
                            data.borrowTransactionType || undefined,
                    },
                }
            );

            return response.data?.data || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


// get transaction history for business
export const getTransactionHistoryBusinessApi = createAsyncThunk(
    "borrow/getTransactionHistoryBusinessApi",
    async (data = {}, { rejectWithValue }) => {
        try {
            const response = await fetcher.get(
                "/borrow-transactions/business/history",
                {
                    params: {
                        status: data.status || undefined,
                        productName: data.productName || undefined,
                    
                        borrowTransactionType:
                            data.borrowTransactionType || undefined,
                    },
                }
            );

            return response.data?.data || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


// get pending borrow transactions for business
export const getPendingBorrowTransactionsBusinessApi = createAsyncThunk(
    "borrow/getPendingBorrowTransactionsBusinessApi",
    async (__, { rejectWithValue }) => {
        try {
            const response = await fetcher.get(
                "/borrow-transactions/business-pending"
            );
            return response.data?.data || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// get detail pending borrow transaction for business
export const getDetailPendingBorrowTransactionBusinessApi = createAsyncThunk(
    "borrow/getDetailPendingBorrowTransactionBusinessApi",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetcher.get(`/borrow-transactions/business/${id}`);
            return response.data?.data || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// confirm borrow transaction for business
export const confirmBorrowTransactionBusinessApi = createAsyncThunk(
    "borrow/confirmBorrowTransactionBusinessApi",
    async (id, { rejectWithValue }) => {
      try {
        const response = await fetcher.patch(`/borrow-transactions/confirm/${id}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
);

const borrowSlice = createSlice({
    name: "borrow",
    initialState: {
        borrow: [],
        borrowDetail: null,
        isLoading: false,
        isDetailLoading: false,
        error: null,
    },
    reducers: {
       
    },
    extraReducers:(builder) => {
        builder.addCase(borrowProductApi.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        .addCase(borrowProductApi.fulfilled, (state, {payload}) => {
            state.isLoading = false
            state.error = null
            state.borrow = payload
        })
        .addCase(borrowProductApi.rejected, (state, {payload}) => {
            state.isLoading = false
            state.error = payload
        })
        .addCase(getTransactionHistoryApi.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        .addCase(getTransactionHistoryApi.fulfilled, (state, {payload}) => {
            state.isLoading = false
            state.error = null
            state.borrow = payload
        })
        .addCase(getTransactionHistoryApi.rejected, (state, {payload}) => {
            state.isLoading = false
            state.error = payload
        })
        .addCase(getTransactionHistoryBusinessApi.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        .addCase(getTransactionHistoryBusinessApi.fulfilled, (state, {payload}) => {
            state.isLoading = false
            state.error = null
            state.borrow = payload
        })
        .addCase(getTransactionHistoryBusinessApi.rejected, (state, {payload}) => {
            state.isLoading = false
            state.error = payload
        })
        .addCase(getPendingBorrowTransactionsBusinessApi.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        .addCase(getPendingBorrowTransactionsBusinessApi.fulfilled, (state, {payload}) => {
            state.isLoading = false
            state.error = null
            state.borrow = payload
        })
        .addCase(getPendingBorrowTransactionsBusinessApi.rejected, (state, {payload}) => {
            state.isLoading = false
            state.error = payload
        })
        .addCase(getDetailPendingBorrowTransactionBusinessApi.pending, (state) => {
            state.isDetailLoading = true
            state.error = null
        })
        .addCase(getDetailPendingBorrowTransactionBusinessApi.fulfilled, (state, {payload}) => {
            state.isDetailLoading = false
            state.error = null
            state.borrowDetail = payload
        })
        .addCase(getDetailPendingBorrowTransactionBusinessApi.rejected, (state, {payload}) => {
            state.isDetailLoading = false
            state.error = payload
        })
        .addCase(confirmBorrowTransactionBusinessApi.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        .addCase(confirmBorrowTransactionBusinessApi.fulfilled, (state, {payload}) => {
            state.isLoading = false
            state.error = null
            state.borrowDetail = payload
        })
        .addCase(confirmBorrowTransactionBusinessApi.rejected, (state, {payload}) => {
            state.isLoading = false
            state.error = payload
        })
    }
})
export default borrowSlice.reducer;