import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

// Get all businesses
export const getAllBusinesses = createAsyncThunk(
  "businesses/getAllBusinesses",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(
        `/businesses/form/all?page=${page}&limit=${limit}`
      );
      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get business by ID
export const getBusinessById = createAsyncThunk(
  "businesses/getBusinessById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/businesses/form/detail/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// approved business
export const approveBusiness = createAsyncThunk(
  "businesses/approveBusiness",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetcher.patch(`/admin/businesses/${id}/approve`);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);


// reject business
export const rejectBusiness = createAsyncThunk(
  "businesses/rejectBusiness",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetcher.patch(`/admin/businesses/${id}/reject`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const businessSlice = createSlice({
  name: "businesses",
  initialState: {
    businessesConfirmation: [],
    businesses: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBusinesses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllBusinesses.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.businesses = payload;
        state.error = null;
      })
      .addCase(getAllBusinesses.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(getBusinessById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBusinessById.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.businesses = payload;
        state.error = null;
      })
      .addCase(getBusinessById.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(approveBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(approveBusiness.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.businessesConfirmation = payload;
      })
      .addCase(approveBusiness.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(rejectBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rejectBusiness.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.businessesConfirmation = payload;
      })
      .addCase(rejectBusiness.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export default businessSlice.reducer;
