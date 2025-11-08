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

// Create material request (business)
export const createMaterial = createAsyncThunk(
  "businesses/createMaterial",
  async (materialData, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/materials/material-requests", materialData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get all materials owned by current business (approved/active)
export const getApprovedMaterials = createAsyncThunk(
  "businesses/getApprovedMaterials",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/materials");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get my material requests (all statuses)
export const getMyMaterials = createAsyncThunk(
  "businesses/getMyMaterials",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/materials/my-request");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);



// get history business form
export const getHistoryBusinessForm = createAsyncThunk(
  "businesses/getHistoryBusinessForm",
  async({limit, page}, {rejectWithValue}) => {
    try {
      const response = await fetcher.get(`/businesses/history-business-form?limit=${limit}&page=${page}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create product group (business)
export const createProductGroup = createAsyncThunk(
  "businesses/createProductGroup",
  async (productGroupData, { rejectWithValue }) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('materialId', productGroupData.materialId);
      formData.append('name', productGroupData.name);
      
      if (productGroupData.description) {
        formData.append('description', productGroupData.description);
      }
      
      if (productGroupData.image) {
        formData.append('image', productGroupData.image);
      }

      const response = await fetcher.post("/products/product-groups", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get all product groups for current business
export const getMyProductGroups = createAsyncThunk(
  "businesses/getMyProductGroups",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/products/product-groups");
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
    businessFormHistory: [],
    businessesConfirmation: [],
    businesses: [],
    allBusinesses: [], 
    totalPages: 0,
    total: 0,
    currentPage: 1,
    isLoading: false,
    error: null,
    materials: [],
    approvedMaterials: [],
    myMaterials: [],
    materialLoading: false,
    materialError: null,
    productGroups: [],
    productGroupLoading: false,
    productGroupError: null,
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
      .addCase(getHistoryBusinessForm.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getHistoryBusinessForm.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.businessFormHistory = payload.data || [];
        state.error = null;
      })
      .addCase(getHistoryBusinessForm.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Product Group reducers
      .addCase(createProductGroup.pending, (state) => {
        state.productGroupLoading = true;
        state.productGroupError = null;
      })
      .addCase(createProductGroup.fulfilled, (state, { payload }) => {
        state.productGroupLoading = false;
        state.productGroups.push(payload.data || payload);
        state.productGroupError = null;
      })
      .addCase(createProductGroup.rejected, (state, { payload }) => {
        state.productGroupLoading = false;
        state.productGroupError = payload;
      })
      .addCase(getMyProductGroups.pending, (state) => {
        state.productGroupLoading = true;
        state.productGroupError = null;
      })
      .addCase(getMyProductGroups.fulfilled, (state, { payload }) => {
        state.productGroupLoading = false;
        state.productGroups = payload.data || payload || [];
        state.productGroupError = null;
      })
      .addCase(getMyProductGroups.rejected, (state, { payload }) => {
        state.productGroupLoading = false;
        state.productGroupError = payload;
      });
  },
});

export default businessSlice.reducer;
