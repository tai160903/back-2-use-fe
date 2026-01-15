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

export const getDetailSingleUseMyApi = createAsyncThunk(
    "singleUse/getDetailSingleUseMyApi",
    async ({page = 1, limit = 10}, { rejectWithValue }) => {
        try {
            const response = await fetcher.get(`/single-use-product-usage/my?page=${page}&limit=${limit}`);
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
        singleUseDetailMy: [],
        singleUseMyTotal: 0,
        singleUseMyTotalPages: 0,
        singleUseMyCurrentPage: 1,
        isLoading: false,
        error: null,
    },
    reducers: {
        setSingleUse: (state, { payload }) => {
            state.singleUse = payload;
        },
        clearSingleUseDetailMy: (state) => {
            state.singleUseDetailMy = [];
            state.singleUseMyTotal = 0;
            state.singleUseMyTotalPages = 0;
            state.singleUseMyCurrentPage = 1;
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
        .addCase(getDetailSingleUseMyApi.pending, (state) => {
            state.isLoading = true;
            state.error = null;
            state.singleUseDetailMy = [];
        })
        .addCase(getDetailSingleUseMyApi.fulfilled, (state, {payload}) => {
            console.log('[singleUseSlice] getDetailSingleUseMyApi fulfilled, payload:', payload);
            console.log('[singleUseSlice] payload type:', typeof payload);
            console.log('[singleUseSlice] payload.data:', payload?.data);
            console.log('[singleUseSlice] payload.items:', payload?.items);
            console.log('[singleUseSlice] payload.data isArray:', Array.isArray(payload?.data));
            console.log('[singleUseSlice] payload.items isArray:', Array.isArray(payload?.items));
            console.log('[singleUseSlice] payload isArray:', Array.isArray(payload));
            
            state.isLoading = false;
            state.error = null;
            
            // Try multiple ways to extract data
            let data = [];
            if (Array.isArray(payload?.data)) {
                data = payload.data;
            } else if (Array.isArray(payload?.items)) {
                data = payload.items;
            } else if (Array.isArray(payload)) {
                data = payload;
            } else if (payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
                // If data is an object, try to extract array from it
                data = payload.data.data || payload.data.items || [];
            }
            
            console.log('[singleUseSlice] Final parsed data:', data, 'isArray:', Array.isArray(data), 'length:', data.length);
            state.singleUseDetailMy = data;
            state.singleUseMyTotal = payload?.total || payload?.data?.total || 0;
            state.singleUseMyTotalPages = payload?.totalPages || payload?.data?.totalPages || 0;
            state.singleUseMyCurrentPage = payload?.currentPage || payload?.data?.currentPage || 1;
            console.log('[singleUseSlice] State updated - singleUseDetailMy length:', state.singleUseDetailMy.length);
        })
        .addCase(getDetailSingleUseMyApi.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload;
        })
    }
});

export const { setSingleUse, clearSingleUseDetailMy } = singleUseSlice.actions;
export default singleUseSlice.reducer;