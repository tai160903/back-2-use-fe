import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

// get all staff
export const getAllStaffApi = createAsyncThunk(
    "businesses/getALLStaff",
    async ({search, status, page, limit} = {}, { rejectWithValue }) => {
    try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        
        const queryString = params.toString();
        const url = queryString ? `/staffs?${queryString}` : '/staffs';
        const response = await fetcher.get(url);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
    }
})

// get staff by id
export const getStaffByIdApi = createAsyncThunk(
    "businesses/getStaffById",
    async (id, { rejectWithValue }) => {
    try {
        const response = await fetcher.get(`/staffs/${id}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
    }
})

// update staff
export const updateStaffApi = createAsyncThunk(
    "businesses/updateStaff",
    async ({id, data}, { rejectWithValue }) => {
    try {
        const response = await fetcher.patch(`/staffs/${id}`, data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
    }
})

// create staff
export const createStaffApi = createAsyncThunk(
    "businesses/createStaff",
    async (data, { rejectWithValue }) => {
    try {
        const response = await fetcher.post("/staffs", data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
    }
})


// delete staff
export const deleteStaffApi = createAsyncThunk(
    "businesses/deleteStaff",
    async (id, { rejectWithValue }) => {
    try {
        const response = await fetcher.delete(`/staffs/${id}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
    }
})


const staffSlice = createSlice({
    name: "staff",
    initialState: {
        staff: [],
        isLoading: false,
        error: null,
        total: 0,
        currentPage: 1,
        totalPages: 1,
        staffDetail: null,
    },
    reducers: {
  
    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllStaffApi.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(getAllStaffApi.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.error = null;
            state.staff = payload.data?.data || [];
            state.total = payload.data?.total || 0;
            state.currentPage = payload.data?.currentPage || 1;
            state.totalPages = payload.data?.totalPages || 1;
        })
        .addCase(getAllStaffApi.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload;
        })
        .addCase(createStaffApi.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(createStaffApi.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.error = null;
            // Thêm staff mới vào danh sách
            if (payload.data) {
                state.staff = [...state.staff, payload.data];
            }
        })
        .addCase(createStaffApi.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload;
        })
        .addCase(deleteStaffApi.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(deleteStaffApi.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.error = null;
            state.staff = state.staff.filter((staff) => staff._id !== payload.data._id);
        })
        .addCase(deleteStaffApi.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload;
        })
        .addCase(getStaffByIdApi.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(getStaffByIdApi.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.error = null;
            state.staffDetail = payload.data;
        })
        .addCase(getStaffByIdApi.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload;
        })
        .addCase(updateStaffApi.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(updateStaffApi.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.error = null;
            state.staff = state.staff.map((staff) => staff._id === payload.data._id ? payload.data : staff);
        })
        .addCase(updateStaffApi.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload;
        })
    }
})

export default staffSlice.reducer;