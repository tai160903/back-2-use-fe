import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";


// get detail borrow transaction by business id
export const getDetailSingleUseApi = createAsyncThunk(
    "singleUse/getDetailSingleUseApi",
    async ({borrowTransactionId}, { rejectWithValue }) => {
        try {
            const response = await fetcher.get(`/single-use-product-usage/${borrowTransactionId}`);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// get single use product my
export const getSingleUseProductMyApi = createAsyncThunk(
    "singleUse/getSingleUseProductMyApi",
    async ({isActive = true, page = 1, limit = 10}, { rejectWithValue }) => {
        try {
            const response = await fetcher.get(`/business/single-use-product/my?isActive=${isActive}&page=${page}&limit=${limit}`);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// confirm single use product usage
export const confirmSingleUseProductUsageApi = createAsyncThunk(
    "singleUse/confirmSingleUseProductUsageApi",
    async ({borrowTransactionId, singleUseProductId, note}, { rejectWithValue }) => {
        try {
            const response = await fetcher.post(
                `/business/single-use-product-usage/${borrowTransactionId}`,
                {
                    singleUseProductId,
                    note: note || ""
                }
            );
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const singleUseSlice = createSlice({
    name: "singleUse",
    initialState: {
        singleUse: [],
        singleUseDetail: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        setSingleUse: (state, { payload }) => {
            state.singleUse = payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getDetailSingleUseApi.pending, (state) => {
            state.isLoading = true;
            state.error = null;
            state.singleUseDetail = [];
        })
        .addCase(getDetailSingleUseApi.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.singleUseDetail = payload?.data || payload || [];
        })
        .addCase(getDetailSingleUseApi.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload;
        })
        .addCase(getSingleUseProductMyApi.pending, (state) => {
            state.isLoading = true;
            state.error = null;
            state.singleUseProductMy = [];
        })
        .addCase(getSingleUseProductMyApi.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.error = null;
            state.singleUseProductMy = payload?.data || payload || [];
        })
        .addCase(getSingleUseProductMyApi.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload;
        })
        .addCase(confirmSingleUseProductUsageApi.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(confirmSingleUseProductUsageApi.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.error = null;
            state.singleUseProductMy = payload?.data || payload || [];
        })
        .addCase(confirmSingleUseProductUsageApi.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload;
        })
    }
});

export const { setSingleUse } = singleUseSlice.actions;
export default singleUseSlice.reducer;