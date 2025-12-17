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
                        fromDate: data.fromDate || undefined,
                        toDate: data.toDate || undefined,
                        page: data.page || undefined,
                        limit: data.limit || undefined,
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
                "/borrow-transactions/business",
                {
                    params: {
                        status: data.status || undefined,
                        productName: data.productName || undefined,
                        fromDate: data.fromDate || undefined,
                        toDate: data.toDate || undefined,
                        page: data.page || undefined,
                        limit: data.limit || undefined,
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


// borrow product online
export const borrowProductOnlineApi = createAsyncThunk(
    "borrow/borrowProductOnlineApi",
    async (data, { rejectWithValue }) => {
        try {
            const response = await fetcher.post("/borrow-transactions", data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// extend borrow product 
export const extendBorrowProductApi = createAsyncThunk(
    "borrow/extendBorrowProductApi",
    async ({ id, additionalDays }, { rejectWithValue }) => {
        try {
            const response = await fetcher.patch(
                `/borrow-transactions/customer/extend/${id}`,
                { additionalDays }
            );
            return response.data?.data || response.data;
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
      total: 0,
      page: 1,
      limit: 0,
      totalPages: 0,
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
            const items = Array.isArray(payload)
                ? payload
                : payload?.items || []
            state.borrow = items
            const total = Array.isArray(payload)
                ? items.length
                : payload?.total || items.length
            const limit = Array.isArray(payload)
                ? items.length
                : payload?.limit || items.length
            const page = Array.isArray(payload)
                ? 1
                : payload?.page || 1
            state.total = total
            state.limit = limit
            state.page = page
            state.totalPages = limit ? Math.ceil(total / limit) : 0
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
            const total = Array.isArray(payload)
                ? items.length
                : payload?.total || items.length
            const limit = Array.isArray(payload)
                ? items.length
                : payload?.limit || items.length
            const page = Array.isArray(payload)
                ? 1
                : payload?.page || 1
            state.total = total
            state.limit = limit
            state.page = page
            state.totalPages = limit ? Math.ceil(total / limit) : 0
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
        .addCase(borrowProductOnlineApi.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        .addCase(borrowProductOnlineApi.fulfilled, (state, {payload}) => {
            state.isLoading = false
            state.error = null
            state.borrowDetail = payload
        })
        .addCase(borrowProductOnlineApi.rejected, (state, {payload}) => {
            state.isLoading = false
            state.error = payload
        })
        .addCase(extendBorrowProductApi.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        .addCase(extendBorrowProductApi.fulfilled, (state, {payload}) => {
            state.isLoading = false
            state.error = null
            const updatedTransaction = payload || null
            state.borrowDetail = updatedTransaction

            if (updatedTransaction && updatedTransaction._id) {
                state.borrow = state.borrow.map((item) =>
                    item._id === updatedTransaction._id ? updatedTransaction : item
                )
            }
        })
        .addCase(extendBorrowProductApi.rejected, (state, {payload}) => {
            state.isLoading = false
            state.error = payload
        })
    }
})
export default borrowSlice.reducer;