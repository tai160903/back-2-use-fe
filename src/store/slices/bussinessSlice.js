import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

// Get all businesses
export const getAllBusinesses = createAsyncThunk(
  "businesses/getAllBusinesses",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(
        `/admin/form/all?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get all businesses for statistics (no pagination)
export const getAllBusinessesForStats = createAsyncThunk(
  "businesses/getAllBusinessesForStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/admin/form/all?page=1&limit=1000`);
      return response.data;
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
      const response = await fetcher.get(`/admin/form/detail/${id}`);
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
  async ({ id, note }, { rejectWithValue }) => {
    try {
      const response = await fetcher.patch(`/admin/businesses/${id}/reject`, {
        note: note
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Create material
export const createMaterial = createAsyncThunk(
  "businesses/createMaterial",
  async (materialData, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/materials", materialData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get approved materials
export const getApprovedMaterials = createAsyncThunk(
  "businesses/getApprovedMaterials",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/materials/approved");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get my materials (business's own materials)
export const getMyMaterials = createAsyncThunk(
  "businesses/getMyMaterials",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/materials/my");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get my business registration (for customers to view their registration status)
export const getMyBusinessRegistration = createAsyncThunk(
  "businesses/getMyBusinessRegistration",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/businesses/form/my");
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
    allBusinesses: [], 
    totalPages: 0,
    total: 0,
    currentPage: 1,
    isLoading: false,
    error: null,
    // Material related state
    materials: [],
    approvedMaterials: [],
    myMaterials: [],
    materialLoading: false,
    materialError: null,
    // My business registration state
    myBusinessRegistration: null,
    registrationLoading: false,
    registrationError: null,
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
        state.businesses = payload.data || [];
        state.totalPages = payload.totalPages || 0;
        state.total = payload.total || 0;
        state.currentPage = payload.currentPage || 1;
        state.error = null;
      })
      .addCase(getAllBusinesses.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(getAllBusinessesForStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllBusinessesForStats.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.allBusinesses = payload.data || [];
        state.error = null;
      })
      .addCase(getAllBusinessesForStats.rejected, (state, { payload }) => {
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
      })
      // Material reducers
      .addCase(createMaterial.pending, (state) => {
        state.materialLoading = true;
        state.materialError = null;
      })
      .addCase(createMaterial.fulfilled, (state, { payload }) => {
        state.materialLoading = false;
        state.materials.push(payload);
        state.materialError = null;
      })
      .addCase(createMaterial.rejected, (state, { payload }) => {
        state.materialLoading = false;
        state.materialError = payload;
      })
      .addCase(getApprovedMaterials.pending, (state) => {
        state.materialLoading = true;
        state.materialError = null;
      })
      .addCase(getApprovedMaterials.fulfilled, (state, { payload }) => {
        state.materialLoading = false;
        state.approvedMaterials = payload.data || [];
        state.materialError = null;
      })
      .addCase(getApprovedMaterials.rejected, (state, { payload }) => {
        state.materialLoading = false;
        state.materialError = payload;
      })
      .addCase(getMyMaterials.pending, (state) => {
        state.materialLoading = true;
        state.materialError = null;
      })
      .addCase(getMyMaterials.fulfilled, (state, { payload }) => {
        state.materialLoading = false;
        state.myMaterials = payload.data || [];
        state.materialError = null;
      })
      .addCase(getMyMaterials.rejected, (state, { payload }) => {
        state.materialLoading = false;
        state.materialError = payload;
      })
      // My business registration reducers
      .addCase(getMyBusinessRegistration.pending, (state) => {
        state.registrationLoading = true;
        state.registrationError = null;
      })
      .addCase(getMyBusinessRegistration.fulfilled, (state, { payload }) => {
        state.registrationLoading = false;
        state.myBusinessRegistration = payload.data || payload;
        state.registrationError = null;
      })
      .addCase(getMyBusinessRegistration.rejected, (state, { payload }) => {
        state.registrationLoading = false;
        state.registrationError = payload;
      });
  },
});

export default businessSlice.reducer;
