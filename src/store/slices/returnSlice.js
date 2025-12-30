import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";



// scan return
export const scanReturnApi = createAsyncThunk(
    "return/scanReturnApi",
    async ({ serialNumber }, { rejectWithValue }) => {
        try {
            const response = await fetcher.get(`/products/scan/${serialNumber}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)

// check return
export const checkReturnApi = createAsyncThunk(
    "return/checkReturnApi",
    async ({ serialNumber, formData }, { rejectWithValue }) => {
        try {
            const response = await fetcher.post(`/borrow-transactions/${serialNumber}/check`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)

// confirm return
export const confirmReturnApi = createAsyncThunk(
    "return/confirmReturnApi",
    async ({ serialNumber, confirmData }, { rejectWithValue }) => {
        try {
            const response = await fetcher.post(`/borrow-transactions/${serialNumber}/confirm`, confirmData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)

// api damage-policy
export const getDamagePolicyApi = createAsyncThunk(
    "return/getDamagePolicyApi",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetcher.get(`/borrow-transactions/damage-policy`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)


const returnSlice = createSlice({
    name: "return",
    initialState: {
        returns: [],
        total: 0,
        currentPage: 1,
        totalPages: 1,
        scanData: null,
        previewData: null,
        isLoading: false,
        error: null,
        damagePolicy: null,
    },
    reducers: {
        clearScanData: (state) => {
            state.scanData = null;
            state.previewData = null;
            state.error = null;
        },
        clearPreviewData: (state) => {
            state.previewData = null;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(checkReturnApi.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(checkReturnApi.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.error = null;
            // Debug: Log payload to check structure
            console.log("CheckReturnApi fulfilled payload:", payload);
            // Try both possible response structures
            state.previewData = payload.preview || payload.data?.preview || null;
            console.log("PreviewData set to:", state.previewData);
        })
        .addCase(checkReturnApi.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload;
        })
        .addCase(scanReturnApi.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(scanReturnApi.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.error = null;
            state.scanData = payload.data;
        })
        .addCase(scanReturnApi.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload;
        })
        .addCase(confirmReturnApi.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(confirmReturnApi.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.error = null;
            state.previewData = null;
            state.returns = payload.data;
        })
        .addCase(confirmReturnApi.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload;
        })
        .addCase(getDamagePolicyApi.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(getDamagePolicyApi.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.error = null;
            state.damagePolicy = payload.data;
        })
        .addCase(getDamagePolicyApi.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload;
        })
    }
})

export const { setReturns, clearScanData, clearPreviewData } = returnSlice.actions;
export default returnSlice.reducer;