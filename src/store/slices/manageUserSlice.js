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


export const manageUserSlice = createSlice({
    name: "manageUser",
    initialState: {
        allUsers: [],
        manageUser: [],
        totalPages: 0,
        total: 0,
        currentPage: 1,
        isLoading: false,
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
    }
})
export default manageUserSlice.reducer