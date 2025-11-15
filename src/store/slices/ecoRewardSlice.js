import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

// get all EcoReward
export const getEcoRewardApi = createAsyncThunk(
    "ecoreward/getEcoRewardApi",
    async({page,limit}, {rejectWithValue}) => {
        try {
            const response = await fetcher.get(`/admin/eco-reward-policies?page=${page}&limit=${limit}`)
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response ? error.response.data : error.message
              );
        }
    }
)

// add EcoReward
export const addEcoRewardApi = createAsyncThunk(
    "ecoreward/addEcoRewardApi",
    async(data, {rejectWithValue}) => {
        try {
            const response = await fetcher.post("/admin/eco-reward-policies", data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message)
        }
    }
)

// edit EcoReward
export const editEcoRewardApi = createAsyncThunk(
    "ecoreward/editEcoRewardApi",
    async({id, data}, {rejectWithValue}) => {
        try {
            const response = await fetcher.patch(`/admin/eco-reward-policies/${id}`, data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message)
        }
    }
)

// get detail EcoReward
export const getDetailEcoRewardApi = createAsyncThunk(
    "ecoreward/getDetailEcoRewardApi",
    async(id, {rejectWithValue}) => {
        try {
            const response = await fetcher.get(`/admin/eco-reward-policies/${id}`)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message)
        }
    }
)

const ecoRewardSlice = createSlice({
    name:"ecoreward",
    initialState: {
        items: [],
        status: "idle",
        error: null,
        pagination: {
            page: 1,
            limit: 10,
            totalPages: 1,
            totalItems: 0,
        },
    },
    reducers:{},
    extraReducers:(builder) => {
        builder
        .addCase(getEcoRewardApi.pending, (state) => {
            state.status = "loading";
            state.error = null;
        })
        .addCase(getEcoRewardApi.fulfilled, (state, action) => {
          state.isLoading = false;
          state.status = "succeeded";
            const payload = action.payload || {};
            state.items = payload.data || [];
            state.pagination = {
                page: payload.page ?? payload?.meta?.page ?? state.pagination.page,
                limit: payload.limit ?? payload?.meta?.limit ?? state.pagination.limit,
                totalPages: payload.totalPages ?? payload?.meta?.totalPages ?? 1,
                totalItems: payload.totalItems ?? payload?.meta?.totalItems ?? (payload.data?.length ?? 0),
            };
         
        })
        .addCase(getEcoRewardApi.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload?.message || action.error?.message || "Không thể tải Eco Reward policies";
        })
        .addCase(addEcoRewardApi.pending, (state) => {
            state.status = "loading";
            state.error = null;
        })
        .addCase(addEcoRewardApi.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.status = "succeeded";
            state.error = null;
            state.items.unshift(payload);
        })
        .addCase(addEcoRewardApi.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.status = "failed";
            state.error = payload;
        })
        .addCase(editEcoRewardApi.pending, (state) => {
            state.status = "loading";
            state.error = null;
        })
        .addCase(editEcoRewardApi.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.status = "succeeded";
            state.error = null;
            state.items = payload.data;
        })
        .addCase(editEcoRewardApi.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.status = "failed";
            state.error = payload;
        })
        .addCase(getDetailEcoRewardApi.pending, (state) => {
            state.status = "loading";
            state.error = null;
        })
        .addCase(getDetailEcoRewardApi.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.status = "succeeded";
            state.error = null;
            state.detail = payload.data;
        })
        .addCase(getDetailEcoRewardApi.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.status = "failed";
            state.error = payload;
        })
    }
})

export default ecoRewardSlice.reducer