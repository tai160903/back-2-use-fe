import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";
import toast from "react-hot-toast";

// Create Material API
export const createMaterialApi = createAsyncThunk(
  "admin/createMaterialApi",
  async (materialData, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/admin/materials", materialData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get All Materials API
export const getAllMaterialsApi = createAsyncThunk(
  "admin/getAllMaterialsApi",
  async ({ page = 1, limit = 10, status, materialName }, { rejectWithValue }) => {
    try {
      let url = `/admin/materials?page=${page}&limit=${limit}`;
      
      // Append filters
      if (status && status !== 'all') url += `&status=${status}`;
      if (materialName && materialName.trim()) url += `&materialName=${encodeURIComponent(materialName.trim())}`;
      
      const response = await fetcher.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get Material by ID API
export const getMaterialByIdApi = createAsyncThunk(
  "admin/getMaterialByIdApi",
  async (materialId, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/admin/materials/${materialId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Update Material API
export const updateMaterialApi = createAsyncThunk(
  "admin/updateMaterialApi",
  async ({ materialId, materialData }, { rejectWithValue }) => {
    try {
      const response = await fetcher.put(`/admin/materials/${materialId}`, materialData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Delete Material API
export const deleteMaterialApi = createAsyncThunk(
  "admin/deleteMaterialApi",
  async (materialId, { rejectWithValue }) => {
    try {
      const response = await fetcher.delete(`/admin/materials/${materialId}`);
      // Some APIs don't return the deleted object; ensure we pass back the id
      const payload = response?.data || {};
      return { ...payload, id: materialId };
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Review Material API (Approve/Reject)
export const reviewMaterialApi = createAsyncThunk(
  "admin/reviewMaterialApi",
  async ({ materialId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await fetcher.patch(`/admin/materials/${materialId}/review`, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get All Businesses API
export const getAllBusinessesApi = createAsyncThunk(
  "admin/getAllBusinessesApi",
  async ({ page = 1, limit = 10, isBlocked }, { rejectWithValue }) => {
    try {
      let url = `/admin/business?page=${page}&limit=${limit}`;
      
      // Append filters
      if (isBlocked !== undefined && isBlocked !== null) {
        url += `&isBlocked=${isBlocked}`;
      }
      
      const response = await fetcher.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get Business by ID API
export const getBusinessByIdApi = createAsyncThunk(
  "admin/getBusinessByIdApi",
  async (businessId, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/admin/business/${businessId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Block/Unblock Business API
export const updateBusinessBlockStatusApi = createAsyncThunk(
  "admin/updateBusinessBlockStatusApi",
  async ({ businessId, blockData }, { rejectWithValue }) => {
    try {
      console.log('API call - userId:', businessId, 'blockData:', blockData);
      const response = await fetcher.patch(`/admin/business/${businessId}/block-status`, blockData);
      console.log('API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API error:', error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    materials: [],
    currentMaterial: null,
    businesses: [],
    currentBusiness: null,
    isLoading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      currentPage: 1,
      totalPages: 0,
    },
    businessPagination: {
      page: 1,
      limit: 10,
      total: 0,
      currentPage: 1,
      totalPages: 0,
    },
    filters: {
      status: 'all', // 'all', 'pending', 'approved', 'rejected'
      materialName: '',
    },
    businessFilters: {
      isBlocked: null, // null = all, true = blocked, false = unblocked
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentMaterial: (state) => {
      state.currentMaterial = null;
    },
    clearCurrentBusiness: (state) => {
      state.currentBusiness = null;
    },
    setStatusFilter: (state, { payload }) => {
      state.filters.status = payload;
    },
    setMaterialNameFilter: (state, { payload }) => {
      state.filters.materialName = payload;
    },
    setPagination: (state, { payload }) => {
      state.pagination = { ...state.pagination, ...payload };
    },
    resetFilters: (state) => {
      state.filters = {
        status: 'all',
        materialName: '',
      };
    },
    setBusinessBlockedFilter: (state, { payload }) => {
      state.businessFilters.isBlocked = payload;
    },
    setBusinessPagination: (state, { payload }) => {
      state.businessPagination = { ...state.businessPagination, ...payload };
    },
    resetBusinessFilters: (state) => {
      state.businessFilters = {
        isBlocked: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Material
      .addCase(createMaterialApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMaterialApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        // Add the new material to the beginning of the list
        state.materials.unshift(payload.data);
        toast.success(payload.message || "Material created successfully!");
      })
      .addCase(createMaterialApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to create material");
      })
      
      // Get All Materials
      .addCase(getAllMaterialsApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllMaterialsApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.materials = payload.data || [];
        // Update pagination with response data
        state.pagination = {
          ...state.pagination,
          total: payload.total || 0,
          currentPage: payload.currentPage || 1,
          totalPages: payload.totalPages || 0,
        };
      })
      .addCase(getAllMaterialsApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to fetch materials");
      })
      
      // Get Material by ID
      .addCase(getMaterialByIdApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMaterialByIdApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.currentMaterial = payload.data;
      })
      .addCase(getMaterialByIdApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to fetch material");
      })
      
      // Update Material
      .addCase(updateMaterialApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMaterialApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        // Update the material in the list
        const updatedId = payload?.data?._id || payload?.data?.id;
        const index = state.materials.findIndex(
          (material) => material._id === updatedId || material.id === updatedId
        );
        if (index !== -1) {
          state.materials[index] = payload.data;
        }
        if (
          (state.currentMaterial?._id && state.currentMaterial._id === updatedId) ||
          (state.currentMaterial?.id && state.currentMaterial.id === updatedId)
        ) {
          state.currentMaterial = payload.data;
        }
        toast.success(payload.message || "Material updated successfully!");
      })
      .addCase(updateMaterialApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to update material");
      })
      
      // Delete Material
      .addCase(deleteMaterialApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMaterialApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        // Remove the material from the list
        const deletedId = payload?.data?._id || payload?.data?.id || payload?.id;
        state.materials = state.materials.filter(
          (material) => material._id !== deletedId && material.id !== deletedId
        );
        if (
          (state.currentMaterial?._id && state.currentMaterial._id === deletedId) ||
          (state.currentMaterial?.id && state.currentMaterial.id === deletedId)
        ) {
          state.currentMaterial = null;
        }
        toast.success(payload.message || "Material deleted successfully!");
      })
      .addCase(deleteMaterialApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to delete material");
      })
      
      // Review Material (Approve/Reject)
      .addCase(reviewMaterialApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(reviewMaterialApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;

        const updated = payload?.data || payload || {};
        const updatedId = updated._id || updated.id;
        const updatedStatus = updated.status;

        if (updatedId) {
          // Update the material status in the list
          const index = state.materials.findIndex(
            (material) => material._id === updatedId || material.id === updatedId
          );
          if (index !== -1) {
            state.materials[index].status = updatedStatus || state.materials[index].status;
            if (updated.rejectReason !== undefined) {
              state.materials[index].rejectReason = updated.rejectReason;
            }
          }

          if (
            (state.currentMaterial?._id && state.currentMaterial._id === updatedId) ||
            (state.currentMaterial?.id && state.currentMaterial.id === updatedId)
          ) {
            if (updatedStatus) state.currentMaterial.status = updatedStatus;
            if (updated.rejectReason !== undefined) {
              state.currentMaterial.rejectReason = updated.rejectReason;
            }
          }
        }

        // Show appropriate success message
        if (updatedStatus === 'approved') {
          toast.success(payload?.message || "Material approved successfully!");
        } else if (updatedStatus === 'rejected') {
          toast.success(payload?.message || "Material rejected successfully!");
        } else {
          toast.success(payload?.message || "Material review updated successfully!");
        }
      })
      .addCase(reviewMaterialApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to review material");
      })
      
      // Get All Businesses
      .addCase(getAllBusinessesApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllBusinessesApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.businesses = payload.data || [];
        // Update business pagination with response data
        state.businessPagination = {
          ...state.businessPagination,
          total: payload.total || 0,
          currentPage: payload.currentPage || 1,
          totalPages: payload.totalPages || 0,
        };
      })
      .addCase(getAllBusinessesApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to fetch businesses");
      })
      
      // Get Business by ID
      .addCase(getBusinessByIdApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBusinessByIdApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.currentBusiness = payload.data;
      })
      .addCase(getBusinessByIdApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to fetch business details");
      })
      
      // Update Business Block Status
      .addCase(updateBusinessBlockStatusApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBusinessBlockStatusApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;

        const updated = payload?.data || payload || {};
        const updatedId = updated._id || updated.id;
        const updatedIsBlocked = updated.isBlocked;

        if (updatedId) {
          // Update the business in the list
          const index = state.businesses.findIndex(
            (business) => business._id === updatedId || business.id === updatedId
          );
          if (index !== -1) {
            state.businesses[index].isBlocked = updatedIsBlocked;
            if (updated.reason !== undefined) {
              state.businesses[index].blockReason = updated.reason;
            }
          }

          // Update current business if it matches
          if (
            (state.currentBusiness?._id && state.currentBusiness._id === updatedId) ||
            (state.currentBusiness?.id && state.currentBusiness.id === updatedId)
          ) {
            state.currentBusiness.isBlocked = updatedIsBlocked;
            if (updated.reason !== undefined) {
              state.currentBusiness.blockReason = updated.reason;
            }
          }
        }

        // Show appropriate success message
        if (updatedIsBlocked) {
          toast.success(payload?.message || "Business blocked successfully!");
        } else {
          toast.success(payload?.message || "Business unblocked successfully!");
        }
      })
      .addCase(updateBusinessBlockStatusApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to update business block status");
      });
  },
});

export const { 
  clearError, 
  clearCurrentMaterial, 
  clearCurrentBusiness,
  setStatusFilter, 
  setMaterialNameFilter,
  setPagination, 
  resetFilters,
  setBusinessBlockedFilter,
  setBusinessPagination,
  resetBusinessFilters
} = adminSlice.actions;
export default adminSlice.reducer;
