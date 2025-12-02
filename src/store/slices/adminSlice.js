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
      const response = await fetcher.patch(`/admin/materials/${materialId}`, materialData);
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

// Get Material Requests API
export const getMaterialRequestsApi = createAsyncThunk(
  "admin/getMaterialRequestsApi",
  async ({ status, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      let url = `/admin/materials/material-requests?page=${page}&limit=${limit}`;
      
      if (status && status !== 'all') {
        url += `&status=${status}`;
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

// Get Business Statistics API
export const getBusinessStatsApi = createAsyncThunk(
  "admin/getBusinessStatsApi",
  async (_, { rejectWithValue }) => {
    try {
      // Fetch counts for different statuses in parallel
      const [allResponse, activeResponse, blockedResponse] = await Promise.all([
        fetcher.get(`/admin/business?page=1&limit=1`),
        fetcher.get(`/admin/business?page=1&limit=1&isBlocked=false`),
        fetcher.get(`/admin/business?page=1&limit=1&isBlocked=true`)
      ]);
      
      return {
        total: allResponse.data.total || 0,
        active: activeResponse.data.total || 0,
        blocked: blockedResponse.data.total || 0
      };
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

// ============ LEADERBOARD REWARD APIs ============

// Get Leaderboard Reward API
export const getLeaderboardRewardApi = createAsyncThunk(
  "admin/getLeaderboardRewardApi",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const url = `/admin/leaderboard-reward?page=${page}&limit=${limit}`;
      const response = await fetcher.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// ============ LEADERBOARD POLICY APIs ============

// Get Leaderboard Policies API
export const getLeaderboardPoliciesApi = createAsyncThunk(
  "admin/getLeaderboardPoliciesApi",
  async ({ month, year, isDistributed, rankFrom, rankTo, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      let url = `/admin/leaderboard-policy?page=${page}&limit=${limit}`;
      if (month !== undefined && month !== null) url += `&month=${month}`;
      if (year !== undefined && year !== null) url += `&year=${year}`;
      if (isDistributed !== undefined && isDistributed !== null) url += `&isDistributed=${isDistributed}`;
      if (rankFrom !== undefined && rankFrom !== null) url += `&rankFrom=${rankFrom}`;
      if (rankTo !== undefined && rankTo !== null) url += `&rankTo=${rankTo}`;
      const response = await fetcher.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Create Leaderboard Policy API
export const createLeaderboardPolicyApi = createAsyncThunk(
  "admin/createLeaderboardPolicyApi",
  async (policyData, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/admin/leaderboard-policy", policyData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Update Leaderboard Policy API
export const updateLeaderboardPolicyApi = createAsyncThunk(
  "admin/updateLeaderboardPolicyApi",
  async ({ id, policyData }, { rejectWithValue }) => {
    try {
      const response = await fetcher.patch(`/admin/leaderboard-policy/${id}`, policyData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// ============ REWARD SETTING APIs ============

// Get Reward Settings API
export const getRewardSettingsApi = createAsyncThunk(
  "admin/getRewardSettingsApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/admin/reward-setting");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Create Reward Setting API
export const createRewardSettingApi = createAsyncThunk(
  "admin/createRewardSettingApi",
  async (settingData, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/admin/reward-setting", settingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Update Reward Setting API
export const updateRewardSettingApi = createAsyncThunk(
  "admin/updateRewardSettingApi",
  async ({ id, settingData }, { rejectWithValue }) => {
    try {
      const response = await fetcher.patch(`/admin/reward-setting/${id}`, settingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Toggle Reward Setting API
export const toggleRewardSettingApi = createAsyncThunk(
  "admin/toggleRewardSettingApi",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetcher.patch(`/admin/reward-setting/${id}/toggle`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);


// Get Admin Dashboard Overview API
export const getAdminDashboardOverviewApi = createAsyncThunk(
  "admin/getAdminDashboardOverviewApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/admin/dashboard/overview");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get Borrow Transactions Monthly API
export const getBorrowTransactionsMonthlyApi = createAsyncThunk(
  "admin/getBorrowTransactionsMonthlyApi",
  async ({ year, type, status }, { rejectWithValue }) => {
    try {
      let url = `/admin/dashboard/borrow-transactions/monthly`;
      const params = new URLSearchParams();
      if (year) params.append('year', year);
      if (type) params.append('type', type);
      if (status) params.append('status', status);
      if (params.toString()) url += `?${params.toString()}`;
      const response = await fetcher.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get Top Businesses API
export const getTopBusinessesApi = createAsyncThunk(
  "admin/getTopBusinessesApi",
  async ({ top = 5, sortBy, order }, { rejectWithValue }) => {
    try {
      let url = `/admin/dashboard/business`;
      const params = new URLSearchParams();
      if (top) params.append('top', top);
      if (sortBy) params.append('sortBy', sortBy);
      if (order) params.append('order', order);
      if (params.toString()) url += `?${params.toString()}`;
      const response = await fetcher.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get Business Monthly API
export const getBusinessMonthlyApi = createAsyncThunk(
  "admin/getBusinessMonthlyApi",
  async ({ year }, { rejectWithValue }) => {
    try {
      let url = `/admin/dashboard/business/monthly`;
      if (year) url += `?year=${year}`;
      const response = await fetcher.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get Top Customers API
export const getTopCustomersApi = createAsyncThunk(
  "admin/getTopCustomersApi",
  async ({ top = 5, sortBy, order }, { rejectWithValue }) => {
    try {
      let url = `/admin/dashboard/customer`;
      const params = new URLSearchParams();
      if (top) params.append('top', top);
      if (sortBy) params.append('sortBy', sortBy);
      if (order) params.append('order', order);
      if (params.toString()) url += `?${params.toString()}`;
      const response = await fetcher.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get Customer Monthly API
export const getCustomerMonthlyApi = createAsyncThunk(
  "admin/getCustomerMonthlyApi",
  async ({ year }, { rejectWithValue }) => {
    try {
      let url = `/admin/dashboard/customer/monthly`;
      if (year) url += `?year=${year}`;
      const response = await fetcher.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get Wallet Transactions API
export const getWalletTransactionsApi = createAsyncThunk(
  "admin/getWalletTransactionsApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/admin/dashboard/wallet-transactions");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Get Wallet Transactions By Month API
export const getWalletTransactionsByMonthApi = createAsyncThunk(
  "admin/getWalletTransactionsByMonthApi",
  async ({ year, transactionType, direction, status }, { rejectWithValue }) => {
    try {
      let url = `/admin/dashboard/wallet-transactions/by-month`;
      const params = new URLSearchParams();
      if (year) params.append('year', year);
      if (transactionType) params.append('transactionType', transactionType);
      if (direction) params.append('direction', direction);
      if (status) params.append('status', status);
      if (params.toString()) url += `?${params.toString()}`;
      const response = await fetcher.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// System Settings APIs
export const getSystemSettingsApi = createAsyncThunk(
  "admin/getSystemSettingsApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/admin/system-setting");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const upsertSystemSettingApi = createAsyncThunk(
  "admin/upsertSystemSettingApi",
  async (settingData, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/admin/system-setting/upsert", settingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const updateSystemSettingApi = createAsyncThunk(
  "admin/updateSystemSettingApi",
  async ({ category, key, path, value }, { rejectWithValue }) => {
    try {
      const response = await fetcher.patch(
        `/admin/system-setting/${category}/${key}/value`,
        { path, value }
      );
      return response.data;
    } catch (error) {
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
    materialRequests: [],
    businesses: [],
    currentBusiness: null,
    leaderboardRewards: [],
    leaderboardPolicies: [],
    currentLeaderboardPolicy: null,
    rewardSettings: [],
    currentRewardSetting: null,
    isLoading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      currentPage: 1,
      totalPages: 0,
    },
    materialRequestPagination: {
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
    leaderboardRewardPagination: {
      page: 1,
      limit: 10,
      total: 0,
      currentPage: 1,
      totalPages: 0,
    },
    leaderboardPolicyPagination: {
      page: 1,
      limit: 10,
      total: 0,
      currentPage: 1,
      totalPages: 0,
    },
    businessStats: {
      total: 0,
      active: 0,
      blocked: 0,
    },
    filters: {
      status: 'all', // 'all', 'pending', 'approved', 'rejected'
      materialName: '',
    },
    businessFilters: {
      isBlocked: null, // null = all, true = blocked, false = unblocked
    },
    systemSettings: [],
    dashboardOverview: null,
    dashboardLoading: false,
    borrowTransactionsMonthly: null,
    topBusinesses: [],
    businessMonthly: null,
    topCustomers: [],
    customerMonthly: null,
    walletTransactions: null,
    walletTransactionsByMonth: null,
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
    setLeaderboardRewardPagination: (state, { payload }) => {
      state.leaderboardRewardPagination = { ...state.leaderboardRewardPagination, ...payload };
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
          // Remove from materialRequests if it was a request
          const requestIndex = state.materialRequests.findIndex(
            (request) => request._id === updatedId || request.id === updatedId
          );
          if (requestIndex !== -1) {
            state.materialRequests.splice(requestIndex, 1);
            // Update pagination total
            if (state.materialRequestPagination.total > 0) {
              state.materialRequestPagination.total -= 1;
            }
          }

          // Update the material status in the list
          const index = state.materials.findIndex(
            (material) => material._id === updatedId || material.id === updatedId
          );
          if (index !== -1) {
            state.materials[index].status = updatedStatus || state.materials[index].status;
            // Support both adminNote (new) and rejectReason (legacy)
            if (updated.adminNote !== undefined) {
              state.materials[index].adminNote = updated.adminNote;
            }
            if (updated.rejectReason !== undefined) {
              state.materials[index].rejectReason = updated.rejectReason;
            }
            // Update reuseLimit and depositPercent for approved materials
            if (updated.reuseLimit !== undefined) {
              state.materials[index].reuseLimit = updated.reuseLimit;
            }
            if (updated.depositPercent !== undefined) {
              state.materials[index].depositPercent = updated.depositPercent;
            }
          } else if (updatedStatus === 'approved') {
            // If approved, add to materials list if not already there
            state.materials.unshift(updated);
          }

          if (
            (state.currentMaterial?._id && state.currentMaterial._id === updatedId) ||
            (state.currentMaterial?.id && state.currentMaterial.id === updatedId)
          ) {
            if (updatedStatus) state.currentMaterial.status = updatedStatus;
            // Support both adminNote (new) and rejectReason (legacy)
            if (updated.adminNote !== undefined) {
              state.currentMaterial.adminNote = updated.adminNote;
            }
            if (updated.rejectReason !== undefined) {
              state.currentMaterial.rejectReason = updated.rejectReason;
            }
            // Update reuseLimit and depositPercent for approved materials
            if (updated.reuseLimit !== undefined) {
              state.currentMaterial.reuseLimit = updated.reuseLimit;
            }
            if (updated.depositPercent !== undefined) {
              state.currentMaterial.depositPercent = updated.depositPercent;
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
      
      // Get Material Requests
      .addCase(getMaterialRequestsApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMaterialRequestsApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.materialRequests = payload.data || [];
        // Update pagination with response data
        state.materialRequestPagination = {
          ...state.materialRequestPagination,
          total: payload.total || 0,
          currentPage: payload.currentPage || 1,
          totalPages: payload.totalPages || 0,
        };
      })
      .addCase(getMaterialRequestsApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to fetch material requests");
      })
      
      // Get Business Statistics
      .addCase(getBusinessStatsApi.pending, () => {
        // Don't set loading state for stats fetch
      })
      .addCase(getBusinessStatsApi.fulfilled, (state, { payload }) => {
        state.businessStats = {
          total: payload.total || 0,
          active: payload.active || 0,
          blocked: payload.blocked || 0,
        };
      })
      .addCase(getBusinessStatsApi.rejected, (state, { payload }) => {
        // Silently fail for stats
        console.error("Failed to fetch business stats:", payload);
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
      })
      
      // ============ LEADERBOARD REWARD EXTRA REDUCERS ============
      
      // Get Leaderboard Reward
      .addCase(getLeaderboardRewardApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLeaderboardRewardApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.leaderboardRewards = payload.data || [];
        // Update pagination with response data
        state.leaderboardRewardPagination = {
          ...state.leaderboardRewardPagination,
          total: payload.total || 0,
          currentPage: payload.currentPage || 1,
          totalPages: payload.totalPages || 0,
        };
      })
      .addCase(getLeaderboardRewardApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to fetch leaderboard rewards");
      })
      
      // ============ LEADERBOARD POLICY EXTRA REDUCERS ============
      
      // Get Leaderboard Policies
      .addCase(getLeaderboardPoliciesApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLeaderboardPoliciesApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.leaderboardPolicies = payload.data || [];
        state.leaderboardPolicyPagination = {
          ...state.leaderboardPolicyPagination,
          total: payload.total || 0,
          currentPage: payload.currentPage || 1,
          totalPages: payload.totalPages || 0,
        };
      })
      .addCase(getLeaderboardPoliciesApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to fetch leaderboard policies");
      })
      
      // Create Leaderboard Policy
      .addCase(createLeaderboardPolicyApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createLeaderboardPolicyApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        // Add the new policy to the beginning of the list
        if (payload.data) {
          state.leaderboardPolicies.unshift(payload.data);
        }
        toast.success(payload.message || "Leaderboard policy created successfully!");
      })
      .addCase(createLeaderboardPolicyApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to create leaderboard policy");
      })
      
      // Update Leaderboard Policy
      .addCase(updateLeaderboardPolicyApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateLeaderboardPolicyApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        // Update the policy in the list
        const updatedId = payload?.data?._id || payload?.data?.id;
        const index = state.leaderboardPolicies.findIndex(
          (policy) => policy._id === updatedId || policy.id === updatedId
        );
        if (index !== -1) {
          state.leaderboardPolicies[index] = payload.data;
        }
        if (
          (state.currentLeaderboardPolicy?._id && state.currentLeaderboardPolicy._id === updatedId) ||
          (state.currentLeaderboardPolicy?.id && state.currentLeaderboardPolicy.id === updatedId)
        ) {
          state.currentLeaderboardPolicy = payload.data;
        }
        toast.success(payload.message || "Leaderboard policy updated successfully!");
      })
      .addCase(updateLeaderboardPolicyApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to update leaderboard policy");
      })
      
      // ============ REWARD SETTING EXTRA REDUCERS ============
      
      // Get Reward Settings
      .addCase(getRewardSettingsApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRewardSettingsApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        // Handle different response structures
        if (Array.isArray(payload)) {
          // If payload is directly an array
          state.rewardSettings = payload;
        } else if (payload.data) {
          // If payload has data property
          if (Array.isArray(payload.data)) {
            // If data is an array
            state.rewardSettings = payload.data;
          } else if (typeof payload.data === 'object' && payload.data !== null) {
            // If data is a single object, wrap it in an array
            state.rewardSettings = [payload.data];
          } else {
            state.rewardSettings = [];
          }
        } else {
          state.rewardSettings = [];
        }
      })
      .addCase(getRewardSettingsApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to fetch reward settings");
      })
      
      // Create Reward Setting
      .addCase(createRewardSettingApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createRewardSettingApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        // Add the new setting to the beginning of the list
        if (payload.data) {
          state.rewardSettings.unshift(payload.data);
        }
        toast.success(payload.message || "Reward setting created successfully!");
      })
      .addCase(createRewardSettingApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to create reward setting");
      })
      
      // Update Reward Setting
      .addCase(updateRewardSettingApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateRewardSettingApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        // Update the setting in the list
        const updatedId = payload?.data?._id || payload?.data?.id;
        const index = state.rewardSettings.findIndex(
          (setting) => setting._id === updatedId || setting.id === updatedId
        );
        if (index !== -1) {
          state.rewardSettings[index] = payload.data;
        }
        if (
          (state.currentRewardSetting?._id && state.currentRewardSetting._id === updatedId) ||
          (state.currentRewardSetting?.id && state.currentRewardSetting.id === updatedId)
        ) {
          state.currentRewardSetting = payload.data;
        }
        toast.success(payload.message || "Reward setting updated successfully!");
      })
      .addCase(updateRewardSettingApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to update reward setting");
      })
      
      // Toggle Reward Setting
      .addCase(toggleRewardSettingApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleRewardSettingApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        // Update the setting in the list
        const updatedId = payload?.data?._id || payload?.data?.id;
        const updated = payload?.data || payload || {};
        const index = state.rewardSettings.findIndex(
          (setting) => setting._id === updatedId || setting.id === updatedId
        );
        if (index !== -1) {
          // Update the setting with the new data
          state.rewardSettings[index] = { ...state.rewardSettings[index], ...updated };
        }
        if (
          (state.currentRewardSetting?._id && state.currentRewardSetting._id === updatedId) ||
          (state.currentRewardSetting?.id && state.currentRewardSetting.id === updatedId)
        ) {
          state.currentRewardSetting = { ...state.currentRewardSetting, ...updated };
        }
        toast.success(payload.message || "Reward setting toggled successfully!");
      })
      .addCase(toggleRewardSettingApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to toggle reward setting");
      })
      // System Settings
      .addCase(getSystemSettingsApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSystemSettingsApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        const data = payload?.data ?? payload ?? [];
        state.systemSettings = Array.isArray(data) ? data : [data];
      })
      .addCase(getSystemSettingsApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to fetch system settings");
      })
      .addCase(upsertSystemSettingApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(upsertSystemSettingApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        const updated = payload?.data ?? payload;
        if (!updated) return;

        const updatedId = updated._id || updated.id;
        const updatedKey = updated.key;

        if (!Array.isArray(state.systemSettings)) {
          state.systemSettings = [];
        }

        let index = -1;
        if (updatedId) {
          index = state.systemSettings.findIndex(
            (item) => item._id === updatedId || item.id === updatedId
          );
        }
        if (index === -1 && updatedKey) {
          index = state.systemSettings.findIndex((item) => item.key === updatedKey);
        }

        if (index !== -1) {
          state.systemSettings[index] = updated;
        } else {
          state.systemSettings.unshift(updated);
        }

        toast.success(payload?.message || "System setting saved successfully!");
      })
      .addCase(upsertSystemSettingApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to save system setting");
      })
      .addCase(updateSystemSettingApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSystemSettingApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;

        const updated = payload?.data ?? payload;
        if (!updated) return;

        const updatedId = updated._id || updated.id;
        const updatedKey = updated.key;

        if (!Array.isArray(state.systemSettings)) {
          state.systemSettings = [];
        }

        let index = -1;
        if (updatedId) {
          index = state.systemSettings.findIndex(
            (item) => item._id === updatedId || item.id === updatedId
          );
        }
        if (index === -1 && updatedKey) {
          index = state.systemSettings.findIndex((item) => item.key === updatedKey);
        }

        if (index !== -1) {
          state.systemSettings[index] = updated;
        }

        toast.success(payload?.message || "System setting updated successfully!");
      })
      .addCase(updateSystemSettingApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to update system setting");
      })
      
      // Get Admin Dashboard Overview
      .addCase(getAdminDashboardOverviewApi.pending, (state) => {
        state.dashboardLoading = true;
        state.error = null;
      })
      .addCase(getAdminDashboardOverviewApi.fulfilled, (state, { payload }) => {
        state.dashboardLoading = false;
        state.error = null;
        state.dashboardOverview = payload.data || payload;
      })
      .addCase(getAdminDashboardOverviewApi.rejected, (state, { payload }) => {
        state.dashboardLoading = false;
        state.error = payload;
        toast.error(payload?.message || "Failed to fetch dashboard overview");
      })
      
      // Get Borrow Transactions Monthly
      .addCase(getBorrowTransactionsMonthlyApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBorrowTransactionsMonthlyApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.borrowTransactionsMonthly = payload.data || payload;
      })
      .addCase(getBorrowTransactionsMonthlyApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        // Don't show toast for dashboard data to avoid spam
      })
      
      // Get Top Businesses
      .addCase(getTopBusinessesApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTopBusinessesApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.topBusinesses = payload.data || (Array.isArray(payload) ? payload : []);
      })
      .addCase(getTopBusinessesApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      
      // Get Business Monthly
      .addCase(getBusinessMonthlyApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBusinessMonthlyApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.businessMonthly = payload.data || payload;
      })
      .addCase(getBusinessMonthlyApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      
      // Get Top Customers
      .addCase(getTopCustomersApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTopCustomersApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.topCustomers = payload.data || (Array.isArray(payload) ? payload : []);
      })
      .addCase(getTopCustomersApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      
      // Get Customer Monthly
      .addCase(getCustomerMonthlyApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCustomerMonthlyApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.customerMonthly = payload.data || payload;
      })
      .addCase(getCustomerMonthlyApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      
      // Get Wallet Transactions
      .addCase(getWalletTransactionsApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getWalletTransactionsApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.walletTransactions = payload.data || payload;
      })
      .addCase(getWalletTransactionsApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      
      // Get Wallet Transactions By Month
      .addCase(getWalletTransactionsByMonthApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getWalletTransactionsByMonthApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.walletTransactionsByMonth = payload.data || payload;
      })
      .addCase(getWalletTransactionsByMonthApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
  
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
  resetBusinessFilters,
  setLeaderboardRewardPagination
} = adminSlice.actions;
export default adminSlice.reducer;
