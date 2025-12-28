import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

// create reward point package
export const createRewardPointPackageApi = createAsyncThunk(
    "rewardPointPackage/createRewardPointPackageApi",
    async (data, {rejectWithValue}) => {
        try {
            const response = await fetcher.post("/reward-points-packages/admin/create", data)
            return response.data
        }
        catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message)
        }
    }
)

// get all reward point packages
export const getAllRewardPointPackagesApi = createAsyncThunk(
    "rewardPointPackage/getAllRewardPointPackagesApi",
    async ({page = 1, limit = 10} = {}, {rejectWithValue}) => {
        try {
            const response = await fetcher.get(`/reward-points-packages/admin/all?page=${page}&limit=${limit}`)
            return response.data
        }
        catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message)
        }
    }
)

// update reward point package
export const updateRewardPointPackageApi = createAsyncThunk(
    "rewardPointPackage/updateRewardPointPackageApi",
    async ({id, data}, {rejectWithValue}) => {
        try {
            const response = await fetcher.patch(`/reward-points-packages/admin/${id}`, data)
            return response.data
        }
        catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message)
        }
    }
)

// delete reward point package
export const deleteRewardPointPackageApi = createAsyncThunk(
    "rewardPointPackage/deleteRewardPointPackageApi",
    async ({id}, {rejectWithValue}) => {
        try {
            const response = await fetcher.delete(`/reward-points-packages/admin/${id}`)
            return response.data
        }
        catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message)
        }
    }
)

// get reward point package status 
export const getRewardPointPackageStatusApi = createAsyncThunk(
    "rewardPointPackage/getRewardPointPackageStatusApi",
    async (_, {rejectWithValue}) => {
        try {
            const response = await fetcher.get(`/reward-points-packages/active`)
            return response.data
        }
    catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message)
        }
    }
)

// buy reward point package
export const buyRewardPointPackageApi = createAsyncThunk(
    "rewardPointPackage/buyRewardPointPackageApi",
    async ({packageId}, {rejectWithValue}) => {
        try {
            const response = await fetcher.post(`/reward-points-packages/buy/${packageId}`)
            return response.data
        }
        catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message)
        }
    }
)

// get reward points
export const getRewardPointsApiHistory = createAsyncThunk(
    "rewardPointPackage/getRewardPointsApiHistory",
    async ({page = 1, limit = 10} = {}, {rejectWithValue}) => {
        try {
            const response = await fetcher.get(`/reward-points-packages/purchase-history?page=${page}&limit=${limit}`)
            return response.data
        }
    catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message)
        }
    }
)


const rewardPointPackageSlice = createSlice({
    name:"rewardPointPackage",
    initialState:{
        rewardPointPackage:[],
        packages: [],
        rewardPointPackageStatus: null,
        rewardPointPackageHistory: null,
        isLoading:false,
        error:null,
    },
 reducers:{},
 extraReducers:(builder) => {
    builder.addCase(createRewardPointPackageApi.pending, (state) => {
        state.isLoading = true
        state.error = null
    })
    .addCase(createRewardPointPackageApi.fulfilled, (state, {payload}) => {
        state.isLoading = false
        state.error = null
        state.rewardPointPackage = payload
    })
    .addCase(createRewardPointPackageApi.rejected, (state, {payload}) => {
        state.isLoading = false
        state.error = payload
    })
    .addCase(getAllRewardPointPackagesApi.pending, (state) => {
        state.isLoading = true
        state.error = null
    })
    .addCase(getAllRewardPointPackagesApi.fulfilled, (state, {payload}) => {
        state.isLoading = false
        state.error = null
        // Handle response structure: { statusCode, message, data: [...], total, currentPage, totalPages }
        state.packages = payload?.data || []
        state.rewardPointPackage = payload
    })
    .addCase(getAllRewardPointPackagesApi.rejected, (state, {payload}) => {
        state.isLoading = false
        state.error = payload
    })
    .addCase(updateRewardPointPackageApi.pending, (state) => {
        state.isLoading = true
        state.error = null
    })
    .addCase(updateRewardPointPackageApi.fulfilled, (state, {payload}) => {
        state.isLoading = false
        state.error = null
        state.rewardPointPackage = payload
    })
    .addCase(updateRewardPointPackageApi.rejected, (state, {payload}) => {
        state.isLoading = false
        state.error = payload
    })
    .addCase(deleteRewardPointPackageApi.pending, (state) => {
        state.isLoading = true
        state.error = null
    })
    .addCase(deleteRewardPointPackageApi.fulfilled, (state, {payload}) => {
        state.isLoading = false
        state.error = null
        state.rewardPointPackage = payload
    })
    .addCase(deleteRewardPointPackageApi.rejected, (state, {payload}) => {
        state.isLoading = false
        state.error = payload
    })
    .addCase(getRewardPointPackageStatusApi.pending, (state) => {
        state.isLoading = true
        state.error = null
    })
    .addCase(getRewardPointPackageStatusApi.fulfilled, (state, {payload}) => {
        state.isLoading = false
        state.error = null
        state.rewardPointPackageStatus = payload
    })
    .addCase(getRewardPointPackageStatusApi.rejected, (state, {payload}) => {
        state.isLoading = false
        state.error = payload
    })
    .addCase(buyRewardPointPackageApi.pending, (state) => {
        state.isLoading = true
        state.error = null
    })
    .addCase(buyRewardPointPackageApi.fulfilled, (state, {payload}) => {
        state.isLoading = false
        state.error = null
        state.rewardPointPackage = payload
    })
    .addCase(buyRewardPointPackageApi.rejected, (state, {payload}) => {
        state.isLoading = false
        state.error = payload
    })
    .addCase(getRewardPointsApiHistory.pending, (state) => {
        state.isLoading = true
        state.error = null
    })
    .addCase(getRewardPointsApiHistory.fulfilled, (state, {payload}) => {
        state.isLoading = false
        state.error = null
        state.rewardPointPackageHistory = payload
    })
    .addCase(getRewardPointsApiHistory.rejected, (state, {payload}) => {
        state.isLoading = false
        state.error = payload
    })
 }
})

export const { getRewardPointPackage } = rewardPointPackageSlice.actions
export default rewardPointPackageSlice.reducer