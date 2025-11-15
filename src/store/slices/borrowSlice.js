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

const borrowSlice = createSlice({
    name: "borrow",
    initialState: {
        borrow: [],
        isLoading: false,
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
    }
})
export default borrowSlice.reducer;