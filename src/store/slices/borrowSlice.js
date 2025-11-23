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


// get details borrow transaction for customer
export const getDetailsBorrowTransactionCustomerApi = createAsyncThunk(
    "borrow/getDetailsBorrowTransactionCustomerApi",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetcher.get(`/borrow-transactions/customer/${id}`);
       
            return response.data?.data || null;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// get detail borrow transaction for business
export const getDetailsBorrowTransactionBusinessApi = createAsyncThunk(
    "borrow/getDetailsBorrowTransactionBusinessApi",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetcher.get(`/borrow-transactions/business/${id}`);
            return response.data?.data || null;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


// cancel borrow transaction for customer
export const cancelBorrowTransactionCustomerApi = createAsyncThunk(
    "borrow/cancelBorrowTransactionCustomerApi",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetcher.patch(`/borrow-transactions/customer/cancel/${id}`);
            return response.data?.data || null;
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
            // Backend trả về dạng { items: [...], total, page, limit }
            // Trong UI đang mong đợi 1 mảng transaction nên lấy ra items
            const items = Array.isArray(payload)
                ? payload
                : payload?.items || []
            state.borrow = items
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
            const items = Array.isArray(payload)
                ? payload
                : payload?.items || []
            state.borrow = items
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
        .addCase(getDetailsBorrowTransactionCustomerApi.pending, (state) => {
            state.isDetailLoading = true
            state.error = null
        })
        .addCase(getDetailsBorrowTransactionCustomerApi.fulfilled, (state, {payload}) => {
            state.isDetailLoading = false
            state.error = null
            state.borrowDetail = payload
        })
        .addCase(getDetailsBorrowTransactionCustomerApi.rejected, (state, {payload}) => {
            state.isDetailLoading = false
            state.error = payload
        })
        .addCase(cancelBorrowTransactionCustomerApi.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        .addCase(cancelBorrowTransactionCustomerApi.fulfilled, (state, {payload}) => {
            state.isLoading = false
            state.error = null
            state.borrowDetail = payload

            if (payload && payload._id) {
                state.borrow = state.borrow.map((item) =>
                    item._id === payload._id ? payload : item
                )
            }
        })
        .addCase(cancelBorrowTransactionCustomerApi.rejected, (state, {payload}) => {
            state.isLoading = false
            state.error = payload
        })
        .addCase(getDetailsBorrowTransactionBusinessApi.pending, (state) => {
            state.isDetailLoading = true
            state.error = null
        })
        .addCase(getDetailsBorrowTransactionBusinessApi.fulfilled, (state, {payload}) => {
            state.isDetailLoading = false
            state.error = null
            state.borrowDetail = payload
        })
        .addCase(getDetailsBorrowTransactionBusinessApi.rejected, (state, {payload}) => {
            state.isDetailLoading = false
            state.error = payload
        })
    }
})
export default borrowSlice.reducer;