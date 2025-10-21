import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";


// get ALL user
export const getAllUserApi = createAsyncThunk(
    "manageUser/getAllUserApi",
    async (__dirname, {rejectWithValue}) => {
        try {
            const response = await fetcher.get("/admin/customers?limit=1000 ")
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response ? error.response.data : error.message
              );
        }
    }
)

// get all user pagination
export const getUserPaginationApi = createAsyncThunk(
    "manageUser/getUserPaginationApi",
    async({page, limit}, {rejectWithValue}) => {
        try {
            const response = await fetcher.get(`/admin/customers?page=${page}&limit=${limit}`)
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response ? error.response.data : error.message
              );
        }
    }
)


// block/unblock user
export const updateUserBlockStatusApi = createAsyncThunk(
    "manageUser/updateUserBlockStatusApi",
    async({id, isBlocked, reason}, {rejectWithValue}) => {
        try {
            const response = await fetcher.patch(`/admin/customers/${id}/block-status`, {
                isBlocked,
                reason
            })
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response ? error.response.data : error.message
              );
        }
    }
)

// get user by id
export const getUserByIdApi = createAsyncThunk(
    "manageUser/getUserByIdApi",
    async(_id, {rejectWithValue}) => {
        try {
            const response = await fetcher.get(`/admin/customers/${_id}`)
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response ? error.response.data : error.message
              );
        }
    }
)

export const manageUserSlice = createSlice({
    name: "manageUser",
    initialState: {
        allUsers: [],
        manageUser: [],
        selectedUser: null,
        totalPages: 0,
        total: 0,
        currentPage: 1,
        isLoading: false,
        isUpdating: false,
        error: null,
    },
    reducers:{},
    extraReducers:(builder) => {
        builder.addCase(getAllUserApi.pending, (state) => { 
            state.isLoading = true
        })
        .addCase(getAllUserApi.fulfilled, (state, {payload}) => {
            state.isLoading = false
            state.error = null
            state.allUsers = payload.data ?? []
        })
        .addCase(getAllUserApi.rejected, (state, {payload}) => {
            state.isLoading = false
            state.error = payload
        })
        .addCase(getUserPaginationApi.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getUserPaginationApi.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.error = null;
            state.manageUser = payload.data ?? [];
            state.total = payload.total ?? 0;
            state.currentPage = payload.currentPage ?? 1;
            state.totalPages = payload.totalPages ?? 1;
          })
          .addCase(getUserPaginationApi.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
          })
          .addCase(updateUserBlockStatusApi.pending, (state) => {
            state.isUpdating = true;
          })
          .addCase(updateUserBlockStatusApi.fulfilled, (state) => {
            state.isUpdating = false;
            state.error = null;
          })
          .addCase(updateUserBlockStatusApi.rejected, (state, { payload }) => {
            state.isUpdating = false;
            state.error = payload;
          })
          .addCase(getUserByIdApi.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(getUserByIdApi.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.error = null;
            state.selectedUser = payload.data ?? {};
          })
          .addCase(getUserByIdApi.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
          })
    }
})
export default manageUserSlice.reducer